// 3D-сцена: прокрутка ведёт камеру по станциям. Каждая секция страницы с data-st="N" — станция N.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const canvas = document.getElementById('scene');
const LITE = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4 || /[?&]lite\b/.test(location.search);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const C = h => new THREE.Color(h);
let seed = 11;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const R = (a, b) => a + rnd() * (b - a);

const WINE = '#d2506c', EMBER = '#ff7a59', AMBER = '#ffc38a', MINT = '#5ed3b8', BLUE = '#8ab4f8', VIOLET = '#b79cff', INK = '#f6efe9';
// s: сторона экрана, где стоит объект (+1 справа, -1 слева, 0 по центру, 'thru' — пролёт сквозь кольцо)
const CFG = [
  { b: 'rings', s: 1, d: 9.5, h: WINE },
  { b: 'core', s: 1, d: 6.8, h: EMBER },
  { b: 'gate', s: 'thru', h: AMBER }, { b: 'gate', s: 'thru', h: EMBER }, { b: 'gate', s: 'thru', h: WINE }, { b: 'gate', s: 'thru', h: MINT },
  { b: 'cluster', s: 1, h: EMBER }, { b: 'net', s: -1, h: WINE }, { b: 'board', s: 1, h: AMBER },
  { b: 'chart', s: -1, h: MINT, d: 7.6 }, { b: 'vault', s: 1, h: BLUE }, { b: 'phone', s: -1, h: VIOLET },
  { b: 'galaxy', s: 0, d: 10.5, y: 6, ty: 1.2 },
  { b: 'pipe', s: 0, d: 10.5, y: 1.2, ty: 2.6, h: EMBER },
  { b: 'orbit', s: 0, d: 10, y: .6, ty: 0, h: AMBER },
  { b: 'sun', s: 0, d: 10, y: .2, ty: 2.4, h: EMBER },
];
const N = CFG.length, D = 32;
const O = CFG.map((_, i) => V(Math.sin(i * .9) * 7, Math.cos(i * .7) * 3, -i * D));

const renderer = new THREE.WebGLRenderer({ canvas, antialias: !LITE, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, LITE ? 1.25 : 1.5));
renderer.setClearColor(0x0a0809);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0809, .011);
const camera = new THREE.PerspectiveCamera(55, 1, .1, 400);

// --- помощники
const glow = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
function points(pos, color, size, opacity = 1, colors) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (colors) g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ map: glow, color: colors ? 0xffffff : color, vertexColors: !!colors, size, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
}
const lineMat = (color, opacity = 1) => new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
const wire = (geo, color, opacity = 1) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat(color, opacity));
const segs = (arr, color, opacity = 1) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); return new THREE.LineSegments(g, lineMat(color, opacity)); };
const solid = (geo, color, opacity = 1) => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }));
const sprite = (color, scale, opacity) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(scale); return s; };
function ringPts(r, n, jitter) { const a = []; for (let i = 0; i < n; i++) { const t = rnd() * 6.283, rr = r + R(-jitter, jitter); a.push(Math.cos(t) * rr, R(-jitter, jitter) * .5, Math.sin(t) * rr); } return a; }
const setPos = (pts, i, v) => pts.geometry.attributes.position.setXYZ(i, v.x, v.y, v.z);

