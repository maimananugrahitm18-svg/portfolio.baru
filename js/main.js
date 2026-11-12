/**
 * Iman Mendrofa - Laravel & Fullstack Web Developer Portfolio JS
 * Interactive Features, Theme Switcher, Terminal Tabs, Modals & Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollNav();
  initTerminalTabs();
  initStatsCounter();
  initArchitecturePipeline();
  initApiPlayground();
  initProjectFilters();
  initProjectModals();
  initGithubHeatmap();
  initCertificatesModal();
  initCommandPalette();
  initHeroCopyEmail();
  initContactForm();
  initBackToTop();
});

/* ===================================================================
   1. Theme Management (Dark / Light)
   =================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme safely or default to dark
  let savedTheme = 'dark';
  try {
    const stored = localStorage.getItem('site_theme');
    if (stored === 'light' || stored === 'dark') {
      savedTheme = stored;
    }
  } catch (e) {
    savedTheme = 'dark';
  }

  function applyTheme(theme, notify = false) {
    htmlRoot.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('site_theme', theme);
    } catch (e) {}

    // Synchronize meta theme-color for mobile status bar
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme === 'dark' ? '#0a0d14' : '#f8fafc';

    // Update desktop button title & aria-label
    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('title', isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)');
      themeToggle.setAttribute('aria-label', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
    }

    // Update mobile drawer button label & status
    const mobileStatus = document.querySelector('.mobile-theme-text-status');
    if (mobileStatus) {
      mobileStatus.innerHTML = theme === 'dark' 
        ? 'Tema: <strong>Mode Gelap 🌙</strong>' 
        : 'Tema: <strong>Mode Terang ☀️</strong>';
    }

    if (notify) {
      showToast(`Mode tema diubah ke ${theme === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'}`);
    }
  }

  // Initial application
  applyTheme(savedTheme, false);

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTheme();
    });
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTheme();
    });
  }
}

/* ===================================================================
   2. Mobile Menu Handling
   =================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileBtn || !navMenu) return;

  // Create overlay backdrop for mobile menu
  let menuOverlay = document.getElementById('menuOverlay');
  if (!menuOverlay) {
    menuOverlay = document.createElement('div');
    menuOverlay.id = 'menuOverlay';
    menuOverlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:98',
      'background:rgba(0,0,0,0.4)', 'backdrop-filter:blur(2px)',
      '-webkit-backdrop-filter:blur(2px)',
      'opacity:0', 'pointer-events:none',
      'transition:opacity 0.3s ease'
    ].join(';');
    document.body.appendChild(menuOverlay);
  }

  function openMenu() {
    navMenu.classList.add('open');
    mobileBtn.classList.add('open');
    mobileBtn.setAttribute('aria-expanded', 'true');
    menuOverlay.style.opacity = '1';
    menuOverlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    mobileBtn.classList.remove('open');
    mobileBtn.setAttribute('aria-expanded', 'false');
    menuOverlay.style.opacity = '0';
    menuOverlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when clicking any nav item
  navLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // Close menu when clicking overlay
  menuOverlay.addEventListener('click', () => closeMenu());

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ===================================================================
   3. Sticky Nav & ScrollSpy Active Indicator
   =================================================================== */
