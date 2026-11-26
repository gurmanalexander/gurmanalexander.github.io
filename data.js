// Контент портфолио. Каждый текст — { ru, en }.
const L = (ru, en) => ({ ru, en });

const STATS = [
  { n: "12", unit: L("лет", "yrs"), label: L("в роли CTO", "as a CTO") },
  { n: "20+", unit: "", label: L("сервисов в платформе, которую я спроектировал", "services in a platform I designed") },
  { n: "15", unit: "", label: L("человек в команде на пике", "people on the team at peak") },
  { n: "3", unit: L("мес", "mo"), label: L("от прототипа до платящего клиента", "from prototype to a paying client") },
];

const SERVICES = [
  {
    k: "01",
    title: L("CTO и руководство разработкой", "CTO & engineering leadership"),
    text: L(
      "Собираю команду и процесс: найм, грейды, спринты, релизы, бюджет. Делаю работу инженеров предсказуемой для бизнеса.",
      "I build the team and the process: hiring, career ladder, sprints, releases, budget. I make engineering predictable for the business."
    ),
    tags: ["Hiring", "ADR", "KPI", "Roadmap"],
  },
  {
    k: "02",
    title: L("Архитектура и backend", "Architecture & backend"),
    text: L(
      "Проектирую системы, которые живут в проде годами: микросервисы, очереди, интеграции с банками и госсистемами.",
      "I design systems that stay in production for years: microservices, queues, bank and government integrations."
    ),
    tags: ["Laravel", "NestJS", "FastAPI", "PostgreSQL"],
  },
  {
    k: "03",
    title: L("Платформа и эксплуатация", "Platform & operations"),
    text: L(
      "Kubernetes, Terraform, GitOps. Переезды и апгрейды с репетицией и планом отката, бэкапы с проверкой восстановления.",
      "Kubernetes, Terraform, GitOps. Migrations and upgrades with rehearsals and rollback plans, backups with verified restores."
    ),
    tags: ["Kubernetes", "Terraform", "Argo CD", "CI/CD"],
  },
  {
    k: "04",
    title: L("AI-native разработка", "AI-native engineering"),
    text: L(
      "Строю процесс, где AI-агенты пишут код, а архитектура, ревью и ответственность остаются за инженером. Делаю продукты на LLM и компьютерном зрении.",
      "I set up a process where AI agents write code while architecture, review and accountability stay with the engineer. I ship LLM and computer-vision products."
    ),
    tags: ["Claude Code", "LLM", "RAG", "Computer Vision"],
  },
];

const TIMELINE = [
  {
    period: L("2026 — сейчас", "2026 — now"),
    role: "CTO",
    place: "OpenRate",
    text: L(
      "Платформа отзывов и лояльности для ресторанов Казахстана. Команда, архитектура, облачная платформа и процесс разработки с AI-агентами.",
      "Reviews and loyalty platform for restaurants in Kazakhstan. Team, architecture, cloud platform and an AI-agent development process."
    ),
  },
  {
    period: "2014 — 2026",
    role: L("Соучредитель и CTO", "Co-founder & CTO"),
    place: L("Договор24", "Dogovor24"),
    text: L(
      "Юридический SaaS и электронный документооборот. От первого коммита до платформы из 20+ сервисов и команды до 15 человек. Сейчас соучредитель и консультант.",
      "Legal SaaS and e-document workflow. From the first commit to a 20+ service platform and a team of up to 15. Now co-founder and advisor."
    ),
  },
  {
    period: "2012 — 2015",
    role: L("Web-разработчик", "Web developer"),
    place: "vlast.kz",
    text: L("Новостной портал с нуля: разработка, запуск, развитие.", "A news portal built from scratch: development, launch, growth."),
  },
  {
    period: L("с 2008", "since 2008"),
    role: L("Основатель", "Founder"),
    place: L("ИП Гурман", "Own practice"),
    text: L(
      "Проекты для клиентов и собственные продукты: от контент-порталов до компьютерного зрения.",
      "Client projects and own products: from content portals to computer vision."
    ),
  },
];

