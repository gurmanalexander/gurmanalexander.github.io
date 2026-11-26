// Логика «командного центра»: карта связей, схемы систем, таблица проектов, терминал, GitHub.
(function () {
  const root = document.documentElement, $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lang = 'ru', cat = 'all', query = '', sort = { k: null, d: 1 }, sysI = 0;
  try { lang = localStorage.getItem('lang') || (/^(ru|kk|uk|be)/i.test(navigator.language || 'ru') ? 'ru' : 'en'); } catch (e) {}
  const tx = o => typeof o === 'string' ? o : o[lang];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = (ru, en) => lang === 'ru' ? ru : en;
  const SORD = ['live', 'pilot', 'ready', 'proto', 'rnd', 'done'];

  // Схемы архитектуры главных систем. x: колонка 0–4, y: ряд 0–2. k: client | service | data | ext | infra
  const n = (id, x, y, k, label, sub) => ({ id, x, y, k, label, sub });
  const ARCH = [
    { foot: 'Kubernetes · Argo CD · Terraform · VK Cloud KZ',
      nodes: [n('g', 0, 0, 'client', L('Гость', 'Guest'), 'React 19 · PWA'), n('o', 0, 2, 'client', L('Кабинет владельца', 'Owner console'), 'React 19 · Vite'),
        n('api', 1, 1, 'service', 'API', 'NestJS · CQRS'), n('pg', 2, 0, 'data', 'PostgreSQL', 'Row-Level Security'), n('q', 2, 2, 'data', 'Redis', 'BullMQ'),
        n('ai', 3, 1, 'service', L('AI-сервисы', 'AI services'), 'FastAPI · OCR'), n('w', 3, 2, 'service', L('Фоновые задачи', 'Workers'), 'jobs'),
        n('llm', 4, 1, 'ext', 'OpenAI · Gemini', 'LLM API'), n('ik', 4, 2, 'ext', 'iiko', L('касса ресторана', 'restaurant POS'))],
      edges: [['g', 'api'], ['o', 'api'], ['api', 'pg'], ['api', 'q'], ['api', 'ai'], ['q', 'w'], ['ai', 'llm'], ['w', 'ik']] },
    { foot: L('16 backend-сервисов · Kubernetes · Prometheus · ELK', '16 backend services · Kubernetes · Prometheus · ELK'),
      nodes: [n('web', 0, 0, 'client', L('Сайт', 'Website'), 'Nuxt · Vue'), n('adm', 0, 2, 'client', L('Админка', 'Admin'), 'Angular'),
        n('gw', 1, 1, 'service', L('API-шлюз', 'API gateway'), 'Nginx · OAuth2'), n('au', 2, 0, 'service', L('Авторизация', 'Auth'), 'Laravel'),
        n('doc', 2, 1, 'service', L('Документы и ЭДО', 'Documents'), 'Laravel'), n('bil', 2, 2, 'service', L('Биллинг', 'Billing'), 'Laravel'),
        n('sig', 3, 0, 'service', L('Подписание', 'E-signature'), 'Java · NCANode'), n('mq', 3, 1, 'data', 'RabbitMQ', L('события', 'events')),
        n('db', 3, 2, 'data', 'PostgreSQL', 'Elasticsearch · Redis'), n('gov', 4, 0, 'ext', L('Госсистемы РК', 'Gov systems'), 'eGov · ЕСЭДО'),
        n('pay', 4, 2, 'ext', L('Платежи', 'Payments'), 'Halyk · Qiwi')],
      edges: [['web', 'gw'], ['adm', 'gw'], ['gw', 'au'], ['gw', 'doc'], ['gw', 'bil'], ['doc', 'sig'], ['sig', 'gov'], ['doc', 'mq'], ['bil', 'db'], ['bil', 'pay'], ['mq', 'bil', 1]] },
    { foot: L('Серверы распознавания поднимаются под нагрузку и гасятся сами', 'Recognition servers scale up under load and shut down on their own'),
      nodes: [n('m', 0, 1, 'client', L('Монтажник', 'Field worker'), L('видео с телефона', 'phone video')), n('bot', 1, 1, 'service', L('Telegram-бот', 'Telegram bot'), 'Python · aiogram'),
        n('q', 2, 1, 'data', L('Очередь задач', 'Job queue'), 'PostgreSQL'), n('sc', 2, 0, 'infra', L('Автоскейлер', 'Autoscaler'), 'DigitalOcean'),
        n('c1', 3, 0, 'service', L('Поиск экрана', 'Find the screen'), 'Grounding DINO · SAM 2'), n('c2', 3, 1, 'service', L('Выпрямление', 'Rectify'), 'OpenCV'),
        n('c3', 3, 2, 'service', L('Распознавание', 'Recognise ads'), 'SIFT · FLANN'), n('rep', 4, 1, 'service', L('Отчёт', 'Report'), 'PDF'),
        n('adv', 4, 2, 'client', L('Рекламодатель', 'Advertiser'), L('доказательство показа', 'proof of play'))],
      edges: [['m', 'bot'], ['bot', 'q'], ['q', 'c1'], ['sc', 'c1', 1], ['c1', 'c2'], ['c2', 'c3'], ['c3', 'rep'], ['rep', 'adv']] },
    { foot: L('Сервера нет: браузер говорит с биржами напрямую', 'No server: the browser talks to the exchanges directly'),
      nodes: [n('bw', 0, 0, 'ext', 'Binance', 'WebSocket'), n('br', 0, 2, 'ext', 'Binance', 'REST'),
        n('ch', 2, 0, 'service', L('Графики', 'Charts'), 'Lightweight Charts'), n('app', 2, 1, 'service', L('Терминал', 'Terminal'), 'Vue 3 · TypeScript · PWA'),
        n('ls', 2, 2, 'data', L('Хранилище браузера', 'Browser storage'), L('раскладки, рисунки', 'layouts, drawings')),
        n('yw', 4, 0, 'ext', 'Bybit', 'WebSocket'), n('yr', 4, 2, 'ext', 'Bybit', 'REST')],
      edges: [['bw', 'app'], ['br', 'app'], ['yw', 'app'], ['yr', 'app'], ['app', 'ch'], ['app', 'ls']] },
    { foot: L('Деплой через GitHub Actions · эксплуатация AI-агентом с минимальными правами', 'Deploys via GitHub Actions · operated by an AI agent with minimal rights'),
      nodes: [n('u', 0, 1, 'client', L('Посетитель', 'Visitor'), L('вход по ЭЦП', 'e-signature login')), n('cd', 1, 1, 'service', 'Caddy', 'TLS'),
        n('nx', 2, 0, 'service', L('Сайт и админка', 'Site & admin'), 'Next.js 16 · React 19'), n('api', 2, 2, 'service', 'API', 'Laravel 13 · PHP 8.4'),
        n('ci', 3, 0, 'infra', L('Деплой', 'Deploy'), 'GitHub Actions'), n('s3', 3, 1, 'data', L('Файлы', 'Files'), 'MinIO'), n('db', 3, 2, 'data', L('База данных', 'Database'), 'SQL'),
        n('ag', 4, 0, 'infra', L('AI-агент', 'AI agent'), L('минимум прав', 'minimal rights')), n('bk', 4, 2, 'infra', L('Бэкапы', 'Backups'), 'restic')],
      edges: [['u', 'cd'], ['cd', 'nx'], ['cd', 'api'], ['api', 's3'], ['api', 'db'], ['db', 'bk'], ['ag', 'ci', 1], ['ci', 'nx', 1]] },
    { foot: L('Terraform · деплой с автооткатом · восстановление бэкапов проверяется каждую ночь', 'Terraform · deploys with auto-rollback · backup restores verified nightly'),
      nodes: [n('web', 0, 0, 'client', L('Сайт', 'Website'), 'React 19 · SSR'), n('app', 0, 2, 'client', L('Приложение', 'Mobile app'), 'Flutter'),
        n('lo', 1, 2, 'data', L('Офлайн-база', 'Offline store'), 'SQLite · outbox'), n('adm', 2, 0, 'service', L('Админка', 'Admin'), 'Filament'),
        n('api', 2, 1, 'service', 'API', 'Laravel 12'), n('ci', 2, 2, 'infra', 'CI/CD', 'GitHub Actions'),
        n('my', 3, 0, 'data', 'MySQL', ''), n('rd', 3, 1, 'data', 'Redis', L('кэш, очереди', 'cache, queues')), n('fc', 3, 2, 'ext', 'Push', 'Firebase FCM'),
        n('bk', 4, 0, 'infra', L('Бэкапы', 'Backups'), 'DO Spaces')],
      edges: [['web', 'api'], ['app', 'lo'], ['lo', 'api'], ['adm', 'my'], ['api', 'my'], ['api', 'rd'], ['api', 'fc'], ['my', 'bk'], ['ci', 'api', 1]] },
    { foot: L('Docker Compose · видимость каждого материала по языкам', 'Docker Compose · per-language visibility for every article'),
      nodes: [n('r', 0, 0, 'client', L('Читатель', 'Reader'), L('несколько языков', 'several languages')), n('e', 0, 2, 'client', L('Редактор', 'Editor'), ''),
        n('site', 1, 0, 'service', L('Сайт', 'Website'), 'Inertia · Vue 3'), n('adm', 1, 2, 'service', L('Админка', 'Admin'), 'Filament'),
        n('app', 2, 1, 'service', L('Приложение', 'Application'), 'Laravel 11'), n('imp', 3, 0, 'service', L('Импорт архива', 'Archive import'), L('консольные команды', 'console commands')),
        n('db', 3, 1, 'data', L('База данных', 'Database'), 'SQL'), n('md', 3, 2, 'data', L('Медиафайлы', 'Media files'), ''),
        n('xl', 4, 0, 'ext', 'Excel', L('прежние материалы', 'legacy content')), n('rss', 4, 1, 'ext', 'RSS', L('лента новостей', 'news feed'))],
      edges: [['r', 'site'], ['site', 'app'], ['e', 'adm'], ['adm', 'app'], ['app', 'db'], ['app', 'md'], ['xl', 'imp'], ['imp', 'db'], ['rss', 'db', 1]] },
  ];

  // На телефоне схема поворачивается: поток идёт сверху вниз и помещается по ширине без прокрутки.
  const mq = matchMedia('(max-width: 720px)'); let mob = mq.matches;
  const wrap = (s, max) => { if (!s || s.length <= max) return s ? [s] : []; const parts = s.includes(' · ') ? s.split(' · ') : s.split(' '), sep = s.includes(' · ') ? ' · ' : ' '; let l1 = parts[0], i = 1; while (i < parts.length && (l1 + sep + parts[i]).length <= max) l1 += sep + parts[i++]; return i < parts.length ? [l1, parts.slice(i).join(sep)] : [l1]; };
  function diagram(a) {
    const M = mob, cw = M ? 118 : 152, chh = M ? 88 : 92, nw = M ? 110 : 140, nh = M ? 62 : 52, cols = M ? 3 : 5, rows = M ? 5 : 3, padX = M ? 4 : 12;
    const W = (cols - 1) * cw + nw + padX * 2, H = (rows - 1) * chh + nh + 28;
    const pos = {}; a.nodes.forEach(o => { const gx = M ? o.y : o.x, gy = M ? o.x : o.y; pos[o.id] = [padX + gx * cw + nw / 2, 14 + gy * chh + nh / 2]; });
    const ed = a.edges.map(([f, t, dash], i) => { const [x1, y1] = pos[f], [x2, y2] = pos[t];
      return `<path id="ed${i}" class="ed${dash ? ' dash' : ''}" d="M${x1} ${y1}L${x2} ${y2}"/>` + (reduce ? '' : `<circle r="3" class="pk"><animateMotion dur="${(3.2 + (i % 3) * .9).toFixed(1)}s" begin="${(i * .45).toFixed(2)}s" repeatCount="indefinite"><mpath href="#ed${i}"/></animateMotion></circle>`); }).join('');
    const nd = a.nodes.map(o => { const [cx, cy] = pos[o.id], ls = M ? wrap(tx(o.label), 15) : [tx(o.label)], ss = M ? wrap(tx(o.sub), 17) : (tx(o.sub) ? [tx(o.sub)] : []);
      const lh = M ? 13.5 : 15, sh = M ? 11.5 : 13, total = ls.length * lh + ss.length * sh; let y = cy - total / 2 + lh * .78;
      const t1 = ls.map(l => { const r = `<text class="nl" x="${cx}" y="${y.toFixed(1)}" text-anchor="middle">${esc(l)}</text>`; y += lh; return r; }).join(''); y += sh - lh + 1;
      const t2 = ss.map(l => { const r = `<text class="ns" x="${cx}" y="${y.toFixed(1)}" text-anchor="middle">${esc(l)}</text>`; y += sh; return r; }).join('');
      return `<g class="k-${o.k}"><rect x="${cx - nw / 2}" y="${cy - nh / 2}" width="${nw}" height="${nh}" rx="8"/>${t1}${t2}</g>`; }).join('');
    const lg = [['client', T('клиент', 'client')], ['service', T('сервис', 'service')], ['data', T('данные', 'data')], ['infra', T('инфраструктура', 'infrastructure')], ['ext', T('внешняя система', 'external')]]
      .filter(([k]) => a.nodes.some(o => o.k === k)).map(([k, l]) => `<span><i class="l-${k}"></i>${l}</span>`).join('');
    return `<div class="dia"><div class="cap"><span>${T('схема', 'architecture')}</span><span>${esc(tx(a.foot))}</span></div><svg class="${M ? 'mob' : ''}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('Схема архитектуры', 'Architecture diagram')}">${ed}${nd}</svg><div class="foot">${lg}</div></div>`;
  }

  // --- карта «проекты ↔ технологии»
  function graph() {
    const S = mob ? 520 : 700, c = S / 2, rP = mob ? 128 : 132, rT = mob ? 236 : 236, techs = [];
    PROJECTS.forEach(p => p.t.forEach(t => { if (!techs.includes(t)) techs.push(t); }));
    const pp = PROJECTS.map((p, i) => { const a = i / PROJECTS.length * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * rP, c + Math.sin(a) * rP]; });
    const tp = techs.map((t, i) => { const a = i / techs.length * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * rT, c + Math.sin(a) * rT, a]; });
    let e = '';
    PROJECTS.forEach((p, i) => p.t.forEach(t => { const j = techs.indexOf(t), [x1, y1] = pp[i], [x2, y2] = tp[j]; e += `<path class="e" data-p="${i}" data-t="${j}" d="M${x1.toFixed(1)} ${y1.toFixed(1)}Q${((x1 + x2) / 2 + (c - (x1 + x2) / 2) * .35).toFixed(1)} ${((y1 + y2) / 2 + (c - (y1 + y2) / 2) * .35).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`; }));
    const pn = PROJECTS.map((p, i) => `<g class="n p" data-p="${i}" tabindex="0" role="button" aria-label="${esc(tx(p.n))}"><circle cx="${pp[i][0].toFixed(1)}" cy="${pp[i][1].toFixed(1)}" r="12" fill="transparent"/><circle cx="${pp[i][0].toFixed(1)}" cy="${pp[i][1].toFixed(1)}" r="6" class="s-${p.s}"/></g>`).join('');
    const tn = techs.map((t, j) => { const [x, y, a] = tp[j], deg = a * 180 / Math.PI, flip = Math.cos(a) < 0; return `<g class="n t" data-t="${j}" tabindex="0" role="button" aria-label="${esc(t)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${mob ? 13 : 9}" fill="transparent" style="fill:transparent"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${mob ? 5 : 3.2}"/>${mob ? '' : `<text transform="translate(${(c + Math.cos(a) * (rT + 10)).toFixed(1)} ${(c + Math.sin(a) * (rT + 10)).toFixed(1)}) rotate(${(flip ? deg + 180 : deg).toFixed(1)})" text-anchor="${flip ? 'end' : 'start'}" dominant-baseline="middle">${esc(t)}</text>`}</g>`; }).join('');
    const d1 = T(`${PROJECTS.length} проектов`, `${PROJECTS.length} projects`), d2 = T(`${techs.length} технологий`, `${techs.length} technologies`);
    $('graph').innerHTML = `<svg viewBox="0 0 ${S} ${S}" role="group" aria-label="${T('Карта проектов и технологий', 'Map of projects and technologies')}">${e}${pn}${tn}<text class="c1" id="gc1" x="${c}" y="${c - 4}" text-anchor="middle">${d1}</text><text class="c2" id="gc2" x="${c}" y="${c + 16}" text-anchor="middle">${d2}</text></svg>`;
    if (mob) $('graph').insertAdjacentHTML('beforeend', `<div class="ginfo" id="ginfo"></div>`);
    const hint = `<p class="gh0">${T('Нажмите на точку: внутри проекты, снаружи технологии', 'Tap a dot: projects inside, technologies outside')}</p>`, gi = () => $('ginfo');
    if (mob) gi().innerHTML = hint;
    let cur = null;
    $('legend').innerHTML = SORD.filter(s => s !== 'rnd').map(s => `<span class="st ${s}"><i></i>${esc(tx(STATUS[s]))}</span>`).join('');
    const box = $('map'), svg = box.querySelector('svg');
    const clear = () => { box.classList.remove('hov'); svg.querySelectorAll('.on,.sel').forEach(x => x.classList.remove('on', 'sel')); $('gc1').textContent = d1; $('gc2').textContent = d2; cur = null; if (mob && gi()) gi().innerHTML = hint; };
    const show = g => {
      clear(); box.classList.add('hov'); g.classList.add('on'); cur = g;
      if (g.dataset.p != null) { const i = +g.dataset.p, p = PROJECTS[i]; svg.querySelectorAll(`.e[data-p="${i}"]`).forEach(x => { x.classList.add('on'); svg.querySelector(`.t[data-t="${x.dataset.t}"]`).classList.add('on'); }); $('gc1').textContent = tx(p.n); $('gc2').textContent = `${p.y} · ${tx(STATUS[p.s])}`;
        if (mob) gi().innerHTML = `<h3>${esc(tx(p.n))}</h3><p><span class="st ${p.s}"><i></i>${esc(tx(STATUS[p.s]))}</span> · ${p.y}</p><p>${esc(tx(p.d))}</p><div class="tags">${p.t.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div><button type="button" class="btn">${T('Показать в таблице', 'Show in the table')}</button>`; }
      else { const j = +g.dataset.t; let k = 0; svg.querySelectorAll(`.e[data-t="${j}"]`).forEach(x => { x.classList.add('on'); svg.querySelector(`.p[data-p="${x.dataset.p}"]`).classList.add('on'); k++; }); $('gc1').textContent = techs[j]; $('gc2').textContent = T(`проектов: ${k}`, `projects: ${k}`);
        if (mob) gi().innerHTML = `<h3>${esc(techs[j])}</h3><p>${T('Используется в проектах:', 'Used in:')}</p><div class="tags">${PROJECTS.filter(p => p.t.includes(techs[j])).map(p => `<span class="tag">${esc(tx(p.n))}</span>`).join('')}</div><button type="button" class="btn">${T('Отфильтровать таблицу', 'Filter the table')}</button>`; }
    };
    const act = g => { if (g.dataset.p != null) jump(+g.dataset.p); else { cat = 'all'; query = techs[+g.dataset.t]; $('q').value = query; table(); $('all').scrollIntoView(); } };
    svg.addEventListener('pointerover', e => { if (touch) return; const g = e.target.closest('.n'); if (g) show(g); });
    svg.addEventListener('pointerleave', () => { if (!touch) clear(); });
    svg.addEventListener('focusin', e => { const g = e.target.closest('.n'); if (g) show(g); });
    svg.addEventListener('focusout', () => { if (!mob) clear(); });
    if (mob) gi().addEventListener('click', e => { if (e.target.closest('button') && cur) act(cur); });
    const touch = matchMedia('(hover: none)').matches;
    svg.addEventListener('click', e => { const g = e.target.closest('.n'); if (!g) { clear(); return; } if (mob) { show(g); return; } if (touch && !g.classList.contains('sel')) { svg.querySelectorAll('.sel').forEach(x => x.classList.remove('sel')); show(g); g.classList.add('sel'); $('gc2').textContent += T(' · нажмите ещё раз', ' · tap again'); } else act(g); });
    svg.addEventListener('keydown', e => { const g = e.target.closest('.n'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(g); } });
  }

  function jump(i) {
    cat = 'all'; query = ''; $('q').value = ''; table();
    const r = $('row-' + i); if (!r) return;
    r.scrollIntoView({ block: 'center' }); r.classList.add('hl'); setTimeout(() => r.classList.remove('hl'), 2600);
  }

  // --- таблица проектов
  function table() {
    $('chips').innerHTML = CATS.map(c => `<button type="button" data-c="${c.id}" aria-pressed="${c.id === cat}">${esc(tx(c.label))}</button>`).join('');
    const cols = [['n', T('Проект', 'Project')], ['y', T('Годы', 'Years')], ['s', T('Статус', 'Status')], [null, T('Что это', 'What it is')], [null, T('Стек', 'Stack')]];
    $('qx').hidden = !query;
    $('thead').innerHTML = cols.map(([k, l]) => `<th${k && sort.k === k ? ` aria-sort="${sort.d > 0 ? 'ascending' : 'descending'}"` : ''}>${k ? `<button type="button" data-k="${k}">${l}${sort.k === k ? (sort.d > 0 ? ' ↑' : ' ↓') : ''}</button>` : l}</th>`).join('');
    const q = query.trim().toLowerCase();
    let list = PROJECTS.map((p, i) => [p, i]).filter(([p]) => (cat === 'all' || p.c.includes(cat)) && (!q || [tx(p.n), tx(p.d), p.y, tx(STATUS[p.s]), ...p.t].join(' ').toLowerCase().includes(q)));
    if (sort.k) { const key = { n: p => tx(p.n).toLowerCase(), y: p => p.y.slice(-4) + p.y, s: p => SORD.indexOf(p.s) }[sort.k]; list.sort((a, b) => { const x = key(a[0]), y = key(b[0]); return (x > y ? 1 : x < y ? -1 : 0) * sort.d; }); }
    $('cnt').textContent = `${list.length} / ${PROJECTS.length}`;
    $('rows').innerHTML = list.length ? list.map(([p, i]) => `<tr id="row-${i}"><td class="nm">${p.href ? `<a href="${p.href}" target="_blank" rel="noopener">${esc(tx(p.n))} ↗</a>` : esc(tx(p.n))}</td><td class="yr">${p.y}</td><td><span class="st ${p.s}"><i></i>${esc(tx(STATUS[p.s]))}</span></td><td class="ds">${esc(tx(p.d))}</td><td><div class="tags">${p.t.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div></td></tr>`).join('')
      : `<tr><td colspan="5" class="empty">${T('ничего не найдено', 'nothing found')}<button type="button" id="reset">${T('сбросить фильтры', 'reset filters')}</button></td></tr>`;
  }

  function systems() {
    $('sysn').textContent = `${sysI + 1} / ${FEATURED.length}`;
    $('tabs').innerHTML = FEATURED.map((f, i) => `<button type="button" role="tab" id="tab-${i}" data-i="${i}" aria-selected="${i === sysI}" aria-controls="det" tabindex="${i === sysI ? 0 : -1}"><b>${esc(tx(f.name))}</b><span>${esc(tx(f.metric.n))} · ${esc(tx(f.metric.label))}</span></button>`).join('');
    const f = FEATURED[sysI];
    $('det').innerHTML = `<div class="top2"><div><div class="kind">${esc(tx(f.kind))}</div><h3>${esc(tx(f.name))}</h3><p class="ld">${esc(tx(f.lead))}</p></div><div class="met"><div class="n">${esc(tx(f.metric.n))}</div><p>${esc(tx(f.metric.label))}</p></div></div><ul>${f.points.map(p => `<li>${esc(tx(p))}</li>`).join('')}</ul><div class="tags">${f.stack.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>${f.links ? `<div class="links">${f.links.map((l, j) => `<a class="btn${j ? '' : ' pri'}" href="${l.href}" target="_blank" rel="noopener">${esc(tx(l.label))} ↗</a>`).join('')}</div>` : ''}${diagram(ARCH[sysI])}`;
  }

  function render() {
    root.dataset.lang = lang; root.lang = lang;
    document.title = T('Александр Гурман — CTO, AI-native инженер', 'Alexander Gurman — CTO, AI-native engineer');
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.set === lang));
    $('q').placeholder = T('поиск: название, технология, статус', 'search: name, technology, status');
    $('ti').placeholder = T('введите команду, например help', 'type a command, e.g. help');
    $('kpis').innerHTML = STATS.map(s => `<div class="kpi"><div class="n">${esc(s.n)}${s.unit ? `<small>${esc(tx(s.unit))}</small>` : ''}</div><p>${esc(tx(s.label))}</p></div>`).join('');
    $('caps').innerHTML = SERVICES.map(s => `<div><b>${s.k}</b><h3>${esc(tx(s.title))}</h3><p>${esc(tx(s.text))}</p></div>`).join('');
    $('log').innerHTML = TIMELINE.map(t => `<tr><td class="p">${esc(tx(t.period))}</td><td class="w"><h3>${esc(tx(t.role))}</h3><span class="at">${esc(tx(t.place))}</span></td><td class="d">${esc(tx(t.text))}</td></tr>`).join('');
    $('steps').innerHTML = PROCESS.map((s, i) => `<div class="stp"><b>✓ 0${i + 1}</b><h3>${esc(tx(s.t))}</h3><p>${esc(tx(s.d))}</p></div>`).join('');
    $('cols').innerHTML = STACK.map(s => `<div class="col"><h3>${esc(tx(s.g))}</h3><ul>${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
    $('sug').innerHTML = ['help', 'whoami', 'projects', 'stack', 'experience', 'contact'].map(c => `<button type="button" data-cmd="${c}">${c}</button>`).join('');
    graph(); systems(); table(); github(); if (window.__applyTheme) window.__applyTheme();
  }

  // --- часы Алматы
  function clock() { try { $('clock').textContent = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit' }).format(new Date()); } catch (e) {} }
  clock(); setInterval(clock, 20000);

  // --- GitHub: публичные репозитории (без ключа, 60 запросов в час с одного адреса)
  let ghData = null;
  function github() {
    if (!ghData) return;
    const fmt = d => new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
    $('gh').innerHTML = ghData.map(r => `<div class="row"><a href="${esc(r.html_url)}" target="_blank" rel="noopener">${esc(r.name)}</a><span>${esc(r.language || '—')}${r.stargazers_count ? ' · ★ ' + r.stargazers_count : ''}</span><span>${fmt(r.pushed_at)}</span></div>`).join('') + `<p class="note">${T('Здесь только открытые репозитории. Большая часть моего кода лежит в закрытых.', 'Public repositories only. Most of my code lives in private ones.')}</p>`;
    $('ghp').hidden = false;
  }
  fetch('https://api.github.com/users/gurmanalexander/repos?type=owner&sort=pushed&per_page=10').then(r => r.ok ? r.json() : Promise.reject()).then(a => { ghData = a.filter(r => !r.fork && !/test/i.test(r.name)).slice(0, 4); if (ghData.length) github(); else ghData = null; }).catch(() => {});

  // --- терминал
  const out = $('out'), ov = $('ov');
  const print = html => { const d = document.createElement('div'); d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; };
  const SECT = { map: 'map', experience: 'exp', systems: 'sys', projects: 'all', process: 'how', stack: 'how', contact: 'contact' };
  function run(raw) {
    const line = raw.trim(); if (!line) return;
    print(`<span class="c">$</span> <b>${esc(line)}</b>`);
    const [cmd, ...rest] = line.split(/\s+/), arg = rest.join(' ').toLowerCase(), c = cmd.toLowerCase();
    const proj = p => `<b>${esc(tx(p.n))}</b> <span class="m">${p.y} · ${esc(tx(STATUS[p.s]))}</span><br>${esc(tx(p.d))}<br><span class="m">${p.t.map(esc).join(' · ')}</span>`;
    if (c === 'help' || c === '?') print(T(
      '<b>whoami</b> — кто я в двух строках<br><b>projects [слово]</b> — список проектов, можно с фильтром: <span class="m">projects laravel</span><br><b>open &lt;проект&gt;</b> — показать проект в таблице<br><b>experience</b> — опыт<br><b>stack</b> — технологии<br><b>contact</b> — как со мной связаться<br><b>goto &lt;раздел&gt;</b> — перейти: map, experience, systems, projects, process, contact<br><b>lang ru|en</b> — язык · <b>clear</b> — очистить',
      '<b>whoami</b> — who I am in two lines<br><b>projects [word]</b> — list projects, optionally filtered: <span class="m">projects laravel</span><br><b>open &lt;project&gt;</b> — show a project in the table<br><b>experience</b> — experience<br><b>stack</b> — technologies<br><b>contact</b> — how to reach me<br><b>goto &lt;section&gt;</b> — jump to: map, experience, systems, projects, process, contact<br><b>lang ru|en</b> — language · <b>clear</b> — clear'));
    else if (c === 'whoami') print(T('Александр Гурман, CTO и практикующий инженер. 12 лет был CTO Договор24, сейчас CTO в OpenRate.<br>Архитектура, команда, инфраструктура, AI-native разработка. <span class="g">Открыт к предложениям.</span>', 'Alexander Gurman, a CTO who still ships code. CTO of Dogovor24 for 12 years, now CTO at OpenRate.<br>Architecture, team, infrastructure, AI-native engineering. <span class="g">Open to offers.</span>'));
    else if (c === 'projects' || c === 'ls') { const l = PROJECTS.filter(p => !arg || [tx(p.n), tx(p.d), ...p.t, ...p.c].join(' ').toLowerCase().includes(arg)); print(l.length ? l.map(p => `<span class="st ${p.s}"><i></i></span> <b>${esc(tx(p.n))}</b> <span class="m">${p.y} · ${p.t.map(esc).join(', ')}</span>`).join('<br>') + `<br><span class="m">${l.length} / ${PROJECTS.length}</span>` : T('ничего не найдено', 'nothing found')); }
    else if (c === 'open' || c === 'cat') { const i = PROJECTS.findIndex(p => (p.n.ru + ' ' + p.n.en + ' ' + (typeof p.n === 'string' ? p.n : '')).toLowerCase().includes(arg)); if (arg && i >= 0) { print(proj(PROJECTS[i])); close(); jump(i); } else print(T('проект не найден. Список: <b>projects</b>', 'project not found. List them with <b>projects</b>')); }
    else if (c === 'experience') print(TIMELINE.map(t => `<span class="c">${esc(tx(t.period))}</span> <b>${esc(tx(t.role))}</b>, ${esc(tx(t.place))}<br><span class="m">${esc(tx(t.text))}</span>`).join('<br>'));
    else if (c === 'stack') print(STACK.map(s => `<span class="c">${esc(tx(s.g))}</span> ${s.items.map(esc).join(', ')}`).join('<br>'));
    else if (c === 'contact') print('Telegram: <a href="https://t.me/gurmanalexander" target="_blank" rel="noopener">@gurmanalexander</a><br>Email: <a href="mailto:gurmanalexander@gmail.com">gurmanalexander@gmail.com</a><br>GitHub: <a href="https://github.com/gurmanalexander" target="_blank" rel="noopener">github.com/gurmanalexander</a>');
    else if (c === 'goto' || c === 'cd') { const id = SECT[arg.replace(/^\//, '')]; if (id) { close(); $(id).scrollIntoView(); } else print(T('разделы: ', 'sections: ') + Object.keys(SECT).join(', ')); }
    else if (c === 'lang' && (arg === 'ru' || arg === 'en')) { lang = arg; try { localStorage.setItem('lang', lang); } catch (e) {} render(); print('<span class="g">ok</span>'); }
    else if (c === 'clear') out.innerHTML = '';
    else { const l = PROJECTS.filter(p => [tx(p.n), ...p.t].join(' ').toLowerCase().includes(line.toLowerCase())); print(l.length ? l.slice(0, 5).map(proj).join('<br><br>') : T(`команда не найдена: ${esc(cmd)}. Наберите <b>help</b>`, `command not found: ${esc(cmd)}. Type <b>help</b>`)); }
  }
  let lastFocus = null; const hist = []; let hi = 0;
  function open() { lastFocus = document.activeElement; ov.hidden = false; document.body.style.overflow = 'hidden'; if (!out.children.length) print(T('<span class="m">Терминал портфолио. Наберите <b>help</b> или нажмите на подсказку ниже.</span>', '<span class="m">Portfolio terminal. Type <b>help</b> or click a suggestion below.</span>')); $('ti').focus(); }
  function close() { ov.hidden = true; document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $('openterm').addEventListener('click', open); $('closeterm').addEventListener('click', close);
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  $('tf').addEventListener('submit', e => { e.preventDefault(); const v = $('ti').value; if (v.trim()) { hist.push(v); hi = hist.length; } run(v); $('ti').value = ''; });
  $('ti').addEventListener('keydown', e => { if (e.key === 'ArrowUp' && hi > 0) { e.preventDefault(); $('ti').value = hist[--hi]; } else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); $('ti').value = hist[hi] || ''; } });
  ov.addEventListener('keydown', e => { if (e.key !== 'Tab') return; const f = [...ov.querySelectorAll('button,input,a[href]')].filter(x => x.offsetParent); if (!f.length) return; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } });
  $('sug').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { run(b.dataset.cmd); $('ti').focus(); } });
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ov.hidden ? open() : close(); } else if (e.key === 'Escape' && !ov.hidden) close(); });

  // --- события страницы
  document.querySelector('.lang').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; lang = b.dataset.set; try { localStorage.setItem('lang', lang); } catch (e) {} render(); });
  $('tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { sysI = +b.dataset.i; systems(); } });
  $('chips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { cat = b.dataset.c; table(); } });
  $('thead').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; sort = sort.k === b.dataset.k ? { k: sort.k, d: -sort.d } : { k: b.dataset.k, d: 1 }; table(); });
  $('q').addEventListener('input', e => { query = e.target.value; table(); });
  $('q').addEventListener('keydown', e => { if (e.key === 'Escape' && query) { query = ''; e.target.value = ''; table(); } });
  $('qx').addEventListener('click', () => { query = ''; $('q').value = ''; table(); $('q').focus(); });
  $('rows').addEventListener('click', e => { if (e.target.id === 'reset') { query = ''; cat = 'all'; $('q').value = ''; table(); } });
  $('tabs').addEventListener('keydown', e => { const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return; e.preventDefault(); sysI = (sysI + d + FEATURED.length) % FEATURED.length; systems(); $('tab-' + sysI).focus(); });

  // тема: системная → светлая → тёмная
  const TH = ['system', 'light', 'dark']; let theme = 'system';
  try { const t = localStorage.getItem('theme'); if (TH.includes(t)) theme = t; } catch (e) {}
  function applyTheme() { if (theme === 'system') delete root.dataset.theme; else root.dataset.theme = theme; const l = { system: T('Системная', 'System'), light: T('Светлая', 'Light'), dark: T('Тёмная', 'Dark') }[theme]; $('themel').textContent = l; $('theme').setAttribute('aria-label', T('Тема: ', 'Theme: ') + l + T('. Нажмите, чтобы сменить', '. Click to change')); $('theme').title = T('Тема: ', 'Theme: ') + l; }
  $('theme').addEventListener('click', () => { theme = TH[(TH.indexOf(theme) + 1) % 3]; try { localStorage.setItem('theme', theme); } catch (e) {} applyTheme(); });
  if (matchMedia('(hover: none)').matches) $('kk').textContent = '>_'; else if (/Mac/.test(navigator.platform || '')) $('kk').textContent = '⌘ K';

  // подсветка текущего раздела в меню
  if ('IntersectionObserver' in window) { const links = [...document.querySelectorAll('.top nav a')], map = {}; links.forEach(a => map[a.getAttribute('href').slice(1)] = a);
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.removeAttribute('aria-current')); map[e.target.id].setAttribute('aria-current', 'true'); } }), { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(id => $(id) && so.observe($(id))); }

  mq.addEventListener('change', e => { mob = e.matches; graph(); systems(); });
  window.__applyTheme = applyTheme;
  render();
})();