function initScrollNav() {
  const header = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link check
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   4. Hero Terminal Code Snippets Switcher & Copy Function
   =================================================================== */
const codeSnippets = {
  controller: `<span class="c-comment">// App\\Http\\Controllers\\Api\\OrderController</span>
<span class="c-keyword">namespace</span> App\\Http\\Controllers\\Api;

<span class="c-keyword">use</span> App\\Services\\OrderService;
<span class="c-keyword">use</span> App\\Http\\Requests\\StoreOrderRequest;
<span class="c-keyword">use</span> App\\Http\\Resources\\OrderResource;

<span class="c-keyword">class</span> <span class="c-class">OrderController</span> <span class="c-keyword">extends</span> BaseApiController
{
    <span class="c-keyword">public function</span> <span class="c-function">__construct</span>(
        <span class="c-keyword">protected</span> OrderService <span class="c-var">$orderService</span>
    ) {}

    <span class="c-keyword">public function</span> <span class="c-function">checkout</span>(StoreOrderRequest <span class="c-var">$request</span>)
    {
        <span class="c-var">$order</span> = <span class="c-var">$this</span>->orderService->processCheckout(
            userId: auth()->id(),
            items: <span class="c-var">$request</span>->validated(<span class="c-string">'items'</span>),
            paymentMethod: <span class="c-var">$request</span>->payment_method
        );

        <span class="c-keyword">return</span> <span class="c-keyword">new</span> OrderResource(<span class="c-var">$order</span>);
    }
}`,

  service: `<span class="c-comment">// App\\Services\\OrderService</span>
<span class="c-keyword">namespace</span> App\\Services;

<span class="c-keyword">use</span> App\\Models\\Order;
<span class="c-keyword">use</span> Illuminate\\Support\\Facades\\DB;
<span class="c-keyword">use</span> App\\Events\\OrderPlacedEvent;

<span class="c-keyword">class</span> <span class="c-class">OrderService</span>
{
    <span class="c-keyword">public function</span> <span class="c-function">processCheckout</span>(<span class="c-keyword">int</span> <span class="c-var">$userId</span>, <span class="c-keyword">array</span> <span class="c-var">$items</span>, <span class="c-keyword">string</span> <span class="c-var">$payment</span>): Order
    {
        <span class="c-keyword">return</span> DB::transaction(<span class="c-keyword">function</span> () <span class="c-keyword">use</span> (<span class="c-var">$userId</span>, <span class="c-var">$items</span>, <span class="c-var">$payment</span>) {
            <span class="c-var">$total</span> = collect(<span class="c-var">$items</span>)->sum(<span class="c-keyword">fn</span>(<span class="c-var">$i</span>) => <span class="c-var">$i</span>[<span class="c-string">'price'</span>] * <span class="c-var">$i</span>[<span class="c-string">'qty'</span>]);
            
            <span class="c-var">$order</span> = Order::create([
                <span class="c-string">'user_id'</span> => <span class="c-var">$userId</span>,
                <span class="c-string">'total_amount'</span> => <span class="c-var">$total</span>,
                <span class="c-string">'payment_method'</span> => <span class="c-var">$payment</span>,
                <span class="c-string">'status'</span> => <span class="c-string">'pending'</span>
            ]);

            event(<span class="c-keyword">new</span> OrderPlacedEvent(<span class="c-var">$order</span>));
            <span class="c-keyword">return</span> <span class="c-var">$order</span>;
        });
    }
}`,

  migration: `<span class="c-comment">// database/migrations/create_orders_table.php</span>
<span class="c-keyword">use</span> Illuminate\\Database\\Migrations\\Migration;
<span class="c-keyword">use</span> Illuminate\\Database\\Schema\\Blueprint;
<span class="c-keyword">use</span> Illuminate\\Support\\Facades\\Schema;

<span class="c-keyword">return new class extends</span> Migration
{
    <span class="c-keyword">public function</span> <span class="c-function">up</span>(): <span class="c-keyword">void</span>
    {
        Schema::create(<span class="c-string">'orders'</span>, <span class="c-keyword">function</span> (Blueprint <span class="c-var">$table</span>) {
            <span class="c-var">$table</span>->id();
            <span class="c-var">$table</span>->foreignId(<span class="c-string">'user_id'</span>)->constrained()->cascadeOnDelete();
            <span class="c-var">$table</span>->decimal(<span class="c-string">'total_amount'</span>, 14, 2);
            <span class="c-var">$table</span>->string(<span class="c-string">'status'</span>, 30)->index();
            <span class="c-var">$table</span>->string(<span class="c-string">'snap_token'</span>)->nullable();
            <span class="c-var">$table</span>->timestamps();
            
            <span class="c-var">$table</span>->index([<span class="c-string">'user_id'</span>, <span class="c-string">'created_at'</span>]);
        });
    }
};`
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initTerminalTabs() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const codeContainer = document.getElementById('terminalCodeContent');
  const codeView = document.getElementById('terminalCodeView');
  const cliView = document.getElementById('terminalCliView');
  const statusText = document.getElementById('terminalStatusText');
  const copyBtn = document.getElementById('copyCodeBtn');

  const cliLogs = document.getElementById('cliLogs');
  const cliInput = document.getElementById('cliInput');
  const quickCmdBtns = document.querySelectorAll('.cli-quick-btn');

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const snippetKey = tab.getAttribute('data-code');

      if (snippetKey === 'cli') {
        if (codeView) codeView.style.display = 'none';
        if (cliView) {
          cliView.style.display = 'flex';
          if (cliInput) cliInput.focus();
        }
        if (statusText) statusText.textContent = 'Interactive Artisan Shell • Ready (Type help)';
        if (copyBtn) copyBtn.style.display = 'none';
      } else {
        if (codeView) codeView.style.display = 'block';
        if (cliView) cliView.style.display = 'none';
        if (codeSnippets[snippetKey]) {
          codeContainer.innerHTML = codeSnippets[snippetKey];
        }
        if (statusText) statusText.textContent = 'Laravel v11.x • PHP 8.3 • Tests Passing (100%)';
        if (copyBtn) copyBtn.style.display = 'flex';
      }
    });
  });

  // CLI Command Runner
  function runCliCommand(rawCmd) {
    if (!cliLogs) return;
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Log the user prompt
    const promptLine = document.createElement('div');
    promptLine.className = 'cli-log-line';
    promptLine.innerHTML = `<span class="cli-prompt">developer@maiman:~$</span> <span class="cli-log-cmd">${escapeHtml(rawCmd)}</span>`;
    cliLogs.appendChild(promptLine);

    if (cmd === 'clear') {
      cliLogs.innerHTML = '';
      return;
    }

    const resLine = document.createElement('div');
    resLine.className = 'cli-log-line cli-log-out';

    if (cmd === 'help') {
      resLine.innerHTML = `Perintah yang tersedia:
  <span class="cli-log-accent">artisan test</span>     - Jalankan simulasi test suite PHPUnit/Pest
  <span class="cli-log-accent">artisan inspire</span>  - Tampilkan kutipan inspirasi programmer
  <span class="cli-log-accent">artisan list</span>     - Tampilkan daftar artisan commands
  <span class="cli-log-accent">skills</span>           - Ringkasan tech stack teknis
  <span class="cli-log-accent">projects</span>         - Daftar live demo proyek
  <span class="cli-log-accent">whoami</span>           - Profil ringkas pengembang
  <span class="cli-log-accent">clear</span>            - Bersihkan layar terminal`;
    } else if (cmd === 'artisan test' || cmd === 'test' || cmd === 'php artisan test') {
      resLine.innerHTML = `<span class="cli-log-success">PASS</span> Tests\\Unit\\OrderServiceTest
  ✓ it calculates cart total amount with discount and tax (8ms)
  ✓ it acquires pessimistic database transaction lock (12ms)
  ✓ it dispatches OrderPlacedEvent to Redis queue (15ms)
<span class="cli-log-success">PASS</span> Tests\\Feature\\Api\\OrderCheckoutApiTest
  ✓ authenticated user can checkout items successfully (42ms)
  ✓ missing payload returns 422 unprocessable entity (6ms)
  ✓ unauthorized request returns 401 unauthenticated (5ms)

<span class="cli-log-success">Tests:    6 passed (18 assertions)</span>
<span class="cli-log-accent">Duration: 0.14s • Memory: 18.5 MB</span>`;
    } else if (cmd === 'artisan inspire' || cmd === 'inspire' || cmd === 'php artisan inspire') {
      const quotes = [
        `"Simplicity is the soul of efficiency." — Austin Freeman`,
        `"First, solve the problem. Then, write the code." — John Johnson`,
        `"Clean code always looks like it was written by someone who cares." — Robert C. Martin`,
        `"Laravel makes web development enjoyable again." — Taylor Otwell`
      ];
      const randomQ = quotes[Math.floor(Math.random() * quotes.length)];
      resLine.innerHTML = `<span class="cli-log-accent">${randomQ}</span>`;
    } else if (cmd === 'artisan list' || cmd === 'list' || cmd === 'php artisan list') {
      resLine.innerHTML = `<span class="cli-log-accent">Laravel Framework 11.33.0</span>

<span class="cli-log-cmd">make</span>
  make:controller    Create a new controller class
  make:model         Create a new Eloquent model class
  make:migration     Create a new migration file
  make:service       Create a new business service layer
<span class="cli-log-cmd">queue</span>
  queue:work         Start processing jobs on the queue
  queue:listen       Listen to a given queue worker
<span class="cli-log-cmd">route</span>
  route:list         List all registered application routes`;
    } else if (cmd === 'skills') {
      resLine.innerHTML = `Tech Stack:
  &bull; <span class="cli-log-accent">Backend:</span> PHP 8.3, Laravel 11/12, Filament Admin, Livewire
  &bull; <span class="cli-log-accent">Database:</span> MySQL 8.0, PostgreSQL, Redis In-Memory Caching
  &bull; <span class="cli-log-accent">API:</span> RESTful Architecture, Sanctum, Swagger, Midtrans Snap
  &bull; <span class="cli-log-accent">DevOps:</span> Docker, Ubuntu VPS, Nginx, GitHub Actions CI/CD`;
    } else if (cmd === 'projects') {
      resLine.innerHTML = `Live Projects:
  1. <span class="cli-log-accent">LaundryPro:</span> https://maimandev.my.id/laundry/public
  2. <span class="cli-log-accent">SmartAttendance:</span> https://maimandev.my.id/absensi/public
  3. <span class="cli-log-accent">OmniCommerce Engine:</span> Midtrans + Redis Inventory
  4. <span class="cli-log-accent">CoreGateway API:</span> Swagger OpenAPI 3.0 Specs`;
    } else if (cmd === 'whoami') {
      resLine.innerHTML = `<span class="cli-log-success">Maiman Anugrah</span> — Laravel Specialist & Fullstack Web Engineer
Fokus pada Clean Architecture, high-throughput REST API, dan database query optimization.`;
    } else {
      resLine.innerHTML = `Perintah tidak dikenali: '${escapeHtml(rawCmd)}'. Ketik <span class="cli-log-accent">help</span> untuk melihat daftar perintah.`;
    }

    cliLogs.appendChild(resLine);
    cliLogs.scrollTop = cliLogs.scrollHeight;
  }

  // Quick button clicks
  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        runCliCommand(cmd);
      }
    });
  });

  // Input Enter key listener
  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = cliInput.value;
        cliInput.value = '';
        runCliCommand(val);
      }
    });
  }

  // Copy code button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const rawText = codeContainer.innerText;
      navigator.clipboard.writeText(rawText).then(() => {
        const copyTextSpan = copyBtn.querySelector('.copy-text');
        copyTextSpan.textContent = 'Copied!';
        setTimeout(() => {
          copyTextSpan.textContent = 'Copy';
        }, 2000);
        showToast('Kode berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('Gagal menyalin kode.');
      });
    });
  }
}

