// assets/js/main.js — shared across every page

// ---------- GOOGLE ANALYTICS 4 ----------
// Loaded here (not per-page) so every page on the site reports automatically
// since /assets/js/main.js is already included everywhere.
// TODO: replace G-XXXXXXXXXX below with your real GA4 Measurement ID once
// you've created the property (Analytics > Admin > Data Streams > Web).
// Until you swap it in, this silently does nothing useful (GA will just
// reject the placeholder ID) — it will NOT break the site either way.
(function () {
  const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
})();

// ---------- THEME TOGGLE (light/dark, persisted) ----------
// Default is always LIGHT. The only way a visitor ever sees dark mode is if
// they previously clicked the theme toggle button in THIS browser — their
// choice is remembered in localStorage on that one browser only. System/OS
// dark-mode preference is intentionally ignored so every new visitor, on
// every device, always starts on the light theme.
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("pw-theme");
  const initial = saved || "light";
  if (initial === "dark") root.setAttribute("data-theme", "dark");

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("pw-theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("pw-theme", "dark");
      }
    });
  });
})();

// ---------- MOBILE NAV ----------
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".nav__toggle-btn");
  const links = document.querySelector(".nav__links");
  if (toggleBtn && links) {
    toggleBtn.addEventListener("click", () => links.classList.toggle("open"));
  }
});

// ---------- SCROLL REVEAL (cards + fade-up elements) ----------
document.addEventListener("DOMContentLoaded", () => {
  const revealables = document.querySelectorAll(".card, .fade-up");
  if (!revealables.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in-view"), i * 50);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealables.forEach((el) => observer.observe(el));
});

// ---------- STAT COUNTER ANIMATION ----------
document.addEventListener("DOMContentLoaded", () => {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => obs.observe(n));
});

// ---------- BACK TO TOP ----------
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 600);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});

// ---------- READING PROGRESS BAR (article pages only) ----------
document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector("article.post");
  if (!article) return;

  const bar = document.createElement("div");
  bar.className = "read-progress";
  document.body.appendChild(bar);

  window.addEventListener("scroll", () => {
    const rect = article.getBoundingClientRect();
    const total = article.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + "%";
  });
});

// ---------- NEWSLETTER FORM (front-end only demo handling) ----------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type=email]");
    const btn = form.querySelector("button");
    const original = btn.textContent;
    btn.textContent = "Subscribed ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      input.value = "";
    }, 2500);
  });
});

// ---------- REAL-TIME VIEW TRACKING (runs on every page, incl. post pages) ----------
// Records one "view" per visitor per post per browser session, via /api/views
// (Vercel KV backed). blog-render.js reads these counts back on home/blog pages.
(function () {
  const SEEN_KEY = "asfiblog_seen_session";

  document.addEventListener("DOMContentLoaded", () => {
    const article = document.querySelector("article.post");
    if (!article) return; // only track on individual post pages

    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) return;
    const match = canonical.href.match(/\/blog\/([^/]+)\.html/);
    if (!match) return;
    const slug = match[1];

    let seen = [];
    try { seen = JSON.parse(sessionStorage.getItem(SEEN_KEY)) || []; } catch (e) {}
    if (seen.includes(slug)) return;
    seen.push(slug);
    try { sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) {}

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug })
    }).catch(() => {}); // fail silently, never break the page
  });
})();