// --- строители объектов. Каждый возвращает группу и функцию анимации u(t)
const B = {
  rings(h) {
    const g = new THREE.Group(), rs = [];
    [[3.1, WINE], [4.1, EMBER], [5.2, AMBER]].forEach(([r, c], i) => { const p = points(ringPts(r, LITE ? 500 : 900, .16), c, .11, .85); p.rotation.set(1.1 + i * .35, 0, i * .5); g.add(p); rs.push(p); });
    g.add(sprite(h, 9, .09));
    return { g, u: t => rs.forEach((p, i) => { p.rotation.z = t * (.05 + i * .03) * (i % 2 ? -1 : 1); p.rotation.x = 1.1 + i * .35 + Math.sin(t * .2 + i) * .12; }) };
  },
  core(h) {
    const g = new THREE.Group(), a = [], n = LITE ? 1600 : 3400;
    for (let i = 0; i < n; i++) { const u = rnd() * 2 - 1, t = rnd() * 6.283, s = Math.sqrt(1 - u * u), r = 2.2 + R(-.05, .05); a.push(s * Math.cos(t) * r, u * r, s * Math.sin(t) * r); }
    const p = points(a, h, .055, .9), w1 = wire(new THREE.IcosahedronGeometry(1.25, 1), AMBER, .7), w2 = wire(new THREE.IcosahedronGeometry(3, 1), WINE, .22);
    g.add(p, w1, w2, sprite(h, 9, .22));
    return { g, u: t => { p.rotation.y = t * .08; w1.rotation.set(t * .21, t * .17, 0); w2.rotation.set(-t * .05, -t * .07, 0); const s = 1 + Math.sin(t * 1.4) * .025; p.scale.setScalar(s); } };
  },
  gate(h) {
    const g = new THREE.Group();
    const r1 = solid(new THREE.TorusGeometry(3.4, .035, 8, 120), h), r2 = solid(new THREE.TorusGeometry(4.3, .012, 6, 120), h, .45), r3 = solid(new THREE.TorusGeometry(5.6, .008, 6, 120), h, .22);
    const halo = points(ringPts(3.4, 420, .22), h, .1, .8); halo.rotation.x = Math.PI / 2;
    const ticks = []; for (let i = 0; i < 48; i++) { const t = i / 48 * 6.283, a = i % 4 ? 3.62 : 3.8; ticks.push(Math.cos(t) * 3.5, Math.sin(t) * 3.5, 0, Math.cos(t) * a, Math.sin(t) * a, 0); }
    const tk = segs(ticks, h, .7);
    g.add(r1, r2, r3, halo, tk);
    return { g, u: t => { r2.rotation.z = t * .1; r3.rotation.z = -t * .06; halo.rotation.y = t * .15; tk.rotation.z = -t * .04; } };
  },
  cluster(h) { // Kubernetes: управляющий узел, шесть рабочих, поды на орбитах
    const g = new THREE.Group(), ns = [], ls = [];
    const hub = wire(new THREE.CylinderGeometry(.95, .95, .55, 6), AMBER); g.add(hub, solid(new THREE.SphereGeometry(.22, 12, 12), AMBER));
    for (let i = 0; i < 6; i++) { const t = i / 6 * 6.283, p = V(Math.cos(t) * 2.5, Math.sin(i * 1.7) * .5, Math.sin(t) * 2.5); const n = wire(new THREE.IcosahedronGeometry(.48, 0), h); n.position.copy(p); g.add(n); ns.push(n); ls.push(0, 0, 0, p.x, p.y, p.z); }
    ns.forEach((n, i) => { const m = ns[(i + 1) % 6].position; ls.push(n.position.x, n.position.y, n.position.z, m.x, m.y, m.z); });
    g.add(segs(ls, h, .38));
    const P = 30, pods = points(new Array(P * 3).fill(0), INK, .16, .95); g.add(pods, sprite(h, 10, .15));
    g.rotation.x = .38;
    return { g, u: t => { g.rotation.y = t * .16; hub.rotation.y = -t * .5; ns.forEach((n, i) => n.rotation.set(t * .4 + i, t * .3, 0)); for (let i = 0; i < P; i++) { const n = ns[i % 6].position, a = t * (1 + (i % 5) * .22) + i, r = .78 + (i % 3) * .14; pods.geometry.attributes.position.setXYZ(i, n.x + Math.cos(a) * r, n.y + Math.sin(a * 1.3) * .32, n.z + Math.sin(a) * r); } pods.geometry.attributes.position.needsUpdate = true; } };
  },
  net(h) { // сеть из 24 сервисов, по рёбрам бегут сообщения
    const g = new THREE.Group(), ps = [], a = [], e = [], ed = [];
    for (let i = 0; i < 24; i++) { let p; do p = V(R(-1, 1), R(-1, 1), R(-1, 1)); while (p.length() > 1); p.multiplyScalar(2.9); ps.push(p); a.push(p.x, p.y, p.z); }
    ps.forEach((p, i) => { ps.map((q, j) => [p.distanceTo(q), j]).sort((x, y) => x[0] - y[0]).slice(1, 3).forEach(([, j]) => { if (!ed.some(([x, y]) => x === j && y === i)) { ed.push([i, j]); e.push(p.x, p.y, p.z, ps[j].x, ps[j].y, ps[j].z); } }); });
    g.add(points(a, h, .34, 1), points(a, INK, .12, 1), segs(e, h, .42), sprite(h, 11, .14));
    const P = 46, pk = points(new Array(P * 3).fill(0), AMBER, .15, 1), tmp = V(0, 0, 0); g.add(pk);
    const meta = [...Array(P)].map(() => ({ e: Math.floor(rnd() * ed.length), o: rnd(), v: R(.25, .7) }));
    return { g, u: t => { g.rotation.y = t * .11; g.rotation.x = Math.sin(t * .13) * .18; meta.forEach((m, i) => { const k = (t * m.v + m.o) % 1, [x, y] = ed[m.e]; tmp.lerpVectors(ps[x], ps[y], k); setPos(pk, i, tmp); }); pk.geometry.attributes.position.needsUpdate = true; } };
  },
  board(h) { // рекламный экран, который находит и «читает» компьютерное зрение
    const g = new THREE.Group(), cv = document.createElement('canvas'); cv.width = 256; cv.height = 144; const cx = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv);
    const pal = ['#ff7a59', '#ffc38a', '#d2506c', '#5ed3b8', '#8ab4f8', '#f6efe9'];
    const draw = k => { cx.fillStyle = '#120d0e'; cx.fillRect(0, 0, 256, 144); for (let i = 0; i < 5; i++) { cx.fillStyle = pal[(k + i * 2) % 6]; cx.globalAlpha = .9; cx.fillRect(14 + ((k * 37 + i * 53) % 150), 12 + ((k * 19 + i * 29) % 80), 34 + ((k + i) % 4) * 22, 16 + ((k + i * 3) % 3) * 18); } cx.globalAlpha = 1; tex.needsUpdate = true; };
    draw(0);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.02), new THREE.MeshBasicMaterial({ map: tex }));
    const W = 1.95, Hh = 1.16, L = .42, br = [];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => br.push(sx * W, sy * Hh, 0, sx * (W - L), sy * Hh, 0, sx * W, sy * Hh, 0, sx * W, sy * (Hh - L), 0));
    const brk = segs(br, MINT, 1); brk.position.z = .25;
    const scan = solid(new THREE.PlaneGeometry(3.9, .03), MINT, .9); scan.position.z = .26;
    g.add(scr, wire(new THREE.BoxGeometry(3.75, 2.16, .16), h, .9), brk, scan, segs([0, -1.08, 0, 0, -3.6, 0, -.9, -3.6, 0, .9, -3.6, 0], h, .6), sprite(h, 11, .13));
    g.rotation.y = -.42; let last = -1;
    return { g, u: t => { const k = Math.floor(t / 1.1); if (k !== last) { last = k; draw(k); } g.rotation.y = -.42 + Math.sin(t * .3) * .16; scan.position.y = Math.sin(t * 1.5) * 1.02; brk.scale.setScalar(1 + Math.sin(t * 3) * .025); brk.material.opacity = .65 + Math.sin(t * 3) * .35; } };
  },
  chart(h) { // свечной график
    const g = new THREE.Group(), n = 38, box = new THREE.BoxGeometry(.16, 1, .16), up = C(MINT), dn = C('#ff5f6d');
    const bodies = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial(), n), m = new THREE.Matrix4(), w = [], data = [];
    let p = 0; for (let i = 0; i < n; i++) { const o = p, c = p + R(-.55, .6) + Math.sin(i * .35) * .12; p = c; data.push({ o, c, hi: Math.max(o, c) + R(.05, .4), lo: Math.min(o, c) - R(.05, .4) }); }
    const mid = data.reduce((s, d) => s + d.c, 0) / n;
    const put = (i, d) => { const x = (i - n / 2) * .25, hgt = Math.max(.04, Math.abs(d.c - d.o)); m.makeScale(1, hgt, 1); m.setPosition(x, (d.o + d.c) / 2 - mid, 0); bodies.setMatrixAt(i, m); bodies.setColorAt(i, d.c >= d.o ? up : dn); };
    data.forEach((d, i) => { put(i, d); const x = (i - n / 2) * .25; w.push(x, d.lo - mid, 0, x, d.hi - mid, 0); });
    const grid = []; for (let i = -3; i <= 3; i++) grid.push(-5, i * .8, -.2, 5, i * .8, -.2); for (let i = -5; i <= 5; i++) grid.push(i, -2.4, -.2, i, 2.4, -.2);
    const price = segs([-5, 0, .1, 5, 0, .1], AMBER, .9);
    g.add(bodies, segs(w, INK, .55), segs(grid, h, .13), price, sprite(h, 12, .12)); g.rotation.set(.1, .5, 0);
    const lastD = data[n - 1], base = lastD.c;
    return { g, u: t => { g.rotation.y = .5 + Math.sin(t * .25) * .18; lastD.c = base + Math.sin(t * 1.7) * .45 + Math.sin(t * 4.1) * .12; put(n - 1, lastD); bodies.instanceMatrix.needsUpdate = true; bodies.instanceColor.needsUpdate = true; price.position.y = lastD.c - mid; } };
  },
  vault(h) { // слои защиты вокруг ядра
    const g = new THREE.Group(), core = wire(new THREE.OctahedronGeometry(1.05, 0), INK), inner = solid(new THREE.OctahedronGeometry(.42, 0), h), rs = [];
    [[1.9, h], [2.4, VIOLET], [2.95, MINT]].forEach(([r, c], i) => { const rr = solid(new THREE.TorusGeometry(r, .022, 8, 110), c, .95); rr.rotation.set(i * 1.1, i * .7, 0); g.add(rr); rs.push(rr); });
    const halo = points(ringPts(3.5, 500, .5), h, .07, .7);
    g.add(core, inner, halo, sprite(h, 10, .16));
    return { g, u: t => { core.rotation.set(t * .3, t * .4, 0); inner.rotation.set(-t * .6, t * .5, 0); rs[0].rotation.x = t * .5; rs[1].rotation.y = t * .38; rs[2].rotation.set(t * .22, 0, t * .3); halo.rotation.y = t * .06; inner.scale.setScalar(1 + Math.sin(t * 2) * .12); } };
  },
  phone(h) { // приложение и синхронизация с сервером
    const g = new THREE.Group(), cv = document.createElement('canvas'); cv.width = 128; cv.height = 256; const cx = cv.getContext('2d');
    cx.fillStyle = '#141011'; cx.fillRect(0, 0, 128, 256); cx.fillStyle = h; cx.fillRect(14, 22, 62, 12); cx.fillStyle = '#f6efe9'; for (let i = 0; i < 6; i++) { cx.globalAlpha = .75 - i * .08; cx.fillRect(14, 58 + i * 30, 100 - (i % 3) * 22, 9); cx.globalAlpha = .28; cx.fillRect(14, 72 + i * 30, 70, 5); }
    const ph = new THREE.Group(); ph.add(new THREE.Mesh(new THREE.PlaneGeometry(1.42, 2.86), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) })), wire(new THREE.BoxGeometry(1.6, 3.05, .16), h));
    const cloud = wire(new THREE.IcosahedronGeometry(.6, 0), AMBER), cp = V(2.9, 1.7, -.4); cloud.position.copy(cp);
    const arc = solid(new THREE.TorusGeometry(2.3, .018, 6, 80, Math.PI * 1.25), h, .8);
    const P = 14, pk = points(new Array(P * 3).fill(0), AMBER, .15, 1), from = V(.8, .4, 0), tmp = V(0, 0, 0);
    g.add(ph, cloud, arc, pk, segs([from.x, from.y, 0, cp.x, cp.y, cp.z], h, .4), sprite(h, 10, .14));
    return { g, u: t => { ph.rotation.y = Math.sin(t * .5) * .35 - .15; ph.rotation.x = Math.sin(t * .37) * .08; cloud.rotation.set(t * .5, t * .4, 0); arc.rotation.z = t * .6; for (let i = 0; i < P; i++) { let k = (t * .45 + i / P) % 1; if (i % 2) k = 1 - k; tmp.lerpVectors(from, cp, k); tmp.y += Math.sin(k * Math.PI) * .35 * (i % 2 ? -1 : 1); setPos(pk, i, tmp); } pk.geometry.attributes.position.needsUpdate = true; } };
  },
  galaxy() { // все проекты: спираль, яркие точки — проекты
    const g = new THREE.Group(), a = [], col = [], n = LITE ? 1400 : 3200, pal = [C(WINE), C(EMBER), C(AMBER)];
    for (let i = 0; i < n; i++) { const arm = i % 3, r = Math.pow(rnd(), .6) * 8, t = r * .55 + arm * 2.094 + R(-.28, .28); a.push(Math.cos(t) * r, R(-.25, .25) * (1.4 - r / 8), Math.sin(t) * r); const c = pal[(arm + (rnd() < .3 ? 1 : 0)) % 3]; col.push(c.r, c.g, c.b); }
    const dust = points(a, 0, .1, .8, col);
    const list = (typeof PROJECTS !== 'undefined') ? PROJECTS : [], pa = [], pc = [], sc = { live: C(MINT), ready: C(AMBER), pilot: C(BLUE), proto: C(VIOLET), rnd: C(VIOLET), done: C('#c9bdb7') };
    list.forEach((p, i) => { const r = 1.3 + i * .25, t = i * 2.4; pa.push(Math.cos(t) * r, .12, Math.sin(t) * r); const c = sc[p.s] || C(INK); pc.push(c.r, c.g, c.b); });
    const stars = points(pa, 0, .95, 1, pc), cores = points(pa, INK, .26, 1);
    g.add(dust, stars, cores, sprite(EMBER, 7, .3));
    const api = { g, stars, list, base: pc.slice(), u: t => { g.rotation.y = t * .035; stars.material.size = .95 + Math.sin(t * 2) * .08; } };
    return api;
  },
  pipe(h) { // шесть шагов процесса, по линии бегут импульсы
    const g = new THREE.Group(), ns = [];
    for (let i = 0; i < 6; i++) { const n = wire(new THREE.IcosahedronGeometry(.5, 0), i === 5 ? MINT : h); n.position.x = (i - 2.5) * 2.5; g.add(n, (() => { const s = solid(new THREE.SphereGeometry(.12, 10, 10), AMBER); s.position.x = n.position.x; return s; })()); ns.push(n); }
    g.add(segs([-6.25, 0, 0, 6.25, 0, 0], h, .5));
    const P = 5, pk = points(new Array(P * 3).fill(0), AMBER, .42, 1); g.add(pk);
    return { g, u: t => { for (let i = 0; i < P; i++) { const k = (t * .16 + i / P) % 1; pk.geometry.attributes.position.setXYZ(i, -6.25 + k * 12.5, 0, 0); } pk.geometry.attributes.position.needsUpdate = true; ns.forEach((n, i) => { let near = 9; for (let j = 0; j < P; j++) near = Math.min(near, Math.abs(-6.25 + ((t * .16 + j / P) % 1) * 12.5 - n.position.x)); n.scale.setScalar(1 + Math.max(0, .6 - near) * .9); n.rotation.set(t * .5 + i, t * .4, 0); }); } };
  },
  orbit(h) { // технологии на трёх орбитах
    const g = new THREE.Group(), rs = [], box = new THREE.BoxGeometry(.26, .26, .26), m = new THREE.Matrix4();
    [[3, 12, h], [4.2, 16, EMBER], [5.5, 20, WINE]].forEach(([r, n, c], k) => { const im = new THREE.InstancedMesh(box, new THREE.MeshBasicMaterial({ color: c, wireframe: true }), n); for (let i = 0; i < n; i++) { const t = i / n * 6.283; m.makeRotationFromEuler(new THREE.Euler(t, t * 2, 0)); m.setPosition(Math.cos(t) * r, 0, Math.sin(t) * r); im.setMatrixAt(i, m); } const grp = new THREE.Group(); grp.add(im, solid(new THREE.TorusGeometry(r, .008, 4, 120), c, .35).rotateX(Math.PI / 2)); grp.rotation.set(.5 + k * .35, 0, k * .4 - .3); g.add(grp); rs.push(grp); });
    g.add(wire(new THREE.IcosahedronGeometry(1, 1), INK, .6), sprite(h, 9, .16));
    return { g, u: t => rs.forEach((r, i) => { r.rotation.y = t * (.16 - i * .04) * (i % 2 ? -1 : 1); }) };
  },
  sun(h) { // финал
    const g = new THREE.Group(), a = [], n = LITE ? 900 : 2000;
    for (let i = 0; i < n; i++) { const u = rnd() * 2 - 1, t = rnd() * 6.283, s = Math.sqrt(1 - u * u), r = 1.75 + Math.pow(rnd(), 2.2) * 2.4; a.push(s * Math.cos(t) * r, u * r, s * Math.sin(t) * r); }
    const cor = points(a, AMBER, .07, .9), ball = solid(new THREE.SphereGeometry(1.55, 48, 48), '#ff8a5c'), g1 = sprite(EMBER, 16, .55), g2 = sprite(WINE, 34, .28);
    g.add(ball, cor, g1, g2);
    return { g, u: t => { cor.rotation.y = t * .1; cor.rotation.x = t * .04; g1.scale.setScalar(16 + Math.sin(t * 1.2) * 1.2); } };
  },
};