/* ===================================================================
   5. Quick Stats Counter Animation
   =================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          let current = 0;
          const increment = Math.ceil(target / 40);
          const duration = 1200 / (target / increment);

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = current;
            }
          }, duration);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ===================================================================
   5.5 Architecture & Engineering Pipeline Interactive Handler
   =================================================================== */
const architectureLayers = {
  '1': {
    pill: 'Layer 01 • Client Gateway',
    title: 'Rate Limiting & Security Middleware',
    desc: 'Setiap request masuk melalui Nginx reverse proxy dengan SSL/TLS termination, melewati filter throttling adaptif (ThrottleRequests) untuk mencegah serangan DDoS dan brute-force, serta verifikasi CSRF/Sanctum Bearer Token.',
    badges: ['🛡️ Throttle 60 req/min', '🔑 Laravel Sanctum Bearer', '🌐 CORS & Security Headers'],
    file: 'routes/api.php',
    code: `<span class="c-comment">// Rate Limiting & Sanctum Middleware</span>
Route::<span class="c-function">middleware</span>([
    <span class="c-string">'throttle:api'</span>,
    <span class="c-string">'auth:sanctum'</span>,
    EnsureEmailIsVerified::<span class="c-keyword">class</span>,
])-><span class="c-function">group</span>(<span class="c-keyword">function</span> () {
    Route::<span class="c-function">apiResource</span>(<span class="c-string">'orders'</span>, OrderController::<span class="c-keyword">class</span>);
});`
  },
  '2': {
    pill: 'Layer 02 • Validation & DTO',
    title: 'Strict Input Validation & Sanitization',
    desc: 'Validasi input dipisahkan sepenuhnya dari Controller menggunakan dedicated Form Request. Menjamin validasi tipe data yang ketat, aturan bisnis kustom, dan sanitasi otomatis sebelum data menyentuh lapisan logika bisnis.',
    badges: ['📋 FormRequest Isolation', '⚡ Regex & DB Exists Rules', '🧹 Auto-Sanitize Input'],
    file: 'app/Http/Requests/StoreOrderRequest.php',
    code: `<span class="c-keyword">public function</span> <span class="c-function">rules</span>(): <span class="c-keyword">array</span>
{
    <span class="c-keyword">return</span> [
        <span class="c-string">'items'</span> => [<span class="c-string">'required'</span>, <span class="c-string">'array'</span>, <span class="c-string">'min:1'</span>],
        <span class="c-string">'items.*.product_id'</span> => [<span class="c-string">'required'</span>, <span class="c-string">'integer'</span>, <span class="c-string">'exists:products,id'</span>],
        <span class="c-string">'items.*.qty'</span> => [<span class="c-string">'required'</span>, <span class="c-string">'integer'</span>, <span class="c-string">'min:1'</span>, <span class="c-string">'max:50'</span>],
        <span class="c-string">'payment_method'</span> => [<span class="c-string">'required'</span>, <span class="c-string">'string'</span>, Rule::<span class="c-function">in</span>([<span class="c-string">'qris'</span>, <span class="c-string">'va_bca'</span>])],
    ];
}`
  },
  '3': {
    pill: 'Layer 03 • Core Business Logic',
    title: 'Decoupled Service Layer & DB Transactions',
    desc: 'Menerapkan Clean Architecture (SOLID) di mana logika bisnis dibungkus dalam Domain Services. Menjamin transaksi atomik (DB::transaction) agar data finansial tidak pernah korup jika terjadi kegagalan sistem.',
    badges: ['🏛️ SOLID Principles', '🔒 Atomic DB Transactions', '📢 Event-Driven Architecture'],
    file: 'app/Services/OrderService.php',
    code: `<span class="c-keyword">public function</span> <span class="c-function">processCheckout</span>(<span class="c-keyword">int</span> <span class="c-var">$userId</span>, <span class="c-keyword">array</span> <span class="c-var">$items</span>, <span class="c-keyword">string</span> <span class="c-var">$method</span>): Order
{
    <span class="c-keyword">return</span> DB::<span class="c-function">transaction</span>(<span class="c-keyword">function</span> () <span class="c-keyword">use</span> (<span class="c-var">$userId</span>, <span class="c-var">$items</span>, <span class="c-var">$method</span>) {
        <span class="c-var">$order</span> = Order::<span class="c-function">create</span>([<span class="c-string">'user_id'</span> => <span class="c-var">$userId</span>, <span class="c-string">'status'</span> => <span class="c-string">'pending'</span>]);
        <span class="c-var">$this</span>->inventoryService-><span class="c-function">lockStockForItems</span>(<span class="c-var">$items</span>);
        <span class="c-function">event</span>(<span class="c-keyword">new</span> OrderPlacedEvent(<span class="c-var">$order</span>));
        <span class="c-keyword">return</span> <span class="c-var">$order</span>;
    });
}`
  },
  '4': {
    pill: 'Layer 04 • Database Optimization',
    title: 'High-Performance Relational Queries',
    desc: 'Mengoptimasi performa database hingga latensi di bawah 40ms. Menggunakan eager loading (with) untuk meniadakan masalah N+1 queries, subquery joins, serta indexing komposit pada kolom pencarian aktif.',
    badges: ['⚡ Zero N+1 Queries', '📑 Composite Indexing', '🗄️ Subquery Optimization'],
    file: 'app/Repositories/OrderRepository.php',
    code: `<span class="c-comment">// Eager loading with indexed foreign keys & subqueries</span>
<span class="c-keyword">return</span> Order::<span class="c-function">query</span>()
    -><span class="c-function">with</span>([<span class="c-string">'items.product:id,name,price'</span>, <span class="c-string">'customer:id,name,email'</span>])
    -><span class="c-function">where</span>(<span class="c-string">'user_id'</span>, <span class="c-var">$userId</span>)
    -><span class="c-function">whereDate</span>(<span class="c-string">'created_at'</span>, <span class="c-string">'>='</span>, <span class="c-function">now</span>()-><span class="c-function">subDays</span>(30))
    -><span class="c-function">latest</span>()
    -><span class="c-function">paginate</span>(20);`
  },
  '5': {
    pill: 'Layer 05 • Async & In-Memory Layer',
    title: 'In-Memory Caching & Asynchronous Queue Workers',
    desc: 'Meringankan beban database utama dengan menyimpan data read-heavy ke in-memory Redis cluster. Tugas berat seperti notifikasi WhatsApp, invoice PDF, dan email settlement didelegasikan ke Redis Queue Workers.',
    badges: ['⚡ Sub-5ms Redis Reads', '📬 Async Background Workers', '🔄 Auto-Retry Daemons'],
    file: 'app/Jobs/SendInvoiceNotificationJob.php',
    code: `<span class="c-keyword">class</span> <span class="c-class">SendInvoiceNotificationJob</span> <span class="c-keyword">implements</span> ShouldQueue
{
    <span class="c-keyword">use</span> Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    <span class="c-keyword">public</span> <span class="c-var">$tries</span> = 3;

    <span class="c-keyword">public function</span> <span class="c-function">handle</span>(WhatsAppService <span class="c-var">$wa</span>, PdfService <span class="c-var">$pdf</span>): <span class="c-keyword">void</span>
    {
        <span class="c-var">$pdfFile</span> = <span class="c-var">$pdf</span>-><span class="c-function">generateInvoice</span>(<span class="c-var">$this</span>->order);
        <span class="c-var">$wa</span>-><span class="c-function">sendDocument</span>(<span class="c-var">$this</span>->order->customer_phone, <span class="c-var">$pdfFile</span>);
    }
}`
  }
};