const FEATURED = [
  {
    name: "OpenRate",
    kind: L("CTO · основная работа", "CTO · full-time"),
    lead: L(
      "Платформа верифицированных отзывов и лояльности для ресторанов и кафе. Гость загружает чек и получает внутреннюю валюту.",
      "Verified reviews and loyalty for restaurants and cafés. A guest uploads a receipt and earns in-app currency."
    ),
    points: [
      L("Команда 6–8 инженеров, около 1 млн строк кода, 2 300+ pull request за полгода", "A team of 6–8 engineers, ~1M lines of code, 2,300+ pull requests in six months"),
      L("Практически в одиночку построил платформу: Terraform, Kubernetes, Argo CD, автоскейлинг", "Built the platform almost single-handedly: Terraform, Kubernetes, Argo CD, autoscaling"),
      L("Процесс разработки с AI-агентами: planner → implementer → reviewer → security-reviewer", "AI-agent workflow: planner → implementer → reviewer → security reviewer"),
      L("Хранение данных в Казахстане проверяется политиками как код", "Data residency in Kazakhstan enforced with policy-as-code"),
    ],
    stack: ["NestJS", "CQRS", "Prisma", "PostgreSQL RLS", "FastAPI", "React 19", "Kubernetes", "Argo CD", "Terraform", "OPA"],
    metric: { n: "~1M", label: L("строк кода в проде", "lines of code in production") },
  },
  {
    name: L("Договор24", "Dogovor24"),
    kind: L("Соучредитель · 12 лет был CTO, сейчас консультант", "Co-founder · CTO for 12 years, now advisor"),
    lead: L(
      "Юридический SaaS и электронный документооборот для бизнеса Казахстана. В проде больше 10 лет.",
      "Legal SaaS and e-document workflow for businesses in Kazakhstan. In production for 10+ years."
    ),
    points: [
      L("Монолит на Laravel вырос в 20+ сервисов с RabbitMQ, PostgreSQL и Elasticsearch в Kubernetes", "A Laravel monolith grew into 20+ services with RabbitMQ, PostgreSQL and Elasticsearch on Kubernetes"),
      L("Интеграции с госсистемами: ЕСЭДО, ЕСУТД, eGov, электронная подпись НУЦ РК", "Government integrations: national e-document systems, eGov, national digital signature"),
      L("Система оценки и прогнозирования задач: LLM ставит Story Points по критериям из 200+ задач", "Task estimation and forecasting: an LLM assigns story points using criteria derived from 200+ tasks"),
      L("Сервис авторизации полностью покрыт автотестами за 2 недели с помощью AI", "The auth service fully covered with automated tests in 2 weeks with AI"),
    ],
    stack: ["Laravel", "Vue / Nuxt", "Angular", "PostgreSQL", "RabbitMQ", "Elasticsearch", "Kubernetes", "Jira API"],
    metric: { n: "20+", label: L("сервисов и команда до 15 человек", "services and a team of up to 15") },
  },
  {
    name: L("Видеоотчёты медиабордов", "Billboard video reports"),
    kind: L("Свой продукт для клиента · компьютерное зрение", "Own product for a client · computer vision"),
    lead: L(
      "Система для оператора наружной рекламы: монтажник снимает экран на телефон, рекламодатель получает отчёт с доказательством показа.",
      "A system for an outdoor advertising operator: a field worker films the screen, the advertiser gets a proof-of-play report."
    ),
    points: [
      L("Нейросети находят экран в кадре, выпрямляют перспективу и распознают каждый ролик", "Neural networks find the screen, fix the perspective and recognise each ad"),
      L("От прототипа до прода с платящим клиентом за 3 месяца, в одиночку", "From prototype to production with a paying client in 3 months, solo"),
      L("100+ экранов в 10 городах, тысячи распознанных показов в месяц", "100+ screens in 10 cities, thousands of recognised plays a month"),
      L("Серверы поднимаются под нагрузку и гасятся сами", "Servers scale up under load and shut down on their own"),
    ],
    stack: ["Python", "Grounding DINO", "SAM 2", "OpenCV", "SIFT", "PostgreSQL", "Terraform", "Packer", "Telegram Bot"],
    metric: { n: "~1 900", label: L("автотестов на 56 тыс. строк", "tests for 56K lines of code") },
  },
  {
    name: "tvx terminal",
    kind: L("Open source · можно открыть прямо сейчас", "Open source · try it right now"),
    lead: L(
      "Бесплатный торговый терминал в браузере: графики Binance и Bybit без регистрации, ключей и сервера.",
      "A free in-browser trading terminal: Binance and Bybit charts with no sign-up, no keys and no server."
    ),
    points: [
      L("До 8 синхронных графиков, рисунки, позиции, скринер, алерты", "Up to 8 synced charts, drawings, positions, screener, alerts"),
      L("Первая загрузка около 210 КБ: без UI-библиотек и трекеров", "First load is ~210 KB: no UI kits, no trackers"),
      L("Работает на телефоне и ставится как приложение", "Works on a phone and installs as an app"),
    ],
    stack: ["Vue 3", "TypeScript", "Vite", "WebSocket", "PWA", "Lightweight Charts"],
    metric: { n: "210 KB", label: L("первая загрузка", "first load") },
    image: "assets/tvx.webp",
    links: [
      { label: L("Открыть терминал", "Open the app"), href: "https://gurmanalexander.github.io/trading-platform/" },
      { label: "GitHub", href: "https://github.com/gurmanalexander/trading-platform" },
    ],
  },
  {
    name: "finance.kz",
    kind: "CTO",
    lead: L(
      "Финансовый маркетплейс: кредиты, банки, вход по электронной подписи. Принял проект с историей с 2017 года.",
      "A financial marketplace: loans, banks, digital-signature login. I took over a codebase dating back to 2017."
    ),
    points: [
      L("Аудит и усиление безопасности, исправления через тесты", "Security audit and hardening, every fix driven by tests"),
      L("Апгрейд на три мажорные версии Laravel и две версии Next.js", "Upgraded three major Laravel versions and two Next.js versions"),
      L("Репетиция переезда: простой 5 минут при цели 40", "Migration rehearsal: 5 minutes of downtime against a 40-minute target"),
    ],
    stack: ["Laravel 13", "Next.js 16", "React 19", "Playwright", "Docker", "Caddy", "restic"],
    metric: { n: "5 min", label: L("простой при переезде", "migration downtime") },
  },
  {
    name: "Stride",
    kind: L("Свой продукт · готов к запуску", "Own product · ready to launch"),
    lead: L(
      "Платформа обучающих материалов: сайт, админка и мобильное приложение, которое работает без интернета.",
      "A learning-content platform: website, admin panel and a mobile app that works offline."
    ),
    points: [
      L("Офлайн-синхронизация: изменения не теряются и не дублируются", "Offline sync: changes are never lost or duplicated"),
      L("Деплой с автоматическим откатом, восстановление бэкапов проверяется каждую ночь", "Deploys roll back automatically, backup restores are verified nightly"),
      L("Веб-приложение и мобильное приложение готовы к публикации", "Web and mobile apps are ready for release"),
    ],
    stack: ["Laravel 12", "Filament", "React 19 SSR", "Flutter", "MySQL", "Redis", "Terraform", "GitHub Actions"],
    metric: { n: "~1 200", label: L("автотестов", "automated tests") },
  },
];