const objs = CFG.map((c, i) => { const o = B[c.b](c.h); o.g.position.copy(O[i]); scene.add(o.g); return o; });
const galaxy = objs[12];

// --- звёзды, туманности, поток вдоль маршрута
{
  const n = LITE ? 3000 : 7500, a = [], col = [], pal = [C(INK), C(INK), C(AMBER), C(WINE), C(EMBER)], zmax = N * D + 80;
  for (let i = 0; i < n; i++) { a.push(R(-90, 90), R(-55, 55), R(50, -zmax)); const c = pal[Math.floor(rnd() * 5)], k = R(.35, 1); col.push(c.r * k, c.g * k, c.b * k); }
  const st = points(a, 0, .34, .9, col); st.material.fog = false; scene.add(st);
  [WINE, EMBER, WINE, VIOLET, EMBER, WINE, AMBER, MINT, WINE, BLUE, VIOLET, EMBER, WINE, AMBER, EMBER, WINE].forEach((c, i) => { const s = sprite(c, R(60, 110), R(.05, .1)); s.material.fog = false; s.position.set(R(-45, 45), R(-22, 22), -i * D - R(15, 40)); scene.add(s); });
  const curve = new THREE.CatmullRomCurve3(O.map(p => p.clone())), sa = [], m = LITE ? 900 : 2200;
  for (let i = 0; i < m; i++) { const p = curve.getPoint(rnd()); sa.push(p.x + R(-.9, .9), p.y + R(-.9, .9) - 3.2, p.z + R(-.9, .9)); }
  scene.add(points(sa, AMBER, .06, .55));
}

