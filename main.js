// ===================================
// Blog Posts Data (loaded from JSON)
// ===================================
let blogPosts = [];

// REPLACE: Update fallback posts with your own
const BLOG_POSTS_FALLBACK = [
  {"id":"1","title":"Your First Blog Post Title","date":"2025-01-01","slug":"first-post","excerpt":"A short excerpt or summary of your first blog post."},
  {"id":"2","title":"Your Second Blog Post Title","date":"2025-02-01","slug":"second-post","excerpt":"A short excerpt or summary of your second blog post."}
];

const _blogFetchPromise = fetch('content/blog/posts.json')
  .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
  .catch(() => null);

async function loadBlogPosts() {
  const data = await _blogFetchPromise;
  blogPosts = data || BLOG_POSTS_FALLBACK;
  window.blogPosts = blogPosts;
  return blogPosts;
}

window.blogPosts = blogPosts;
window.loadBlogPosts = loadBlogPosts;

// ===================================
// App Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  fetchUserIP();
  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);

  initPreloader((preloaderWasShown) => {
    initSectionReveals();
    if (preloaderWasShown) {
      setTimeout(startTypewriter, 800);
    }
  });
}

// ===================================
// Core Functions
// ===================================

function fetchUserIP() {
  const el = document.getElementById('user-ip');
  if (!el) return;

  const cached = sessionStorage.getItem('userIP');
  if (cached) {
    el.textContent = cached;
    return;
  }

  const apis = [
    { url: 'https://api.ipify.org?format=json', getIP: data => data.ip },
    { url: 'https://ipapi.co/json/', getIP: data => data.ip },
    { url: 'https://api.ip.sb/geoip', getIP: data => data.ip }
  ];

  async function tryAPIs() {
    for (const api of apis) {
      try {
        const response = await fetch(api.url);
        const data = await response.json();
        const ip = api.getIP(data);
        if (ip) {
          el.textContent = ip;
          sessionStorage.setItem('userIP', ip);
          return;
        }
      } catch (e) {
        continue;
      }
    }
    el.textContent = 'guest';
  }

  tryAPIs();
}

function startTypewriter() {
  // REPLACE: Update these phrases with your own name/greeting
  const phrases = ["welcome :)", "i'm your name"];
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  el.textContent = '';
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        if (phraseIdx === phrases.length - 1) return;
        setTimeout(() => { deleting = true; tick(); }, 1500);
        return;
      }
      setTimeout(tick, 70);
    } else {
      el.textContent = current.substring(0, charIdx);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx++;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }

  setTimeout(tick, 200);
}


function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function handleHashNavigation() {
  const hash = window.location.hash;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function toggleMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('menu-toggle');
  if (nav) nav.classList.toggle('open');
  if (btn) btn.classList.toggle('active');
}

// ===================================
// Theme Toggle
// ===================================
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

window.toggleMobileMenu = toggleMobileMenu;
window.formatDate = formatDate;
window.toggleTheme = toggleTheme;

// ===================================
// Preloader
// ===================================
const PRELOADER_SEEN_KEY = 'preloaderSeen';

function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const fill = document.querySelector('.loading-bar');

  if (!preloader) {
    document.body.classList.remove('loading');
    if (onComplete) onComplete(false);
    return;
  }

  const nav = performance.getEntriesByType?.('navigation')[0];
  const legacyType = performance.navigation?.type;
  const navType = nav?.type ?? (legacyType === 2 ? 'back_forward' : legacyType === 1 ? 'reload' : 'navigate');

  if (navType === 'back_forward' || (navType === 'navigate' && sessionStorage.getItem(PRELOADER_SEEN_KEY))) {
    preloader.remove();
    document.body.classList.remove('loading');
    // REPLACE: Update final typewriter text with your name
    const heroEl = document.getElementById('typewriter-text');
    if (heroEl) heroEl.textContent = "your name";
    if (onComplete) onComplete(false);
    return;
  }

  const heroText = document.getElementById('typewriter-text');
  if (heroText) heroText.textContent = '';

  window.addEventListener('load', () => {
    if (fill) fill.style.width = '100%';

    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.remove('loading');
      sessionStorage.setItem(PRELOADER_SEEN_KEY, '1');

      if (onComplete) onComplete(true);

      setTimeout(() => preloader.remove(), 800);
    }, 600);
  });
}

// ===================================
// Section Reveal on Scroll
// ===================================
function initSectionReveals() {
  const sections = document.querySelectorAll('section:not(.hero)');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.classList.add('section-reveal');
    observer.observe(section);
  });
}
