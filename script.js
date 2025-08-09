

/* =========================================================
   Portfolio Interactions — script.js
   - Scroll progress
   - Theme: Dark / Light / GT (with bee icon in HTML)
   - Mobile nav toggle
   - Typing effect (Hero)
   - Reveal-on-scroll animations
   - Skill bar animations
   - Scroll spy for navbar
   - Chip stagger animation
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
      Theme (Dark / Light / GT) with persistence
      - Uses <html data-theme="..."> for icon visibility
      - Adds .light or .gt class to switch CSS variable sets
      ------------------------------ */
   const THEMES = ['dark', 'light', 'gt'];
   
   function setTheme(theme) {
     const t = THEMES.includes(theme) ? theme : 'dark';
   
     // Reset theme classes
     document.documentElement.classList.remove('light', 'gt');
     if (t === 'light') document.documentElement.classList.add('light');
     if (t === 'gt') document.documentElement.classList.add('gt');
   
     // Set attribute for icon switching
     document.documentElement.setAttribute('data-theme', t);
   
     // Persist selection
     localStorage.setItem('theme', t);
   
     // Update a11y label to show next theme
     const next = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
     if (themeToggle) themeToggle.setAttribute('aria-label', `Switch theme (next: ${next})`);
   }
   
   // Initialize theme (prefers saved value, defaults to dark)
   setTheme(localStorage.getItem('theme') || 'dark');
   
   // Cycle themes on click: dark -> light -> gt -> dark
   themeToggle?.addEventListener('click', () => {
     const current = document.documentElement.getAttribute('data-theme') || 'dark';
     const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
     setTheme(next);
   });
   
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
   
   /* ------------------------------
      Typing Effect (Hero)
      - Reads data-text from .typing element
      ------------------------------ */
   function typeText(el, speed = 90) {
     const text = el.getAttribute('data-text') || el.textContent.trim();
     el.textContent = '';
     let i = 0;
     const timer = setInterval(() => {
       el.textContent += text[i++] || '';
       if (i > text.length) clearInterval(timer);
     }, speed);
   }
   const typingEl = document.querySelector('.typing');
   if (typingEl) typeText(typingEl, 70);
   
   /* ------------------------------
      Reveal on Scroll
      - Adds .visible when element intersects
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
   
   /* ------------------------------
      Skill Bars — Animate widths in view
      ------------------------------ */
   const skillBars = document.querySelectorAll('.bar');
   const skillsObserver = new IntersectionObserver(
     entries => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           const span = entry.target.querySelector('span');
           const pct = entry.target.getAttribute('data-percent') || 0;
           if (span) span.style.width = pct + '%';
           skillsObserver.unobserve(entry.target);
         }
       });
     },
     { threshold: 0.35 }
   );
   skillBars.forEach(bar => skillsObserver.observe(bar));
   
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
           // Update hash (no jump)
           history.replaceState(null, '', `#${id}`);
         }
       });
     },
     { rootMargin: '-45% 0px -50% 0px', threshold: 0.1 }
   );
   sections.forEach(section => spyObserver.observe(section));
   
   /* ------------------------------
      Projects: Keyboard accessibility (optional visual cue)
      ------------------------------ */
   document.querySelectorAll('.project').forEach(card => {
     card.addEventListener('keydown', e => {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         card.classList.add('hovering');
         setTimeout(() => card.classList.remove('hovering'), 300);
       }
     });
   });
   
   /* ------------------------------
      Chips: Subtle stagger on first reveal
      ------------------------------ */
   const chipsPane = document.querySelector('.chip-group');
   if (chipsPane) {
     const chips = chipsPane.querySelectorAll('.chip');
   
     // Initial state
     chips.forEach(c => {
       c.style.opacity = '0';
       c.style.transform = 'translateY(6px)';
     });
   
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
   
   