// --- постобработка
let composer = null;
if (!LITE) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .7, .6, .18));
  composer.addPass(new OutputPass());
}

// --- раскладка секций и поза камеры
let secs = [], narrow = false;
function layout() {
  const vh = innerHeight;
  secs = [...document.querySelectorAll('[data-st]')].sort((a, b) => a.dataset.st - b.dataset.st).map(el => { const r = el.getBoundingClientRect(), top = r.top + scrollY, bot = top + r.height; let a = top + vh / 2, b = bot - vh / 2; const short = b <= a + 4; if (short) a = b = (top + bot) / 2; return { a, b, short }; });
}
function resize() {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); if (composer) composer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix(); narrow = camera.aspect < .9; layout();
}
const ease = f => f * f * (3 - 2 * f);
function pose(i, p, pos, tgt) {
  const o = O[i], c = CFG[i];
  if (c.s === 'thru') { pos.set(o.x, o.y, o.z + 5.5 - p * 3); tgt.set(o.x, o.y, o.z - 22); return; }
  const s = narrow ? 0 : c.s, d = (c.d || 6.3) * (narrow ? 1.5 : 1), ang = (p - .5) * .55 - s * .18;
  pos.set(o.x + Math.sin(ang) * d - s * 1.1, o.y + (c.y ?? .5), o.z + Math.cos(ang) * d);
  const ty = c.s === 0 ? (c.ty ?? 0) * (narrow ? 1.25 : 1) : (narrow ? 2.7 : 0);
  tgt.set(o.x - s * 2.7, o.y - ty, o.z);
}
const pA = V(0, 0, 0), tA = V(0, 0, 0), pB = V(0, 0, 0), tB = V(0, 0, 0), look = V(0, 0, 0), prev = V(0, 0, 0);
let tf = 0;
function target() {
  if (!secs.length) return;
  const y = scrollY + innerHeight / 2, n = secs.length;
  if (y <= secs[0].a) { tf = 0; pose(0, 0, pA, tA); return; }
  for (let i = 0; i < n; i++) {
    const s = secs[i];
    if (y <= s.b || i === n - 1) { tf = i; pose(i, s.short ? .5 : Math.min(1, (y - s.a) / (s.b - s.a)), pA, tA); return; }
    const nx = secs[i + 1];
    if (y < nx.a) { const f = ease((y - s.b) / (nx.a - s.b)); tf = i + f; pose(i, s.short ? .5 : 1, pA, tA); pose(i + 1, nx.short ? .5 : 0, pB, tB); pA.lerp(pB, f); tA.lerp(tB, f); pA.y += Math.sin(f * Math.PI) * 1.2; return; }
  }
}

