document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeKey = 'portfolio-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    themeIcon.classList.toggle('fa-sun', theme === 'dark');
    themeIcon.classList.toggle('fa-moon', theme !== 'dark');
  }

  try {
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme) applyTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
  } catch (_) { /* Theme toggle still works when browser storage is unavailable. */ }

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem(themeKey, nextTheme); } catch (_) { /* Ignore storage restrictions. */ }
  });

  const navbar = document.getElementById('mainNavbar');
  const navItems = document.querySelectorAll('.nav-links .nav-link');
  const sections = [...document.querySelectorAll('main section[id]')];
  function updateNavigation() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    let activeId = 'home';
    sections.forEach((section) => { if (section.getBoundingClientRect().top <= 140) activeId = section.id; });
    navItems.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
    document.getElementById('scrollTopBtn').classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', updateNavigation, { passive: true });
  updateNavigation();

  navItems.forEach((link) => link.addEventListener('click', () => {
    const menu = document.getElementById('navbarContent');
    if (menu.classList.contains('show') && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));
  document.getElementById('scrollTopBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const revealItems = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else revealItems.forEach((item) => item.classList.add('visible'));

  const skillBars = document.querySelectorAll('.skill-progress-bar');
  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.style.width = `${entry.target.dataset.percent}%`; observer.unobserve(entry.target); }
    }), { threshold: 0.4 });
    skillBars.forEach((bar) => skillsObserver.observe(bar));
  } else skillBars.forEach((bar) => { bar.style.width = `${bar.dataset.percent}%`; });

  const role = document.getElementById('typedRole');
  const roles = ['Frontend Web Developer', 'UI Developer', 'Creative Problem Solver'];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;
  function typeRole() {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    role.textContent = current.slice(0, charIndex);
    let delay = deleting ? 45 : 85;
    if (!deleting && charIndex === current.length) { deleting = true; delay = 1500; }
    else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
    window.setTimeout(typeRole, delay);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) window.setTimeout(typeRole, 1700);

  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('contactForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = encodeURIComponent(values.get('subject'));
    const body = encodeURIComponent(`Name: ${values.get('name')}\nEmail: ${values.get('email')}\n\n${values.get('message')}`);
    document.getElementById('formStatus').textContent = 'Opening your email app…';
    window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
  });
});
