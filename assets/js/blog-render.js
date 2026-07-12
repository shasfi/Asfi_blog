// assets/js/blog-render.js — reads window.ASFIBLOG_POSTS (posts-data.js)
// and renders: (1) the "Trending right now" section on the homepage,
// (2) the categories + search/filter bar + paginated grid on /blog/index.html.
//
// View counts = baseline (post.views, seeded by generate-blog.js) + real
// cross-visitor count fetched from /api/views (backed by Vercel KV). The
// actual "+1" on a real visit is recorded in assets/js/main.js (runs on
// every page, including individual post pages) so this file only needs to
// READ the live counts to display them here and on the homepage.

(function () {
  const POSTS = window.ASFIBLOG_POSTS || [];
  const VIEWS_KEY = "asfiblog_view_deltas"; // legacy local fallback, used only if API fails
  const DEFAULT_PAGE_SIZE = 9;
  let REAL_VIEWS = {}; // slug -> live count from /api/views

  // ---------- shared helpers ----------

  function getLocalDeltas() {
    try { return JSON.parse(localStorage.getItem(VIEWS_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function displayViews(post) {
    if (REAL_VIEWS && Object.prototype.hasOwnProperty.call(REAL_VIEWS, post.slug)) {
      return post.views + REAL_VIEWS[post.slug];
    }
    // fallback: pre-KV local-only estimate, so numbers aren't empty before first fetch/if API is down
    const deltas = getLocalDeltas();
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

  // Real-time display: if a post has a full `timestamp` (ISO datetime, added
  // by generate-blog.js), show a live relative time for the first ~2 days
  // ("Just now", "14m ago", "3h ago") so it's clear exactly when something
  // was actually posted, then fall back to the plain date after that.
  // Older posts (or any without `timestamp`) just use formatDate as before.
  function formatWhen(post) {
    if (!post.timestamp) return formatDate(post.date);
    const then = new Date(post.timestamp).getTime();
    if (Number.isNaN(then)) return formatDate(post.date);
    const diffMs = Date.now() - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 2) return `${diffDay}d ago`;
    return formatDate(post.date);
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
        <p class="timestamp">${formatWhen(post)} · ${post.readMins} min read</p>
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
        <p class="timestamp">${formatWhen(post)} · ${post.readMins} min read</p>
        <p class="card__views">${eyeIcon()}${formatViews(views)} views this week</p>
      </div>
    </a>`;
  }

  // ---------- homepage: trending section ----------

  function renderHomeTrending() {
    const featuredEl = document.getElementById("trending-featured");
    const gridEl = document.getElementById("trending-grid");
    if (!featuredEl || !gridEl || !POSTS.length) return;

    const sorted = [...POSTS].sort((a, b) => displayViews(b) - displayViews(a));
    const top4 = sorted.slice(0, 4);

    featuredEl.innerHTML = featuredHtml(top4[0]);
    gridEl.innerHTML = top4.slice(1).map((p, i) => cardHtml(p, { rank: i + 2 })).join("");

    [...gridEl.querySelectorAll(".card")].forEach((el) => el.classList.add("in-view"));
  }

  // ---------- individual post pages: related-posts internal links ----------

  function currentSlugFromCanonical() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) return null;
    const match = canonical.href.match(/\/blog\/([^/]+)\.html/);
    return match ? match[1] : null;
  }

  function renderRelatedPosts() {
    const el = document.getElementById("related-posts");
    if (!el || !POSTS.length) return;

    const slug = currentSlugFromCanonical();
    const current = POSTS.find((p) => p.slug === slug);
    const others = POSTS.filter((p) => p.slug !== slug);
    if (!others.length) {
      const section = document.getElementById("related-posts-section");
      if (section) section.style.display = "none";
      return;
    }

    let related = current
      ? others.filter((p) => p.category === current.category)
      : [];

    // Fill up to 3 with the most recent other posts if same-category isn't enough.
    if (related.length < 3) {
      const seen = new Set(related.map((p) => p.slug));
      const fillers = [...others]
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter((p) => !seen.has(p.slug));
      for (const p of fillers) {
        if (related.length >= 3) break;
        related.push(p);
      }
    } else {
      related = [...related].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    }

    el.innerHTML = related.map((p) => cardHtml(p)).join("");
    [...el.querySelectorAll(".card")].forEach((c) => c.classList.add("in-view"));
  }

  // ---------- author page: latest articles by Sheikh Asfi ----------

  function renderAuthorPosts() {
    const el = document.getElementById("author-posts-grid");
    if (!el || !POSTS.length) return;
    const latest = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
    el.innerHTML = latest.map((p) => cardHtml(p)).join("");
    [...el.querySelectorAll(".card")].forEach((c) => c.classList.add("in-view"));
  }

  // ---------- blog listing page: categories + filters + grid ----------

  function initBlogListing() {
    const gridEl = document.getElementById("posts-grid");
    const pillsEl = document.getElementById("category-pills");
    if (!gridEl || !POSTS.length) return;

    const searchEl = document.getElementById("blog-search");
    const categorySelectEl = document.getElementById("filter-category");
    const sortEl = document.getElementById("filter-sort");
    const pageSizeEl = document.getElementById("filter-pagesize");
    const emptyEl = document.getElementById("posts-empty");
    const countEl = document.getElementById("results-count");
    const paginationEl = document.getElementById("pagination");

    const categories = [...new Set(POSTS.map((p) => p.category))].sort();

    const params = new URLSearchParams(window.location.search);
    const allowedPageSizes = [9, 12, 18, 24, 30, 99];
    let requestedPageSize = parseInt(params.get("per"), 10) || DEFAULT_PAGE_SIZE;
    if (!allowedPageSizes.includes(requestedPageSize)) requestedPageSize = DEFAULT_PAGE_SIZE;

    const state = {
      category: params.get("category") || "all",
      q: params.get("q") || "",
      sort: params.get("sort") || "newest",
      perPage: requestedPageSize,
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
    if (pageSizeEl) pageSizeEl.value = String(state.perPage);

    function syncUrl() {
      const p = new URLSearchParams();
      if (state.category !== "all") p.set("category", state.category);
      if (state.q) p.set("q", state.q);
      if (state.sort !== "newest") p.set("sort", state.sort);
      if (state.perPage !== DEFAULT_PAGE_SIZE) p.set("per", state.perPage);
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

      const perPage = state.perPage;
      const totalPages = Math.max(1, Math.ceil(list.length / perPage));
      if (state.page > totalPages) state.page = totalPages;
      const pageList = list.slice((state.page - 1) * perPage, state.page * perPage);

      gridEl.innerHTML = pageList.map((p) => cardHtml(p)).join("");
      [...gridEl.querySelectorAll(".card")].forEach((el) => el.classList.add("in-view"));

      if (emptyEl) emptyEl.style.display = list.length ? "none" : "block";
      if (countEl) {
        const startNum = list.length ? (state.page - 1) * perPage + 1 : 0;
        const endNum = Math.min(state.page * perPage, list.length);
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
    if (pageSizeEl) {
      pageSizeEl.addEventListener("change", () => {
        const n = parseInt(pageSizeEl.value, 10);
        state.perPage = allowedPageSizes.includes(n) ? n : DEFAULT_PAGE_SIZE;
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

  // ---------- homepage: "Desks we cover" tiles ----------

  const DESK_META = {
    technology: { icon: "💻", desc: "AI, apps, and the tools reshaping how we work." },
    business: { icon: "📈", desc: "Markets, moves, and money — plainly explained." },
    science: { icon: "🔬", desc: "What researchers actually found this week." },
    health: { icon: "🩺", desc: "Plain-English explainers you can act on." },
    politics: { icon: "🏛", desc: "Policy and power moves, without the spin." }
  };
  const DEFAULT_DESK_META = { icon: "📰", desc: "The latest dispatches from this desk." };

  function renderDeskGrid() {
    const el = document.getElementById("desk-grid");
    if (!el || !POSTS.length) return;

    const categories = [...new Set(POSTS.map((p) => p.category))].sort();
    el.innerHTML = categories.map((c) => {
      const meta = DESK_META[c.toLowerCase()] || DEFAULT_DESK_META;
      return `<a href="/blog/index.html?category=${c.toLowerCase()}" class="desk-tile">
        <span class="desk-tile__icon">${meta.icon}</span>
        <span class="desk-tile__name">${c}</span>
        <span class="desk-tile__desc">${meta.desc}</span>
      </a>`;
    }).join("");
  }

  // ---------- homepage: auto-counted "stories filed" stat ----------

  function setStoriesStat() {
    const el = document.querySelector('.stat-num[data-dynamic="posts-count"]');
    if (el && POSTS.length) el.setAttribute("data-count", String(POSTS.length));
  }

  function setDesksStat() {
    const el = document.querySelector('.stat-num[data-dynamic="desks-count"]');
    if (!el || !POSTS.length) return;
    const desks = new Set(POSTS.map((p) => p.category));
    el.setAttribute("data-count", String(desks.size));
  }

  // ---------- fetch real cross-visitor view counts, then render ----------

  async function loadRealViewsAndRender() {
    setStoriesStat(); // set before main.js's stat-counter animation reads data-count
    setDesksStat();
    try {
      const res = await fetch("/api/views");
      if (res.ok) REAL_VIEWS = await res.json();
    } catch (e) {
      // API unreachable — displayViews() falls back to local estimate automatically
    }
    renderHomeTrending();
    renderDeskGrid();
    initBlogListing();
    renderRelatedPosts();
    renderAuthorPosts();
  }

  document.addEventListener("DOMContentLoaded", loadRealViewsAndRender);
})();