// --- мышь, подсказки в галактике
let mx = 0, my = 0, px = -1, py = -1, hover = -1;
const tip = document.getElementById('tip'), pv = V(0, 0, 0);
addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; px = e.clientX; py = e.clientY; }, { passive: true });
function pick() {
  if (!tip || !galaxy.list.length || Math.abs(tf - 12) > .45 || px < 0) { if (hover >= 0) { hover = -1; tip.hidden = true; canvas.style.cursor = ''; } return; }
  const pos = galaxy.stars.geometry.attributes.position; let best = -1, bd = 26;
  for (let i = 0; i < pos.count; i++) { pv.fromBufferAttribute(pos, i).applyMatrix4(galaxy.g.matrixWorld).project(camera); if (pv.z > 1) continue; const d = Math.hypot((pv.x * .5 + .5) * innerWidth - px, (-pv.y * .5 + .5) * innerHeight - py); if (d < bd) { bd = d; best = i; } }
  const el = document.elementFromPoint(px, py);
  if (best >= 0 && el && el.closest('.pc,.filters,.nav,a,button')) best = -1;
  if (best !== hover) { hover = best; if (best < 0) { tip.hidden = true; } else { const p = galaxy.list[best], lang = document.documentElement.dataset.lang || 'ru', tx = o => typeof o === 'string' ? o : o[lang]; tip.innerHTML = `<b>${tx(p.n)}</b><span>${p.y} · ${tx(STATUS[p.s])}</span>`; tip.hidden = false; } }
  if (hover >= 0) { tip.style.transform = `translate(${px + 16}px,${py + 16}px)`; }
}
addEventListener('click', e => { if (hover < 0 || e.target.closest('a,button,.pc')) return; window.dispatchEvent(new CustomEvent('pick', { detail: hover })); });
// фильтр проектов приглушает звёзды не из выбранной категории
addEventListener('filter', e => { const c = galaxy.stars.geometry.attributes.color, f = e.detail; galaxy.list.forEach((p, i) => { const k = f === 'all' || p.c.includes(f) ? 1 : .08; c.setXYZ(i, galaxy.base[i * 3] * k, galaxy.base[i * 3 + 1] * k, galaxy.base[i * 3 + 2] * k); }); c.needsUpdate = true; });