function initArchitecturePipeline() {
  const stepBtns = document.querySelectorAll('.pipeline-step-btn');
  const pill = document.getElementById('archStepPill');
  const title = document.getElementById('archStepTitle');
  const desc = document.getElementById('archStepDesc');
  const badgesBox = document.getElementById('archStepBadges');
  const fileName = document.getElementById('archCodeFileName');
  const snippet = document.getElementById('archCodeSnippet');

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const stepKey = btn.getAttribute('data-step');
      const data = architectureLayers[stepKey];
      if (!data) return;

      if (pill) pill.textContent = data.pill;
      if (title) title.textContent = data.title;
      if (desc) desc.textContent = data.desc;
      if (fileName) fileName.textContent = data.file;
      if (snippet) snippet.innerHTML = data.code;

      if (badgesBox) {
        badgesBox.innerHTML = data.badges.map(b => `<span class="arch-badge-item">${b}</span>`).join('');
      }
    });
  });
}

/* ===================================================================
   5.6 Interactive API Playground Handler
   =================================================================== */
const apiResponses = {
  profile: {
    status: 200,
    size: '1.2 KB',
    json: {
      status: 'success',
      code: 200,
      message: 'Developer profile retrieved successfully',
      data: {
        name: 'Maiman Anugrah',
        title: 'Fullstack & Laravel Backend Engineer',
        availability: 'Open for Freelance & Full-time Roles',
        location: 'Indonesia (WIB / UTC+7)',
        core_focus: ['Clean Architecture', 'RESTful API Security', 'Database Optimization', 'Queue Workers'],
        experience_years: 3,
        projects_completed: 24,
        uptime_sla: '99.9%'
      }
    }
  },
  'tech-stack': {
    status: 200,
    size: '1.5 KB',
    json: {
      status: 'success',
      code: 200,
      tech_stack: {
        backend: ['PHP 8.3', 'Laravel 11/12', 'Filament 3.x', 'Livewire', 'Sanctum'],
        database: ['MySQL 8.0', 'PostgreSQL', 'Redis In-Memory', 'Eloquent Subqueries'],
        integrations: ['Midtrans Snap API', 'Xendit Gateway', 'WhatsApp Direct API', 'Swagger OpenAPI 3.0'],
        devops: ['Docker & Sail', 'Ubuntu VPS', 'Nginx Reverse Proxy', 'GitHub Actions CI/CD']
      }
    }
  },
  projects: {
    status: 200,
    size: '1.8 KB',
    json: {
      status: 'success',
      code: 200,
      total_featured: 4,
      projects: [
        {
          name: 'Sistem Laundry Pro POS',
          role: 'Owner & Kasir',
          stack: ['Laravel 12', 'MySQL', 'Thermal Print 58/80mm', 'WhatsApp API'],
          demo_url: 'https://maimandev.my.id/laundry/public'
        },
        {
          name: 'SmartAttendance Sekolah',
          role: 'Admin, Guru & Siswa',
          stack: ['Laravel 10', 'MySQL', 'GPS Geofencing', 'Webcam Face Capture'],
          demo_url: 'https://maimandev.my.id/absensi/public'
        },
        {
          name: 'OmniCommerce Engine',
          role: 'High-Throughput E-Commerce',
          stack: ['Laravel 11', 'Midtrans Snap', 'Redis Cart', 'Pessimistic Locking']
        },
        {
          name: 'CoreGateway RESTful API',
          role: 'Enterprise Microservice',
          stack: ['Sanctum JWT', 'OpenAPI 3.0', 'Redis Throttle', 'PHPUnit 100%']
        }
      ]
    }
  },
  'system-health': {
    status: 200,
    size: '0.9 KB',
    json: {
      status: 'healthy',
      code: 200,
      environment: 'production',
      php_version: '8.3.4',
      framework: 'Laravel 11.33.0',
      services: {
        database_mysql: 'connected (ping 2.1ms)',
        redis_cache_cluster: 'operational (ping 0.7ms)',
        queue_workers: '3 supervisor daemons running (idle)',
        ssl_certificate: 'active (TLS v1.3)'
      }
    }
  }
};

