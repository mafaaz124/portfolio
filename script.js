/* =========================================================
   Portfolio Interactions — script.js
   ========================================================= */

/* ------------------------------
   Cache DOM
   ------------------------------ */
   const progressBar = document.getElementById('scroll-progress');
   const themeToggle = document.getElementById('themeToggle');
   const navLinks = document.querySelectorAll('.nav-link');
   const sections = [...document.querySelectorAll('main section')];
   const year = document.getElementById('year');
   const navToggle = document.querySelector('.nav-toggle');
   const navLinksContainer = document.querySelector('.nav-links');
   
   /* Set current year in footer */
   if (year) year.textContent = new Date().getFullYear();
   
   /* ------------------------------
      Scroll Progress
      ------------------------------ */
   function updateProgress() {
     const scrollTop = window.scrollY || document.documentElement.scrollTop;
     const docHeight = document.documentElement.scrollHeight - window.innerHeight;
     const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
     if (progressBar) progressBar.style.width = `${progress}%`;
   }
   document.addEventListener('scroll', updateProgress, { passive: true });
   updateProgress();
   
   /* ------------------------------
      Theme Toggle (dark / light / gt)
      ------------------------------ */
   (() => {
     const toggleBtn = document.getElementById('themeToggle');
     if (!toggleBtn) return;
   
     let iconEl = toggleBtn.querySelector('.theme-icon');
     if (!iconEl) {
       iconEl = document.createElement('span');
       iconEl.className = 'theme-icon';
       iconEl.setAttribute('aria-hidden', 'true');
       toggleBtn.appendChild(iconEl);
     }
   
     const THEMES = [
       { name: 'dark',  cls: null,    icon: '🌙' },
       { name: 'light', cls: 'light', icon: '☀️' },
       { name: 'gt',    cls: 'gt',    icon: '🐝' },
     ];
   
     function applyTheme(themeName) {
       const html = document.documentElement;
       html.classList.remove('light', 'gt');
       const conf = THEMES.find(t => t.name === themeName) || THEMES[0];
       if (conf.cls) html.classList.add(conf.cls);
       html.setAttribute('data-theme', conf.name);
       iconEl.textContent = conf.icon;
       localStorage.setItem('theme', conf.name);
       const next = THEMES[(THEMES.findIndex(t => t.name === conf.name) + 1) % THEMES.length].name;
       toggleBtn.setAttribute('aria-label', `Switch theme (next: ${next})`);
     }
   
     applyTheme(localStorage.getItem('theme') || 'dark');
   
     toggleBtn.addEventListener('click', () => {
       const current = localStorage.getItem('theme') || 'dark';
       const idx = THEMES.findIndex(t => t.name === current);
       const next = THEMES[(idx + 1) % THEMES.length].name;
       applyTheme(next);
     });
   })();
   
   /* ------------------------------
      Mobile Nav Toggle
      ------------------------------ */
   navToggle?.addEventListener('click', () => {
     const open = navLinksContainer.classList.toggle('open');
     navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
   });
   navLinks.forEach(link =>
     link.addEventListener('click', () => navLinksContainer.classList.remove('open'))
   );
   
   /* ==============================
      Typing (multi-font)
      ============================== */
   (() => {
     const el = document.querySelector('.typing');
     if (!el) return;
   
     const baseText =
       el.getAttribute('data-text')?.trim() ||
       el.textContent.trim() ||
       'Mafaaz Siddiqui';
   
     const fontCycle = [
       { family: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'", cls: 'font-inter' },
       { family: "'Orbitron', sans-serif", cls: 'font-orbitron' },
       { family: "'DM Serif Text', Georgia, serif", cls: 'font-dmserif' },
     ];
   
     const TYPE_SPEED = 90;
     const DELETE_SPEED = 55;
     const HOLD_AFTER_TYPE = 900;
     const HOLD_AFTER_DELETE = 400;
     const CARET_DIM_ON_DELETE = false;
   
     const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     if (prefersReduced) {
       const f = fontCycle[0];
       el.textContent = baseText;
       el.style.fontFamily = f.family;
       if (f.cls) el.classList.add(f.cls);
       return;
     }
   
     let fontIndex = 0;
     let i = 0;
     let isDeleting = false;
     let timer = null;
   
     function setFont(index) {
       const f = fontCycle[index % fontCycle.length];
       fontCycle.forEach(ff => ff.cls && el.classList.remove(ff.cls));
       el.style.fontFamily = f.family;
       if (f.cls) el.classList.add(f.cls);
     }
   
     function schedule(d) { clearTimeout(timer); timer = setTimeout(tick, d); }
   
     function tick() {
       const full = baseText;
   
       if (!isDeleting) {
         el.textContent = full.slice(0, i + 1);
         i++;
         if (i === full.length) {
           setTimeout(() => {
             isDeleting = true;
             if (CARET_DIM_ON_DELETE) el.style.opacity = '0.85';
             schedule(DELETE_SPEED);
           }, HOLD_AFTER_TYPE);
           return;
         }
         schedule(TYPE_SPEED);
       } else {
         el.textContent = full.slice(0, i - 1);
         i--;
         if (i === 0) {
           isDeleting = false;
           fontIndex = (fontIndex + 1) % fontCycle.length;
           setFont(fontIndex);
           if (CARET_DIM_ON_DELETE) el.style.opacity = '';
           setTimeout(() => schedule(TYPE_SPEED), HOLD_AFTER_DELETE);
           return;
         }
         schedule(DELETE_SPEED);
       }
     }
   
     try {
       if (document.fonts && document.fonts.load) {
         Promise.all([
           document.fonts.load('700 1rem Inter'),
           document.fonts.load('700 1rem Orbitron'),
           document.fonts.load('400 1rem "DM Serif Text"'),
         ]).finally(start);
       } else start();
     } catch { start(); }
   
     function start() {
       setFont(fontIndex);
       el.textContent = '';
       schedule(TYPE_SPEED);
     }
   })();
   
   /* ------------------------------
      Reveal on Scroll
      ------------------------------ */
   const revealObserver = new IntersectionObserver(
     entries => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('visible');
           revealObserver.unobserve(entry.target);
         }
       });
     },
     { threshold: 0.12 }
   );
   document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
   
   /* ==============================
      Skills Advanced
      ============================== */
   (() => {
     const meters = document.querySelectorAll('#skills .meter5');
     const meterObs = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (!entry.isIntersecting) return;
         const meter = entry.target;
         const level = Math.max(0, Math.min(5, parseInt(meter.getAttribute('data-level') || '0', 10)));
         const segs = meter.querySelectorAll('.meter5__bar .seg');
         segs.forEach((seg, i) => {
           setTimeout(() => { if (i < level) seg.classList.add('is-filled'); }, i * 100);
         });
         meterObs.unobserve(meter);
       });
     }, { threshold: 0.35 });
     meters.forEach(m => meterObs.observe(m));
   
     const tools = document.querySelectorAll('#skills .tool');
     const toolObs = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (!entry.isIntersecting) return;
         entry.target.classList.add('is-visible');
         toolObs.unobserve(entry.target);
       });
     }, { threshold: 0.2 });
     tools.forEach(t => toolObs.observe(t));
   })();
   
   /* ------------------------------
      Scroll Spy — Highlight active nav link
      ------------------------------ */
   const spyObserver = new IntersectionObserver(
     entries => {
       entries.forEach(entry => {
         const id = entry.target.id;
         const link = document.querySelector(`.nav-link[href="#${id}"]`);
         if (entry.isIntersecting && link) {
           navLinks.forEach(l => l.classList.remove('active'));
           link.classList.add('active');
           history.replaceState(null, '', `#${id}`);
         }
       });
     },
     { rootMargin: '-45% 0px -50% 0px', threshold: 0.1 }
   );
   sections.forEach(section => spyObserver.observe(section));
   
   /* ==============================
      Projects (Modal Cards)
      ============================== */
   (() => {
     const grid = document.querySelector('.projects-grid.modal-cards');
     const modal = document.getElementById('projectModal');
     if (!grid || !modal) return;
   
     const panel    = modal.querySelector('.proj-modal__panel');
     const closeBtn = modal.querySelector('[data-close]');
     const backdrop = modal.querySelector('.proj-modal__backdrop');
     const titleEl  = modal.querySelector('#projModalTitle');
     const descEl   = modal.querySelector('#projModalDesc');
     const featEl   = modal.querySelector('#projFeatures');
     const chipsEl  = modal.querySelector('#projChips');
     const linksEl  = modal.querySelector('#projLinks');
     const galEl    = modal.querySelector('#projGallery');
   
     let returnFocusEl = null;
   
     const TECH_COLORS = {
       Python: '#3776AB', Django: '#0C4B33', React: '#61DAFB',
       'HTML/CSS':'#E34F26', HTML:'#E34F26', CSS:'#264DE4',
       JavaScript:'#F7DF1E', Java:'#EA2D2E', 'Google Maps':'#34A853',
       OpenAI:'#10A37F', Heroku:'#79589F', OCR:'#7dd3fc'
     };
   
     function openFromButton(btn) {
       returnFocusEl = btn;
   
       const title    = btn.dataset.title || 'Project';
       const desc     = btn.dataset.desc || '';
       const features = safeJSON(btn.dataset.features, []);
       const techs    = (btn.dataset.tech || '').split(',').map(s => s.trim()).filter(Boolean);
       const links    = safeJSON(btn.dataset.links, {});
       const images   = (btn.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
   
       titleEl.textContent = title;
       descEl.textContent  = desc;
   
       featEl.innerHTML = '';
       features.forEach(f => { const li = document.createElement('li'); li.textContent = f; featEl.appendChild(li); });
   
       chipsEl.innerHTML = '';
       techs.forEach(t => {
         const li = document.createElement('li');
         li.className = 'chip';
         li.style.setProperty('--chip', TECH_COLORS[t] || 'var(--accent)');
         li.textContent = t;
         chipsEl.appendChild(li);
       });
   
       linksEl.innerHTML = '';
       Object.entries(links).forEach(([label, href]) => {
         const a = document.createElement('a');
         a.className = 'btn';
         a.target = '_blank';
         a.rel = 'noreferrer';
         a.href = href;
         a.textContent = label;
         linksEl.appendChild(a);
       });
   
       galEl.innerHTML = '';
       images.slice(0,3).forEach(src => {
         const img = document.createElement('img');
         img.src = src; img.alt = `${title} screenshot`;
         galEl.appendChild(img);
       });
   
       modal.hidden = false;
       void modal.offsetWidth; // reflow for transition
       modal.classList.add('is-open');
   
       // Prevent background scroll + suppress background hover
       document.documentElement.style.overflow = 'hidden';
       document.body.style.overflow = 'hidden';
       document.documentElement.classList.add('modal-open');
   
       focusFirst(panel);
       trapInit();
     }
   
     function closeModal() {
       modal.classList.remove('is-open');
       setTimeout(() => {
         modal.hidden = true;
         document.documentElement.style.overflow = '';
         document.body.style.overflow = '';
         document.documentElement.classList.remove('modal-open');
   
         // Either return focus for a11y or blur to avoid any visual outline:
         if (returnFocusEl) {
           // returnFocusEl.focus();
           returnFocusEl.blur();
         }
       }, 220);
     }
   
     function onKey(e) {
       if (modal.hidden) return;
       if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
       else if (e.key === 'Tab') { trapTab(panel, e); }
     }
   
     function tabbables(root) {
       return [...root.querySelectorAll(
         'a[href], button:not([disabled]), textarea, input, select, details, summary, [tabindex]:not([tabindex="-1"])'
       )].filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
     }
     function focusFirst(root) {
       const t = tabbables(root);
       (t[0] || closeBtn).focus();
     }
     function trapTab(root, e) {
       const t = tabbables(root);
       if (!t.length) return;
       const first = t[0], last = t[t.length - 1];
       if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
       else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
     }
     function trapInit()    { document.addEventListener('keydown', onKey); }
     function trapCleanup() { document.removeEventListener('keydown', onKey); }
   
     grid.addEventListener('click', (e) => {
       const btn = e.target.closest('.proj-card');
       if (btn) openFromButton(btn);
     });
     grid.addEventListener('keydown', (e) => {
       const btn = e.target.closest('.proj-card');
       if (!btn) return;
       if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFromButton(btn); }
     });
   
     modal.addEventListener('click', (e) => {
       if (e.target.matches('[data-close]')) { trapCleanup(); closeModal(); }
     });
     modal.addEventListener('mousedown', (e) => {
       if (e.target === modal.querySelector('.proj-modal__backdrop')) { trapCleanup(); closeModal(); }
     });
   
     function safeJSON(str, fallback) { try { return JSON.parse(str); } catch { return fallback; } }
   })();
   
   /* ------------------------------
      Chips: subtle stagger
      ------------------------------ */
   const chipsPane = document.querySelector('.chip-group');
   if (chipsPane) {
     const chips = chipsPane.querySelectorAll('.chip');
     chips.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(6px)'; });
     const chipObserver = new IntersectionObserver(entries => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           chips.forEach((c, i) => {
             c.style.transition = 'opacity 300ms ease, transform 300ms ease';
             c.style.transitionDelay = `${i * 40}ms`;
             c.style.opacity = '1';
             c.style.transform = 'translateY(0)';
           });
           chipObserver.unobserve(entry.target);
         }
       });
     }, { threshold: 0.2 });
     chipObserver.observe(chipsPane);
   }
   
   /* ===== Scoped Magical Cards (Contact) ===== */
   (() => {
     const container = document.querySelector('#ms-cards');
     if (!container) return;
     const cards = Array.from(container.querySelectorAll('.ms-card'));
   
     function setXY(e) {
       const cx = e.clientX ?? (e.touches && e.touches[0].clientX);
       const cy = e.clientY ?? (e.touches && e.touches[0].clientY);
       if (cx == null || cy == null) return;
       for (const card of cards) {
         const r = card.getBoundingClientRect();
         card.style.setProperty('--ms-x', `${cx - r.left}px`);
         card.style.setProperty('--ms-y', `${cy - r.top}px`);
       }
     }
   
     container.addEventListener('mousemove', setXY, { passive: true });
     container.addEventListener('touchmove', setXY, { passive: true });
   
     container.addEventListener('mouseleave', () => {
       cards.forEach(c => {
         c.style.setProperty('--ms-x', '50%');
         c.style.setProperty('--ms-y', '50%');
       });
     });
   })();
   
   /* =========================================================
      Hover guard during scroll + blur focus when leaving Projects
      ========================================================= */
   (() => {
     // Disable hover effects while actively scrolling (paired with CSS html.no-hover)
     let _hoverTO;
     window.addEventListener('scroll', () => {
       document.documentElement.classList.add('no-hover');
       clearTimeout(_hoverTO);
       _hoverTO = setTimeout(() => {
         document.documentElement.classList.remove('no-hover');
       }, 140);
     }, { passive: true });
   
     // If a proj-card keeps focus, blur it once Projects is out of view
     const projSection = document.getElementById('projects');
     if (projSection) {
       const io = new IntersectionObserver(([e]) => {
         if (!e.isIntersecting && document.activeElement?.classList.contains('proj-card')) {
           document.activeElement.blur();
         }
       }, { threshold: 0 });
       io.observe(projSection);
     }
   })();
   
