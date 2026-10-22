/* AsfiBlog Adsterra loader: every page, no consent gate.
   Formats: popunder, social bar, 300x250 (top), 160x600 side rails (wide screens),
   160x300 in-content, native (bottom), labeled Smartlink "Sponsored" cards.
   Loaded by assets/js/main.js on all pages. */
(function () {
  'use strict';
  if (window.__asfiAdModuleStarted) return;
  window.__asfiAdModuleStarted = true;

  var status = window.ASFIBLOG_AD_DIAGNOSTICS = { loaderExecuted: true, mounted: [], errors: [] };

  /* ---------- Your ad codes ---------- */
  var POPUNDER_URL  = 'https://abscloud.org/1/2331c8030b98d30ab8f6acad9e3675f7';
  var SOCIALBAR_URL = 'https://bauval.org/14/7fabb09521bcb8724dd6a108ccafa203';
  var SMARTLINKS = [
    'https://asiafilm.org/4/a8e7cc210936ed7df47cbd7395a9e5b5',
    'https://asiafilm.org/4/34b4379834c2731074a0284a506fa792',
    'https://araplhn.org/4/89c5efebab2f544d321c40c2b3627f28'
  ];
  var B300x250 = { key: '839c46c0eb2c23e325b33c7a671cf3bf', w: 300, h: 250 };   // existing
  var B160x300 = { key: 'cbbf57bc2c86b1c2220f5b2417c34c81', w: 160, h: 300 };
  var B160x600 = { key: 'cd7558a76256e477b9bb8a92cc0d4612', w: 160, h: 600 };
  var NATIVE_ID  = 'bc9ccbb45c50d34c46c04ff7f0cf29f8';                           // existing
  var NATIVE_URL = 'https://bauval.org/21/' + NATIVE_ID;

  /* ---------- helpers ---------- */
  function bannerUrl(b) { return 'https://bauval.org/22/' + b.key; }

  function addCss() {
    if (document.getElementById('asfiblog-ads-css')) return;
    var st = document.createElement('style');
    st.id = 'asfiblog-ads-css';
    st.textContent =
      '.asfi-ad{position:relative;box-sizing:border-box;clear:both;width:100%;max-width:100%;margin:22px auto;text-align:center;overflow:hidden;isolation:isolate}' +
      '.asfi-ad-label{display:block;font:500 11px/1.5 Arial,sans-serif;letter-spacing:.06em;color:#71717a;margin:0 0 6px;text-transform:uppercase}' +
      '.asfi-ad-creative{margin:0 auto;max-width:100%;overflow:hidden}' +
      '.asfi-ad--300x250{min-height:278px}.asfi-ad--300x250 .asfi-ad-creative{width:300px;height:250px}' +
      '.asfi-ad--160x300{min-height:328px}.asfi-ad--160x300 .asfi-ad-creative{width:160px;height:300px}' +
      '.asfi-ad--native{min-height:215px}.asfi-ad--native .asfi-ad-creative{width:100%;overflow-x:auto}' +
      '.asfi-rail{display:none;position:fixed;top:90px;width:160px;z-index:20}' +
      '.asfi-rail--l{left:max(8px,calc((100vw - 1120px)/2 - 176px))}' +
      '.asfi-rail--r{right:max(8px,calc((100vw - 1120px)/2 - 176px))}' +
      '.asfi-rail .asfi-ad{margin:0}.asfi-rail .asfi-ad--160x600{min-height:628px}.asfi-rail .asfi-ad-creative{width:160px;height:600px}' +
      '@media (min-width:1480px){.asfi-rail{display:block}}' +
      '.asfi-sponsored{display:block;box-sizing:border-box;max-width:680px;margin:24px auto;padding:14px 18px;border:1px solid rgba(128,128,128,.35);border-radius:10px;text-align:left;text-decoration:none;color:inherit}' +
      '.asfi-sponsored:hover{border-color:#2563eb}' +
      '.asfi-sponsored small{display:block;font:500 11px/1.4 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#71717a;margin-bottom:4px}' +
      '.asfi-sponsored strong{display:block;font-size:16px;line-height:1.4}' +
      '@media (max-width:680px){.asfi-ad{margin:16px auto}}';
    document.head.appendChild(st);
  }

  function box(type, labelText) {
    var el = document.createElement('aside');
    el.className = 'asfi-ad asfi-ad--' + type;
    el.setAttribute('aria-label', 'Advertisement');
    el.innerHTML = '<span class="asfi-ad-label">' + (labelText || 'Advertisement') + '</span><div class="asfi-ad-creative"></div>';
    return el;
  }

  /* Banner scripts read a global `atOptions` when they execute, so banners are
     loaded strictly one after another (queue) to stop them overwriting each other. */
  var queue = [], running = false;
  function enqueueBanner(container, b) { queue.push({ c: container, b: b }); if (!running) next(); }
  function next() {
    var job = queue.shift();
    if (!job) { running = false; return; }
    running = true;
    var done = false;
    function finish(err) {
      if (done) return; done = true;
      if (err) status.errors.push('banner ' + job.b.w + 'x' + job.b.h);
      setTimeout(next, 50);
    }
    window.atOptions = { key: job.b.key, format: 'iframe', height: job.b.h, width: job.b.w, params: {} };
    var s = document.createElement('script');
    s.src = bannerUrl(job.b);
    s.onload = function () { finish(false); };
    s.onerror = function () { finish(true); };
    job.c.appendChild(s);
    setTimeout(function () { finish(false); }, 4000);
  }

  // Load a banner when it's about to scroll into view (still counts early enough to be seen).
  function lazyBanner(adEl, b) {
    var c = adEl.querySelector('.asfi-ad-creative');
    var go = function () { if (adEl.dataset.loaded) return; adEl.dataset.loaded = '1'; enqueueBanner(c, b); };
    if (!('IntersectionObserver' in window)) return go();
    var ob = new IntersectionObserver(function (e) {
      if (e.some(function (x) { return x.isIntersecting; })) { ob.disconnect(); go(); }
    }, { rootMargin: '500px 0px' });
    ob.observe(adEl);
  }

  function mountBanner(parent, ref, b, where) {
    var ad = box(b.w + 'x' + b.h);
    if (where === 'after') ref.after(ad); else if (where === 'before') ref.before(ad); else parent.appendChild(ad);
    lazyBanner(ad, b);
    status.mounted.push(b.w + 'x' + b.h);
    return ad;
  }

  function mountNative(main) {
    var ad = box('native', 'Sponsored');
    main.appendChild(ad);
    var load = function () {
      if (ad.dataset.loaded) return; ad.dataset.loaded = '1';
      var d = document.createElement('div'); d.id = 'container-' + NATIVE_ID;
      ad.querySelector('.asfi-ad-creative').appendChild(d);
      var s = document.createElement('script');
      s.async = true; s.setAttribute('data-cfasync', 'false'); s.src = NATIVE_URL;
      ad.appendChild(s);
    };
    if (!('IntersectionObserver' in window)) load();
    else { var ob = new IntersectionObserver(function (e) { if (e.some(function (x) { return x.isIntersecting; })) { ob.disconnect(); load(); } }, { rootMargin: '600px 0px' }); ob.observe(ad); }
    status.mounted.push('native');
  }

  function sponsoredLink(url, headline) {
    var a = document.createElement('a');
    a.className = 'asfi-sponsored';
    a.href = url; a.target = '_blank'; a.rel = 'sponsored noopener nofollow';
    a.innerHTML = '<small>Sponsored</small><strong>' + headline + '</strong>';
    status.mounted.push('smartlink');
    return a;
  }

  function injectScript(url) {
    var s = document.createElement('script');
    s.async = true; s.setAttribute('data-cfasync', 'false'); s.src = url;
    s.onerror = function () { status.errors.push(url); };
    (document.body || document.head).appendChild(s);
  }

  /* ---------- placement ---------- */
  function start() {
    var main = document.querySelector('main');
    if (!main) { status.reason = 'no <main>'; return; }
    addCss();

    // 1) Popunder + Social Bar on every page
    injectScript(POPUNDER_URL);
    injectScript(SOCIALBAR_URL);

    var article = main.querySelector('article.post');
    var content = article && article.querySelector('.content');
    var heading = (article && article.querySelector('h1')) || main.querySelector('h1');
    var hero = heading && heading.closest('.hero');
    var topTarget = hero || (article && (article.querySelector('.post-figure--hero') || article.querySelector('.timestamp'))) || heading || main.firstElementChild;

    // 2) Top 300x250 (highest viewability, loads immediately)
    if (topTarget) {
      var top = box('300x250');
      topTarget.after(top);
      var tc = top.querySelector('.asfi-ad-creative');
      enqueueBanner(tc, B300x250);
      status.mounted.push('300x250-top');
    } else {
      mountBanner(main, null, B300x250, 'append');
    }

    // 3) 160x600 sticky side rails on wide screens (always in view while scrolling)
    if (window.matchMedia && window.matchMedia('(min-width:1480px)').matches) {
      ['l', 'r'].forEach(function (side) {
        var rail = document.createElement('div');
        rail.className = 'asfi-rail asfi-rail--' + side;
        var ad = box('160x600');
        rail.appendChild(ad);
        document.body.appendChild(rail);
        enqueueBanner(ad.querySelector('.asfi-ad-creative'), B160x600);
        status.mounted.push('160x600-' + side);
      });
    }

    if (content) {
      // Article page: spread ads between paragraphs
      var paras = Array.prototype.filter.call(content.children, function (n) { return n.tagName === 'P'; });
      var pick = function (frac) { return paras[Math.min(paras.length - 1, Math.max(1, Math.floor(paras.length * frac)))]; };
      if (paras.length >= 4) {
        var p1 = pick(0.25), p2 = pick(0.5), p3 = pick(0.75);
        mountBanner(null, p1, B160x300, 'after');
        if (p2 !== p1) p2.after(sponsoredLink(SMARTLINKS[0], 'Trending now: popular picks readers are opening today'));
        if (p3 !== p2 && p3 !== p1) mountBanner(null, p3, B160x300, 'after');
      } else {
        mountBanner(null, content, B160x300, 'after');
      }
      var faq = article.querySelector('.faq');
      var tags = article.querySelector('.tags');
      var smartRef = faq || tags || content;
      smartRef.after(sponsoredLink(SMARTLINKS[1], 'Sponsored: more recommended reads'));
    } else {
      // Home / listing / info pages
      var sections = main.querySelectorAll(':scope > section, :scope > .wrap > section');
      var mid = sections[Math.floor(sections.length / 2)];
      if (mid) mountBanner(null, mid, B160x300, 'after');
      else mountBanner(main, null, B160x300, 'append');
      var firstSec = sections[0];
      if (firstSec) firstSec.after(sponsoredLink(SMARTLINKS[1], 'Sponsored: more recommended reads'));
    }

    // 4) Native at the very bottom, plus a Smartlink just above the footer
    mountNative(main);
    main.appendChild(sponsoredLink(SMARTLINKS[2], 'Sponsored: see what else is trending'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