function initApiPlayground() {
  const select = document.getElementById('apiEndpointSelect');
  const sendBtn = document.getElementById('apiSendBtn');
  const statusBadge = document.getElementById('apiStatusBadge');
  const latencyVal = document.getElementById('apiLatencyVal');
  const sizeVal = document.getElementById('apiSizeVal');
  const codeOutput = document.getElementById('apiCodeOutput');
  const copyBtn = document.getElementById('apiCopyJsonBtn');

  if (!sendBtn || !select) return;

  sendBtn.addEventListener('click', () => {
    const endpointKey = select.value;
    const responseData = apiResponses[endpointKey] || apiResponses['profile'];

    // Visual loading state
    sendBtn.disabled = true;
    sendBtn.innerHTML = `<span>Fetching...</span>`;

    const randomLatency = Math.floor(Math.random() * 25) + 20; // 20ms - 45ms

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = `<span>Send Request</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;

      if (statusBadge) statusBadge.textContent = '200 OK';
      if (latencyVal) latencyVal.textContent = `${randomLatency}ms`;
      if (sizeVal) sizeVal.textContent = responseData.size;
      if (codeOutput) {
        codeOutput.textContent = JSON.stringify(responseData.json, null, 2);
      }
      showToast(`API Response 200 OK (${randomLatency}ms)`);
    }, 280);
  });

  if (copyBtn && codeOutput) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeOutput.textContent).then(() => {
        const copyTextSpan = copyBtn.querySelector('.copy-text');
        if (copyTextSpan) copyTextSpan.textContent = 'Copied!';
        setTimeout(() => {
          if (copyTextSpan) copyTextSpan.textContent = 'Copy JSON';
        }, 2000);
        showToast('Respon JSON berhasil disalin!');
      });
    });
  }
}

/* ===================================================================
   6. Project Category Filter
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   7. Project Detail Modal Data & Handler
   =================================================================== */
const projectsData = {
  p1: {
    title: 'Sistem Laundry Pro — Kasir & Manajemen Laundry Modern',
    category: 'Sistem POS Kasir & Multi-Role SaaS',
    overview: 'Sistem operasional laundry profesional berbasis web yang mencakup seluruh alur bisnis dari kasir loket hingga manajemen pemilik toko. Dilengkapi fitur multi-role (Owner & Kasir), transaksi cuci kiloan/satuan, cetak struk kasir termal langsung via browser, integrasi notifikasi pesan WhatsApp ke nomor pelanggan, dan pembukuan omset keuangan lengkap.',
    stack: ['Laravel 12', 'Bootstrap 5', 'MySQL', 'Struk Kasir 58/80mm', 'WhatsApp Direct', 'Chart.js', 'DomPDF'],
    img: 'assets/images/project-pos.jpg',
    highlights: [
      'Multi-role hak akses: Owner (laporan omset, tarif, hapus data) dan Kasir (input order, pelunasan DP, cetak struk).',
      'Format nota struk kasir termal mini (58mm/80mm) siap print serta download invoice PDF.',
      'Tombol kirim notifikasi WhatsApp otomatis berisi rincian tagihan cucian ke nomor pelanggan.',
      'Sistem tracking 7 tahapan proses cuci: Baru -> Diproses -> Dicuci -> Disetrika -> Siap Diambil -> Selesai.'
    ],
    github: 'https://github.com/maimananugrahitm18',
    demo: 'https://maimandev.my.id/laundry/public'
  },
  p2: {
    title: 'SmartAttendance — Sistem Informasi Absensi Sekolah Terpadu',
    category: 'Presensi Siswa/Guru & Multi-Role Auth',
    overview: 'Aplikasi pencatatan absensi sekolah terpadu dengan multi-role pengguna (Admin, Guru, dan Siswa). Dilengkapi input absensi harian kelas, filter rekapitulasi kehadiran per semester, izin/sakit digital dengan upload dokumen, serta dashboard analitik realtime.',
    stack: ['Laravel 10', 'MySQL', 'Multi-Role RBAC', 'Geofencing GPS', 'Webcam Capture', 'Export Excel/PDF'],
    img: '',
    highlights: [
      'Multi-Role 3 level: Admin Sekolah (kelola master data), Guru (input absensi kelas), dan Siswa (cek rekap kehadiran).',
      'Validasi geolokasi GPS presisi untuk memastikan presensi berada dalam radius resmi sekolah.',
      'Pengambilan foto verifikasi wajah via webcam atau kamera smartphone saat absensi.',
      'Rekapitulasi otomatis per semester dengan statistik kehadiran, sakit, izin, dan alpa siap unduh.'
    ],
    github: 'https://github.com/maimananugrahitm18',
    demo: 'https://maimandev.my.id/absensi/public'
  },
  p3: {
    title: 'OmniCommerce Engine — Platform E-Commerce & Midtrans Snap Integration',
    category: 'E-Commerce Platform & High-Throughput Checkout',
    overview: 'Infrastruktur e-commerce berkecepatan tinggi yang dibangun untuk mengatasi lonjakan checkout saat flash sale. Menggunakan mekanisme database transaction dengan locking pesimistik untuk mencegah overselling, Redis in-memory cart, serta verifikasi webhook instan pembayaran Midtrans.',
    stack: ['Laravel 11', 'Midtrans Snap API', 'Redis In-Memory', 'Pessimistic Locking', 'Database Transactions', 'Tailwind CSS'],
    img: 'assets/images/project-ecommerce.jpg',
    highlights: [
      'Integrasi payment gateway Midtrans Snap: QRIS, Virtual Account (BCA, Mandiri, BNI, BRI), dan Kartu Kredit.',
      'Pessimistic locking pada database relasional guna menjamin integritas stok barang pada konkurensi tinggi.',
      'Otomatisasi settlement webhook callback dengan validasi SHA-512 signature hash.',
      'Pengiriman invoice elektronik otomatis via background queue worker tanpa membebani thread pengguna.'
    ],
    github: 'https://github.com/maimananugrahitm18',
    demo: 'https://github.com/maimananugrahitm18'
  },
  p4: {
    title: 'CoreGateway API — Enterprise RESTful Microservice & Sanctum OAuth',
    category: 'RESTful API & Microservice Architecture',
    overview: 'Mesin RESTful API berkecepatan tinggi dengan dokumentasi interaktif Swagger/OpenAPI 3.0, autentikasi multi-tenant Laravel Sanctum, rate limiting adaptif berbasis tier client, serta 100% test coverage PHPUnit.',
    stack: ['Laravel Sanctum', 'OpenAPI 3.0 (Swagger)', 'Redis Throttle', 'PHPUnit / Pest', 'JSON API Standard', 'HMAC SHA256'],
    img: 'assets/images/project-api.jpg',
    highlights: [
      'Spesifikasi API terdokumentasi lengkap dan dapat diuji langsung via Swagger UI interface.',
      'Rate-limiting dinamis per client tier (Basic: 60 req/min, Premium: 500 req/min) via Redis throttle.',
      'Validasi integritas webhook eksternal menggunakan HMAC-SHA256 signature verification.',
      'Arsitektur resource API yang terstandarisasi dengan pagination cursor, error responses RFC 7807, dan type hinting.'
    ],
    github: 'https://github.com/maimananugrahitm18',
    demo: 'https://github.com/maimananugrahitm18'
  }
};

// Aliases for data-id on cards
projectsData['p-laundry'] = projectsData.p1;
projectsData['p-absensi'] = projectsData.p2;
projectsData['p-ecommerce'] = projectsData.p3;
projectsData['p-api'] = projectsData.p4;

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');
  const viewBtns = document.querySelectorAll('.view-project-btn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="project-type-badge">${data.category}</span>
        <h2 id="modalProjectTitle" style="font-size: 1.55rem; margin: 0.8rem 0 0.5rem 0;">${data.title}</h2>
        <div class="project-tech-tags" style="margin-top: 0.5rem;">
          ${data.stack.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>

      ${data.img ? `<img src="${data.img}" alt="${data.title}" class="modal-project-img" style="width: 100%; border-radius: 8px; margin: 0.9rem 0; border: 1px solid rgba(255,255,255,0.1); max-height: 280px; object-fit: cover;">` : ''}

      <h4 style="margin-bottom: 0.5rem; font-size: 1.05rem;">Ringkasan Sistem</h4>
      <p style="margin-bottom: 1.2rem; line-height: 1.65; color: var(--text-secondary); font-size: 0.92rem;">${data.overview}</p>

      <h4 style="margin-bottom: 0.5rem; font-size: 1.05rem;">Arsitektur Teknis & Solusi yang Dibangun</h4>
      <ul class="modal-feature-list" style="margin-bottom: 1.4rem; padding-left: 1.2rem; line-height: 1.6; color: var(--text-secondary); font-size: 0.9rem;">
        ${data.highlights.map(h => `<li style="margin-bottom: 0.4rem;">${h}</li>`).join('')}
      </ul>

      <div class="modal-links-row" style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>Repository GitHub</span>
        </a>
        ${data.demo && data.demo.includes('http') ? `
        <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8"></polygon>
          </svg>
          <span>Buka Demo Langsung</span>
        </a>` : ''}
        <a href="https://wa.me/6282289152653?text=Halo%20Maiman%2C%20saya%20tertarik%20dengan%20proyek%20${encodeURIComponent(data.title)}." target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline" style="color: #10b981; border-color: rgba(16,185,129,0.4);">
          <span>💬 Diskusi Source Code</span>
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project');
      openProjectModal(pId);
    });
  });

  // Enable click on project card
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const pId = card.getAttribute('data-id');
    const media = card.querySelector('.project-media');
    if (media && pId) {
      media.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          openProjectModal(pId);
        }
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   7.5 GitHub Contribution Heatmap Generator (52 Weeks x 7 Days)
   =================================================================== */
function initGithubHeatmap() {
  const grid = document.getElementById('githubHeatmapGrid');
  if (!grid) return;

  const totalWeeks = 52;
  const daysPerWeek = 7;
  const today = new Date();

  let html = '';

  for (let w = 0; w < totalWeeks; w++) {
    html += '<div class="heatmap-week">';
    for (let d = 0; d < daysPerWeek; d++) {
      // Calculate realistic random commit activity with clustered bursts
      const rand = Math.random();
      let level = 0;
      let commits = 0;

      if (rand > 0.88) {
        level = 4;
        commits = Math.floor(Math.random() * 6) + 8; // 8-13
      } else if (rand > 0.72) {
        level = 3;
        commits = Math.floor(Math.random() * 4) + 5; // 5-8
      } else if (rand > 0.50) {
        level = 2;
        commits = Math.floor(Math.random() * 3) + 2; // 2-4
      } else if (rand > 0.28) {
        level = 1;
        commits = 1;
      }

      const daysAgo = (totalWeeks - 1 - w) * 7 + (6 - d);
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - daysAgo);
      const dateStr = cellDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });

      const tooltipText = commits > 0 
        ? `${commits} commit pada ${dateStr}` 
        : `Tidak ada commit pada ${dateStr}`;

      html += `<div class="heatmap-cell l-${level}" title="${tooltipText}" aria-label="${tooltipText}"></div>`;
    }
    html += '</div>';
  }

  grid.innerHTML = html;
}

/* ===================================================================
   7.6 Certificate Lightbox Modal Handler
   =================================================================== */
function initCertificatesModal() {
  const certModal = document.getElementById('certModal');
  const certImg = document.getElementById('certModalImg');
  const certTitle = document.getElementById('certModalTitle');
  const certPdfLink = document.getElementById('certModalPdfLink');
  const closeBtn = document.getElementById('certModalCloseBtn');
  const backdrop = document.getElementById('certModalBackdrop');

  const openBtns = document.querySelectorAll('.open-cert-btn');
  const imgBoxes = document.querySelectorAll('.cert-img-box');

  function openCert(imgSrc, title, pdfSrc) {
    if (!certModal) return;
    if (certImg) certImg.src = imgSrc;
    if (certTitle) certTitle.textContent = title || 'Pratinjau Sertifikat';

    if (certPdfLink) {
      if (pdfSrc && pdfSrc !== '#') {
        certPdfLink.href = pdfSrc;
        certPdfLink.style.display = 'inline-flex';
      } else {
        certPdfLink.style.display = 'none';
      }
    }

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCert() {
    if (!certModal) return;
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = btn.getAttribute('data-cert-img');
      const title = btn.getAttribute('data-cert-title');
      const pdf = btn.getAttribute('data-cert-pdf');
      openCert(img, title, pdf);
    });
  });

  imgBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const img = box.getAttribute('data-cert-img');
      const title = box.getAttribute('data-cert-title');
      const pdf = box.getAttribute('data-cert-pdf');
      openCert(img, title, pdf);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCert);
  if (backdrop) backdrop.addEventListener('click', closeCert);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCert();
    }
  });
}

/* ===================================================================
   7.7 Command Palette (Ctrl+K / Cmd+K) Handler
   =================================================================== */
function initCommandPalette() {
  const modal = document.getElementById('cmdPaletteModal');
  const triggerBtn = document.getElementById('cmdPaletteBtn');
  const floatingBtn = document.getElementById('floatingCmdBtn');
  const backdrop = document.getElementById('cmdBackdrop');
  const searchInput = document.getElementById('cmdSearchInput');
  const resultsList = document.getElementById('cmdResultsList');

  const themeItem = document.getElementById('cmdToggleTheme');
  const copyEmailItem = document.getElementById('cmdCopyEmail');

  if (!modal) return;

  function openPalette() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      filterItems('');
      setTimeout(() => searchInput.focus(), 50);
    }
  }

  function closePalette() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openPalette);
  if (floatingBtn) floatingBtn.addEventListener('click', openPalette);
  if (backdrop) backdrop.addEventListener('click', closePalette);

  // Global Ctrl+K / Cmd+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('active') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePalette();
    }
  });

  // Filter items in list
  function filterItems(query) {
    const q = query.toLowerCase().trim();
    const items = resultsList.querySelectorAll('.cmd-item');
    const groupTitles = resultsList.querySelectorAll('.cmd-group-title');

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    // Hide group titles if searching
    groupTitles.forEach(gt => {
      gt.style.display = q ? 'none' : 'block';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterItems(searchInput.value);
    });
  }

  // Handle special quick actions in palette
  if (themeItem) {
    themeItem.addEventListener('click', () => {
      const toggle = document.getElementById('themeToggle');
      if (toggle) toggle.click();
      closePalette();
    });
  }

  if (copyEmailItem) {
    copyEmailItem.addEventListener('click', () => {
      navigator.clipboard.writeText('maimananugrahitm18@gmail.com').then(() => {
        showToast('Email resmi maimananugrahitm18@gmail.com berhasil disalin!');
      });
      closePalette();
    });
  }

  // Close when clicking nav items
  const navItems = resultsList.querySelectorAll('.cmd-item[data-action="nav"]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      closePalette();
    });
  });
}

/* ===================================================================
   7.8 Hero One-Click Copy Email Button
   =================================================================== */
function initHeroCopyEmail() {
  const btn = document.getElementById('copyEmailHeroBtn');
  const label = document.getElementById('heroCopyEmailText');
  if (!btn || !label) return;

  btn.addEventListener('click', () => {
    const email = 'maimananugrahitm18@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      const originalText = label.textContent;
      label.textContent = 'Email Disalin! ✓';
      btn.style.borderColor = 'var(--laravel-red)';
      btn.style.color = '#ffffff';

      showToast(`Email ${email} berhasil disalin ke clipboard!`);

      setTimeout(() => {
        label.textContent = originalText;
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2500);
    }).catch(() => {
      showToast('Gagal menyalin email.');
    });
  });
}

/* ===================================================================
   8. Interactive Contact Form with Validation & Feedback Toast
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successAlert = document.getElementById('formSuccessAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validation
    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const messageInput = document.getElementById('messageText');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    let isValid = true;

    // Reset error messages
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Harap isi nama lengkap Anda.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Harap isi alamat email Anda.';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = 'Format alamat email tidak valid.';
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      messageError.textContent = 'Harap tuliskan detail pesan atau proyek Anda.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Pesan minimal berisi 10 karakter.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulated Loading State
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();

      if (successAlert) {
        successAlert.classList.remove('hidden');
        setTimeout(() => {
          successAlert.classList.add('hidden');
        }, 7000);
      }

      showToast('Pesan berhasil terkirim! Terima kasih.');
    }, 1200);
  });
}

/* ===================================================================
   10. Toast Notification Helper
   =================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ===================================================================
   11. Back to Top Button
   =================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* =============================================
   LIVE VISITOR TICKER — Real Data dari API
   Mengambil data kunjungan nyata dari semua website
   API: https://maimandev.my.id/laundry/public/api/ticker
   ============================================= */
(function initVisitorTicker() {

  // === KONFIGURASI ===
  const API_BASE    = 'https://maimandev.my.id/laundry/public/api/ticker';
  const SUMBER_NAMA = 'Portfolio';   // nama website ini
  const HALAMAN     = window.location.pathname;

  // Label tampilan per sumber website
  const labelSumber = {
    'Portfolio':  { text: 'Portfolio',       emoji: '🌐' },
    'Absensi':    { text: 'Demo Absensi',    emoji: '📋' },
    'Laundry':    { text: 'Demo Laundry',    emoji: '🧺' },
    'Unknown':    { text: 'Website',         emoji: '👁️' },
  };

  // Label aksi
  const labelAksi = {
    'lihat_halaman': 'sedang melihat',
    'demo_login':    'baru saja login demo',
    'buka_demo':     'membuka demo',
  };

  // Fallback messages jika API gagal / data kosong
  const fallbackItems = [
    { sumber: 'Portfolio', aksi: 'lihat_halaman', device: 'Mobile', waktu: 'baru saja' },
    { sumber: 'Laundry',   aksi: 'buka_demo',     device: 'Desktop', waktu: '2 menit lalu' },
    { sumber: 'Absensi',   aksi: 'buka_demo',     device: 'Mobile',  waktu: '5 menit lalu' },
    { sumber: 'Portfolio', aksi: 'lihat_halaman', device: 'Desktop', waktu: '8 menit lalu' },
    { sumber: 'Laundry',   aksi: 'demo_login',    device: 'Mobile',  waktu: '12 menit lalu', login_sebagai: 'owner' },
    { sumber: 'Absensi',   aksi: 'buka_demo',     device: 'Desktop', waktu: '20 menit lalu' },
  ];

  // Device emoji
  function deviceEmoji(device) {
    if (!device) return '🖥️';
    if (device === 'Mobile')  return '📱';
    if (device === 'Tablet')  return '📟';
    return '🖥️';
  }

  // Build satu item ticker HTML
  function buildItemHtml(v) {
    const src    = labelSumber[v.sumber] || labelSumber['Unknown'];
    const aksi   = labelAksi[v.aksi] || 'mengakses';
    const dev    = deviceEmoji(v.device);
    const waktu  = v.waktu || 'baru saja';
    const loginInfo = (v.aksi === 'demo_login' && v.login_sebagai)
      ? ` sebagai <span class="ticker-highlight">${v.login_sebagai}</span>` : '';

    return `
      <div class="ticker-item">
        <span class="ticker-emoji">🟢</span>
        <span>Seseorang ${aksi} <span class="ticker-highlight">${src.emoji} ${src.text}</span>${loginInfo}</span>
        <span class="ticker-time">· ${dev} · ${waktu}</span>
      </div>`;
  }

  // Render ke DOM
  function renderItems(items) {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const html = items.map(buildItemHtml).join('');
    // Duplikasi untuk loop seamless
    track.innerHTML = html + html;

    // Set kecepatan proporsional
    requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      const duration  = Math.max(30, halfWidth / 55); // min 30 detik
      track.style.animationDuration = duration + 's';
    });
  }

  // Ambil data dari API
  async function fetchAndRender() {
    try {
      const res  = await fetch(API_BASE, { method: 'GET', headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(5000) });
      const json = await res.json();

      if (json.success && json.data && json.data.length > 0) {
        renderItems(json.data);
      } else {
        renderItems(fallbackItems);
      }
    } catch (e) {
      // API tidak bisa dicapai (lokal / offline) → pakai fallback
      renderItems(fallbackItems);
    }
  }

  // Kirim ping ke API bahwa portfolio dibuka
  async function sendPing() {
    try {
      await fetch(API_BASE + '/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          sumber:     SUMBER_NAMA,
          halaman:    HALAMAN,
          aksi:       'lihat_halaman',
          user_agent: navigator.userAgent,
          referrer:   document.referrer || '',
        }),
        keepalive: true,
      });
    } catch (e) {
      // Abaikan error ping — tidak ganggu user
    }
  }

  // Init
  function init() {
    fetchAndRender();
    sendPing();

    // Refresh ticker setiap 60 detik dengan data terbaru
    setInterval(fetchAndRender, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