addEventListener('resize', resize);
addEventListener('relayout', layout);
new ResizeObserver(layout).observe(document.body);
resize(); target(); camera.position.copy(pA); look.copy(tA); prev.copy(pA);

let last = performance.now(), lastIdx = -1, shown = false, fov = 55, slow = 0, acc = 0, t0f = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) { last = now; return; }
  const dt = Math.min(.05, (now - last) / 1000), t = now / 1000; last = now;
  target();
  const k = 1 - Math.exp(-dt * 4.5);
  camera.position.lerp(pA, k); look.lerp(tA, k);
  const speed = camera.position.distanceTo(prev) / Math.max(dt, .001); prev.copy(camera.position);
  fov += ((55 + Math.min(20, speed * .28)) - fov) * (1 - Math.exp(-dt * 5));
  if (Math.abs(camera.fov - fov) > .02) { camera.fov = fov; camera.updateProjectionMatrix(); }
  camera.lookAt(look.x + mx * .9, look.y - my * .6, look.z);
  camera.rotateZ(-mx * .025);
  objs.forEach((o, i) => { const vis = Math.abs(tf - i) < 1.35; o.g.visible = vis; if (vis) o.u(t); });
  pick();
  const idx = Math.round(tf);
  if (idx !== lastIdx) { lastIdx = idx; window.dispatchEvent(new CustomEvent('station', { detail: idx })); }
  composer ? composer.render() : renderer.render(scene, camera);
  // слабая машина: если кадры долгие, отключаем свечение и снижаем разрешение
  if (slow >= 0) { acc += now - t0f; t0f = now; if (++slow === 50) { if (acc / 50 > 42) { if (composer) composer = null; renderer.setPixelRatio(1); resize(); } slow = -1; } }
  if (!shown) { shown = true; document.documentElement.classList.add('gl'); window.dispatchEvent(new Event('scene-ready')); }
}
requestAnimationFrame(frame);
