// assets/js/main.js — shared across every page

// ---------- THEME TOGGLE (light/dark, persisted) ----------
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("pw-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
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