// status: live | ready | pilot | proto | rnd | done
const CATS = [
  { id: "all", label: L("Все", "All") },
  { id: "lead", label: L("Руководство", "Leadership") },
  { id: "product", label: L("Свои продукты", "Own products") },
  { id: "client", label: L("Для клиентов", "Client work") },
  { id: "ai", label: "AI / LLM" },
  { id: "infra", label: L("Платформа", "Platform") },
  { id: "quant", label: L("Трейдинг", "Trading") },
  { id: "rnd", label: "R&D" },
];

const STATUS = {
  live: L("в проде", "live"),
  ready: L("готов к запуску", "ready to launch"),
  pilot: L("в работе", "in use"),
  proto: L("прототип", "prototype"),
  rnd: L("исследование", "research"),
  done: L("сдан", "delivered"),
};

const PROJECTS = [
  { n: "OpenRate", y: "2026", c: ["lead", "infra", "ai"], s: "live", d: L("Отзывы и лояльность для ресторанов. CTO: команда, архитектура, облако.", "Reviews and loyalty for restaurants. CTO: team, architecture, cloud."), t: ["NestJS", "PostgreSQL", "Kubernetes"] },
  { n: L("Договор24", "Dogovor24"), y: "2014–2026", c: ["lead", "infra"], s: "live", d: L("Юридический SaaS и ЭДО. Соучредитель, 12 лет CTO, платформа из 20+ сервисов.", "Legal SaaS and e-documents. Co-founder, CTO for 12 years, a 20+ service platform."), t: ["Laravel", "RabbitMQ", "Kubernetes"] },
  { n: L("Видеоотчёты медиабордов", "Billboard video reports"), y: "2026", c: ["client", "ai", "product"], s: "live", d: L("Компьютерное зрение подтверждает показы рекламы на уличных экранах.", "Computer vision proves that ads were played on outdoor screens."), t: ["Python", "SAM 2", "OpenCV"] },
  { n: "finance.kz", y: "2026", c: ["client", "infra"], s: "pilot", d: L("Финансовый маркетплейс. CTO: безопасность, апгрейд, переезд на новую инфраструктуру.", "Financial marketplace. CTO: security, upgrades, migration to new infrastructure."), t: ["Laravel 13", "Next.js 16", "Docker"] },
  { n: "tvx terminal", y: "2026", c: ["product", "quant"], s: "live", d: L("Открытый торговый терминал в браузере без бэкенда.", "An open-source in-browser trading terminal with no backend."), t: ["Vue 3", "TypeScript", "PWA"], href: "https://github.com/gurmanalexander/trading-platform" },
  { n: "Stride", y: "2025–2026", c: ["product"], s: "ready", d: L("Платформа обучающих материалов: сайт, админка, офлайн-приложение.", "Learning-content platform: website, admin, offline-first mobile app."), t: ["Laravel 12", "React 19", "Flutter"] },
  { n: L("TVX — торговый движок", "TVX — trading engine"), y: "2026", c: ["quant", "product"], s: "live", d: L("Одна стейт-машина для бэктеста и боя, исполнение на двух биржах, ~2 500 тестов.", "One state machine for backtest and live, execution on two exchanges, ~2,500 tests."), t: ["Python", "ccxt", "Docker"] },
  { n: "demos.kz", y: "2024–2026", c: ["client"], s: "live", d: L("Мультиязычный портал: пресс-релизы, опросы с графиками, инфографика.", "Multilingual portal: press releases, polls with charts, infographics."), t: ["Laravel 11", "Filament", "Vue 3"] },
  { n: L("Закрытая арт-витрина", "Private art showcase"), y: "2026", c: ["client"], s: "live", d: L("Доступ по приглашениям и персональные водяные знаки. В проде за 9 дней.", "Invite-only access and per-viewer watermarks. Live in 9 days."), t: ["Next.js 15", "Prisma", "PostgreSQL"] },
  { n: "Stillwaters", y: "2026", c: ["product", "ai"], s: "proto", d: L("Детективная игра, где жителей города отыгрывает языковая модель.", "A detective game where the townspeople are played by a language model."), t: ["TypeScript", "Claude API", "Three.js"] },
  { n: "Volunteer Platform", y: "2026", c: ["product", "ai"], s: "proto", d: L("Эксперимент с AI-агентами: платформа для волонтёров, 16 модулей и 310 E2E-тестов за неделю.", "An AI-agent experiment: a volunteer platform, 16 modules and 310 E2E tests in a week."), t: ["Laravel 12", "React", "Playwright"] },
  { n: "OHS Books", y: "2026", c: ["client"], s: "live", d: L("Сайт-библиотека учебников: 6 книг, 113 глав, поиск без сервера.", "A textbook library site: 6 books, 113 chapters, serverless search."), t: ["Astro 5", "Pagefind"], href: "https://ohs-books.org" },
  { n: L("Оценка и прогноз задач", "Task estimation & forecasting"), y: "2025–2026", c: ["lead", "ai"], s: "pilot", d: L("LLM ставит Story Points в Jira по формальным критериям, дашборд прогнозирует спринты.", "An LLM assigns story points in Jira using formal criteria; a dashboard forecasts sprints."), t: ["Jira API", "Next.js", "LLM"] },
  { n: L("Автоматизация документации", "Docs automation"), y: "2026", c: ["lead", "ai"], s: "pilot", d: L("Страницы Confluence, релизные документы и отчёты собираются AI-скиллами.", "Confluence pages, release documents and reports are generated by AI skills."), t: ["Claude Code", "Confluence", "Mermaid"] },
  { n: L("AI-поддержка в Bitrix24", "AI helpdesk for Bitrix24"), y: "2026", c: ["ai"], s: "pilot", d: L("Бот отвечает клиентам по базе знаний и передаёт сложное оператору.", "A bot answers customers from the knowledge base and hands hard cases to an operator."), t: ["Claude API", "Qdrant", "RAG"] },
  { n: L("AI-native ЭДО", "AI-native document workflow"), y: "2026", c: ["ai", "rnd"], s: "proto", d: L("Прототип документооборота, где агент извлекает данные и ведёт документ.", "A prototype where an agent extracts data and drives the document flow."), t: ["FastAPI", "pgvector", "LiteLLM"] },
  { n: L("Агентная обвязка разработки", "Agentic dev workflow"), y: "2026", c: ["ai", "lead"], s: "pilot", d: L("Субагенты, хуки-гейты и автоматический ревьюер pull request для команды.", "Subagents, gate hooks and an automated pull-request reviewer for the team."), t: ["Claude Code", "GitHub", "Routines"] },
  { n: "agentops-infra", y: "2026", c: ["infra", "ai"], s: "proto", d: L("Стек для команды AI-агентов: оркестратор, память на графе знаний, секреты, бэкапы.", "A stack for a team of AI agents: orchestrator, knowledge-graph memory, secrets, backups."), t: ["Docker", "Go", "LightRAG"] },
  { n: L("Модернизация 16 сервисов", "Modernising 16 services"), y: "2026", c: ["lead", "infra"], s: "done", d: L("Аудит, план перехода PHP 7.2 → 8.x и Laravel 5 → 13, первый сервис обновлён до Laravel 11+.", "Audit, a PHP 7.2 → 8.x and Laravel 5 → 13 plan, first service upgraded to Laravel 11+."), t: ["PHP", "Laravel", "Semgrep"] },
  { n: "Vektra", y: "2026", c: ["quant", "product"], s: "proto", d: L("Аналитика собственных сделок: синхронизация с биржей, правила, 50 метрик входа.", "Analytics for my own trades: exchange sync, rules engine, 50 entry metrics."), t: ["FastAPI", "PostgreSQL", "Next.js"] },
  { n: L("Quant-лаборатория", "Quant research lab"), y: "2026", c: ["quant", "rnd"], s: "rnd", d: L("Пять исследований торговых идей с проверкой вне выборки. Отрицательные результаты записаны честно.", "Five trading-idea studies with out-of-sample checks. Negative results are reported honestly."), t: ["Python", "pandas", "SQLite"] },
  { n: "Trady", y: "2026", c: ["quant", "ai"], s: "proto", d: L("LLM-ассистент трейдера: 25 инструментов через MCP и 15 агентов.", "An LLM trading assistant: 25 tools over MCP and 15 agents."), t: ["Claude", "MCP", "Laravel"] },
  { n: L("Автономный дрон-съёмщик", "Autonomous survey drone"), y: "2026", c: ["rnd"], s: "rnd", d: L("Дрон сам облетает рекламные экраны. Пока симуляция: навигация по меткам и защита от отказов.", "A drone that films ad screens on its own. Simulation stage: tag navigation and failsafes."), t: ["ArduPilot SITL", "MAVLink", "Python"] },
  { n: L("3D из чертежей", "3D from drawings"), y: "2026", c: ["client"], s: "done", d: L("3D-модели зданий из DXF и правка проектной документации своими инструментами.", "3D building models from DXF and tooling to fix design documentation."), t: ["Three.js", "ezdxf", "Python"] },
  { n: L("Система для автосервиса", "Auto-service system"), y: "2026", c: ["client", "infra"], s: "done", d: L("Вклад в чужой проект: схема развёртывания и безопасный доступ аналитиков к базе.", "Contribution to a partner project: deployment design and safe analyst access to the database."), t: ["PostgreSQL", "1C", "Docker"] },
  { n: "vlast.kz", y: "2012–2015", c: ["client"], s: "done", d: L("Новостной портал с нуля.", "A news portal built from scratch."), t: ["PHP", "MySQL", "JavaScript"] },
];

