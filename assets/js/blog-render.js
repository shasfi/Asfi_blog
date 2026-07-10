// assets/js/blog-render.js — reads window.ASFIBLOG_POSTS (posts-data.js)
// and renders: (1) the "Trending right now" section on the homepage,
// (2) the categories + search/filter bar + grid on /blog/index.html,
// (3) increments a lightweight view counter on individual post pages.

(function () {
  const POSTS = window.ASFIBLOG_POSTS || [];
  const VIEWS_KEY = "asfiblog_view_deltas";
  const SEEN_KEY = "asfiblog_seen_session";
  const PAGE_SIZE = 6;

  // ---------- shared helpers ----------

  function getViewDeltas() {
    try { return JSON.parse(localStorage.getItem(VIEWS_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function displayViews(post) {
    const deltas = getViewDeltas();
    return post.views + (deltas[post.slug] || 0);
  }

  function formatViews(n) {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function daysAgo(iso) {
    const d = new Date(iso + "T00:00:00");
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff <= 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return diff + " days ago";
    return formatDate(iso);
  }

  function stampClass(category) {
    return category === "Health" ? "stamp stamp--teal" : "stamp";
  }

  function eyeIcon() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:3px;"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  }

  function cardHtml(post, opts) {
    opts = opts || {};
    const views = displayViews(post);
    const badge = opts.rank
      ? `<span class="trend-badge">#${opts.rank} Trending</span>`
      : "";
    return `<a href="/blog/${post.slug}.html" class="card" data-category="${post.category}" data-date="${post.date}" data-views="${views}">
      <div class="card__img-wrap">
        ${badge}
        <img src="${post.image}" alt="${post.title}" loading="lazy" />
      </div>
      <div class="card__body">
        <span class="${stampClass(post.category)}">${post.category}</span>
        <div class="card__title">${post.title}</div>
        <p class="card__excerpt">${post.excerpt}</p>
        <p class="timestamp">${formatDate(post.date)} · ${post.readMins} min read</p>
        <p class="card__views">${eyeIcon()}${formatViews(views)} views</p>
      </div>
    </a>`;
  }

  function featuredHtml(post) {
    const views = displayViews(post);
    return `<a href="/blog/${post.slug}.html" class="featured">
      <div class="featured__img">
        <span class="trend-badge trend-badge--lg">🔥 #1 Trending</span>
        <img src="${post.image}" alt="${post.title}" loading="lazy" />
      </div>
      <div class="featured__body">
        <span class="${stampClass(post.category)}">${post.category}</span>
        <h3>${post.title}</h3>
        <p class="card__excerpt">${post.excerpt}</p>
        <p class="timestamp">${formatDate(post.date)} · ${post.readMins} min read</p>
        <p class="card__views">${eyeIcon()}${formatViews(views)} views this week</p>
      </div>
    </a>`;
  }

  // ---------- homepage: trending section ----------

  function initHomeTrending() {
    const featuredEl = document.getElementById("trending-featured");
    const gridEl = document.getElementById("trending-grid");
    if (!featuredEl || !gridEl || !POSTS.length) return;

    const sorted = [...POSTS].sort((a, b) => displayViews(b) - displayViews(a));
    const top4 = sorted.slice(0, 4);

    featuredEl.innerHTML = featuredHtml(top4[0]);
    gridEl.innerHTML = top4.slice(1).map((p, i) => cardHtml(p, { rank: i + 2 })).join("");

    [...gridEl.querySelectorAll(".card")].forEach((el) => el.classList.add("in-view"));
  }

  // ---------- blog listing page: categories + filters + grid ----------

  function initBlogListing() {
    const gridEl = document.getElementById("posts-grid");
    const pillsEl = document.getElementById("category-pills");
    if (!gridEl || !POSTS.length) return;

    const searchEl = document.getElementById("blog-search");
    const categorySelectEl = document.getElementById("filter-category");
    const sortEl = document.getElementById("filter-sort");
    const emptyEl = document.getElementById("posts-empty");
    const countEl = document.getElementById("results-count");

    const categories = [...new Set(POSTS.map((p) => p.category))].sort();

    const paginationEl = document.getElementById("pagination");

    const params = new URLSearchParams(window.location.search);
    const state = {
      category: params.get("category") || "all",
      q: params.get("q") || "",
      sort: params.get("sort") || "newest",
      page: Math.max(1, parseInt(params.get("page"), 10) || 1)
    };

    // build category pills
    if (pillsEl) {
      const pillHtml = (val, label) =>
        `<button type="button" class="pill${state.category === val ? " active" : ""}" data-category="${val}">${label}</button>`;
      pillsEl.innerHTML =
        pillHtml("all", "All") +
        categories.map((c) => pillHtml(c.toLowerCase(), c)).join("");
    }

    // build category dropdown
    if (categorySelectEl) {
      categorySelectEl.innerHTML =
        `<option value="all">All categories</option>` +
        categories.map((c) => `<option value="${c.toLowerCase()}">${c}</option>`).join("");
      categorySelectEl.value = state.category;
    }
    if (sortEl) sortEl.value = state.sort;
    if (searchEl) searchEl.value = state.q;

    function syncUrl() {
      const p = new URLSearchParams();
      if (state.category !== "all") p.set("category", state.category);
      if (state.q) p.set("q", state.q);
      if (state.sort !== "newest") p.set("sort", state.sort);
      if (state.page > 1) p.set("page", state.page);
      const qs = p.toString();
      history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }

    function goToPage(n) {
      state.page = n;
      render();
      const grid = document.getElementById("posts-grid");
      if (grid && typeof grid.scrollIntoView === "function") {
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function renderPagination(totalPages) {
      if (!paginationEl) return;
      if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        return;
      }

      const btn = (label, page, opts) => {
        opts = opts || {};
        const disabled = opts.disabled ? " disabled" : "";
        const active = opts.active ? " active" : "";
        return `<button type="button" class="page-btn${active}"${disabled} data-page="${page}">${label}</button>`;
      };

      let pages = [];
      pages.push(btn("‹ Prev", state.page - 1, { disabled: state.page === 1 }));

      const addNum = (n) => pages.push(btn(String(n), n, { active: n === state.page }));
      const addDots = () => pages.push(`<span class="page-dots">…</span>`);

      addNum(1);
      if (state.page > 3) addDots();
      for (let n = Math.max(2, state.page - 1); n <= Math.min(totalPages - 1, state.page + 1); n++) addNum(n);
      if (state.page < totalPages - 2) addDots();
      if (totalPages > 1) addNum(totalPages);

      pages.push(btn("Next ›", state.page + 1, { disabled: state.page === totalPages }));

      paginationEl.innerHTML = pages.join("");
    }

    function render() {
      let list = POSTS.filter((p) => {
        const matchesCategory = state.category === "all" || p.category.toLowerCase() === state.category;
        const matchesQuery =
          !state.q ||
          p.title.toLowerCase().includes(state.q.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(state.q.toLowerCase());
        return matchesCategory && matchesQuery;
      });

      if (state.sort === "oldest") list.sort((a, b) => a.date.localeCompare(b.date));
      else if (state.sort === "trending") list.sort((a, b) => displayViews(b) - displayViews(a));
      else list.sort((a, b) => b.date.localeCompare(a.date)); // newest

      const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (state.page > totalPages) state.page = totalPages;
      const pageList = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

      gridEl.innerHTML = pageList.map((p) => cardHtml(p)).join("");
      [...gridEl.querySelectorAll(".card")].forEach((el) => el.classList.add("in-view"));

      if (emptyEl) emptyEl.style.display = list.length ? "none" : "block";
      if (countEl) {
        const startNum = list.length ? (state.page - 1) * PAGE_SIZE + 1 : 0;
        const endNum = Math.min(state.page * PAGE_SIZE, list.length);
        countEl.textContent = list.length
          ? `Showing ${startNum}–${endNum} of ${list.length} ${list.length === 1 ? "story" : "stories"}`
          : "0 stories";
      }
      renderPagination(totalPages);

      if (pillsEl) {
        [...pillsEl.querySelectorAll(".pill")].forEach((btn) =>
          btn.classList.toggle("active", btn.dataset.category === state.category)
        );
      }

      // Lightweight ItemList schema for freshness/AEO signal on the listing
      const existing = document.getElementById("itemlist-schema");
      if (existing) existing.remove();
      const schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.id = "itemlist-schema";
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: list.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://asfiblog.vercel.app/blog/${p.slug}.html`,
          name: p.title
        }))
      });
      document.head.appendChild(schema);

      syncUrl();
    }

    let debounceTimer;
    if (searchEl) {
      searchEl.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.q = searchEl.value.trim();
          state.page = 1;
          render();
        }, 250);
      });
    }
    if (categorySelectEl) {
      categorySelectEl.addEventListener("change", () => {
        state.category = categorySelectEl.value;
        state.page = 1;
        render();
      });
    }
    if (sortEl) {
      sortEl.addEventListener("change", () => {
        state.sort = sortEl.value;
        state.page = 1;
        render();
      });
    }
    if (pillsEl) {
      pillsEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".pill");
        if (!btn) return;
        state.category = btn.dataset.category;
        state.page = 1;
        if (categorySelectEl) categorySelectEl.value = state.category;
        render();
      });
    }

    if (paginationEl) {
      paginationEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".page-btn");
        if (!btn || btn.disabled) return;
        const n = parseInt(btn.dataset.page, 10);
        if (!isNaN(n)) goToPage(n);
      });
    }

    render();
  }

  // ---------- individual post pages: view counter ----------

  function trackView() {
    const article = document.querySelector("article.post");
    if (!article) return;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) return;
    const match = canonical.href.match(/\/blog\/([^/]+)\.html/);
    if (!match) return;
    const slug = match[1];

    let seen = [];
    try { seen = JSON.parse(sessionStorage.getItem(SEEN_KEY)) || []; } catch (e) {}
    if (seen.includes(slug)) return;
    seen.push(slug);
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));

    const deltas = getViewDeltas();
    deltas[slug] = (deltas[slug] || 0) + 1;
    localStorage.setItem(VIEWS_KEY, JSON.stringify(deltas));
  }

  document.addEventListener("DOMContentLoaded", () => {
    trackView();
    initHomeTrending();
    initBlogListing();
  });
})();