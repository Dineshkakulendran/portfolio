document.addEventListener('DOMContentLoaded', () => {

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById('scrollProgress');
  function updateProgress() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = max > 0 ? `${(h.scrollTop / max) * 100}%` : '0%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Layers panel toggle (mobile) ---------- */
  const panel = document.getElementById('layersPanel');
  const backdrop = document.getElementById('layersBackdrop');
  const toggleBtn = document.getElementById('layersToggle');

  function closePanel() { panel.classList.remove('open'); backdrop.classList.remove('show'); }
  function openPanel() { panel.classList.add('open'); backdrop.classList.add('show'); }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closePanel);
  document.querySelectorAll('.layer-row[data-target]').forEach(link => {
    link.addEventListener('click', closePanel);
  });

  /* ---------- Active layer on scroll + live properties panel ---------- */
  const sections = document.querySelectorAll('.section[id]');
  const layerRows = document.querySelectorAll('.layer-row[data-target]');

  const sectionMeta = {
    hero: { label: 'Hero', fill: 'accent-violet', fillName: 'Violet' },
    about: { label: 'About', fill: 'accent-blue', fillName: 'Blue' },
    experience: { label: 'Experience', fill: 'accent-violet', fillName: 'Violet' },
    skills: { label: 'Skills', fill: 'accent-mint', fillName: 'Mint' },
    projects: { label: 'Projects', fill: 'accent-coral', fillName: 'Coral' },
    services: { label: 'Services', fill: 'accent-blue', fillName: 'Blue' },
    education: { label: 'Education', fill: 'accent-violet', fillName: 'Violet' },
    certificates: { label: 'Certificates', fill: 'accent-mint', fillName: 'Mint' },
    contact: { label: 'Contact', fill: 'accent-mint', fillName: 'Mint' },
  };

  const propName = document.getElementById('propName');
  const propY = document.getElementById('propY');
  const propH = document.getElementById('propH');
  const propFillSwatch = document.getElementById('propFillSwatch');
  const propFillLabel = document.getElementById('propFillLabel');

  function updateInspector(section) {
    const id = section.getAttribute('id');
    const meta = sectionMeta[id];
    if (!meta) return;
    const rect = section.getBoundingClientRect();
    if (propName) propName.textContent = meta.label;
    if (propY) propY.textContent = Math.max(0, Math.round(section.offsetTop));
    if (propH) propH.textContent = Math.round(rect.height);
    if (propFillSwatch) propFillSwatch.style.background = `var(--${meta.fill})`;
    if (propFillLabel) propFillLabel.textContent = `${meta.fillName} · 100%`;
  }

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        layerRows.forEach(row => row.classList.toggle('active', row.dataset.target === id));
        updateInspector(entry.target);
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));
  if (sections[0]) updateInspector(sections[0]);

  /* ---------- Zoom control ---------- */
  const zoomValue = document.getElementById('zoomValue');
  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');
  const canvasEl = document.querySelector('.canvas');
  let zoom = 100;

  function applyZoom() {
    if (zoomValue) zoomValue.textContent = `${zoom}%`;
    if (canvasEl) canvasEl.style.transform = `scale(${zoom / 100})`;
  }
  if (zoomIn) zoomIn.addEventListener('click', () => { zoom = Math.min(120, zoom + 10); applyZoom(); });
  if (zoomOut) zoomOut.addEventListener('click', () => { zoom = Math.max(80, zoom - 10); applyZoom(); });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Skill bar fill ---------- */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level || 0;
        const fill = entry.target.querySelector('.bar-fill');
        if (fill) fill.style.width = `${level}%`;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.skill-bar').forEach(el => skillObserver.observe(el));

  /* ---------- Typing animation for hero role ---------- */
  const roles = [
    'UI/UX Designer',
    'Product Engineer & UI/UX Designer',
    'UX Researcher',
    'Product Designer'
  ];
  const typedEl = document.getElementById('typedRole');

  if (typedEl) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function typeLoop() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(typeLoop, 1500);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }

      typedEl.textContent = roles[roleIndex].substring(0, charIndex);
      setTimeout(typeLoop, deleting ? 40 : 75);
    }

    setTimeout(typeLoop, 1700);
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.style.color = '#ff7b8b';
        status.textContent = 'Please fill in every field.';
        return;
      }

      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:seethadineshka@gmail.com?subject=${subject}&body=${body}`;

      status.style.color = 'var(--accent-mint)';
      status.textContent = 'Opening your email app to send this message...';
      form.reset();
    });
  }

  /* ---------- Resume downloads ---------- */
  // Both buttons link directly to Dineshka_Kulendran_Resume.pdf with a `download`
  // attribute, so the browser downloads it automatically — no JS needed here.

});