const STACK = [
  { g: "Backend", items: ["PHP · Laravel 5–13", "TypeScript · NestJS", "Python · FastAPI", "Filament", "Prisma", "Go"] },
  { g: "Frontend & mobile", items: ["Vue 3 · Nuxt", "React 19 · Next.js", "Inertia", "Tailwind", "Flutter", "Three.js"] },
  { g: L("Данные", "Data"), items: ["PostgreSQL · RLS · pgvector", "MySQL", "Redis", "RabbitMQ · BullMQ", "Elasticsearch", "Qdrant"] },
  { g: L("Платформа", "Platform"), items: ["Kubernetes", "Argo CD", "Terraform · Packer", "Docker", "GitHub Actions", "Prometheus · Grafana · Sentry"] },
  { g: "AI", items: ["Claude · OpenAI · Gemini", "Claude Code · Codex", "MCP", "RAG", "Grounding DINO · SAM 2", "OpenCV"] },
  { g: L("Качество и безопасность", "Quality & security"), items: ["Playwright", "PHPUnit · Vitest · pytest", "Mutation testing", "Semgrep · Trivy · gitleaks", "OAuth2 · PKCE · 2FA", "OPA / Rego"] },
];

const PROCESS = [
  { t: L("Спека", "Spec"), d: L("Сначала договариваемся, что строим и как проверим.", "First we agree on what we build and how we verify it.") },
  { t: L("План", "Plan"), d: L("Задача режется на шаги, которые можно проверить по отдельности.", "The work is cut into steps that can be verified one by one.") },
  { t: L("Агенты", "Agents"), d: L("Код пишут AI-агенты под моим управлением.", "AI agents write the code under my direction.") },
  { t: L("Ревью", "Review"), d: L("Критичный код читаю построчно сам.", "I read critical code line by line myself.") },
  { t: L("Тесты", "Tests"), d: L("Без тестов и проверки в деле задача не закрыта.", "No tests and no real-world check means not done.") },
  { t: L("Прод", "Production"), d: L("Деплой с откатом, мониторинг, runbook.", "Deploys with rollback, monitoring, runbooks.") },
];
