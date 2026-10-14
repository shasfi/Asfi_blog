/* AsfiBlog: one 300x250 display near top + one native unit near bottom.
   No article-length or viewport-size restriction. Third-party requests gated by
   country response + visitor preferences. Does not authorize tracking without
   required consent. */
(function () {
  'use strict';
  if (window.ASFIBLOG_ADS_ENABLED !== true) return;
  const CONSENT_KEY = 'asfiblog_adsterra_choice';
  const NATIVE_ID = 'bc9ccbb45c50d34c46c04ff7f0cf29f8';
  const BANNER_ID = '839c46c0eb2c23e325b33c7a671cf3bf';
  const NATIVE_URL = 'https://bauval.org/21/' + NATIVE_ID;
  const BANNER_URL = 'https://bauval.org/22/' + BANNER_ID;
  let rendered = false;

  function preference() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
  }
  function setPreference(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
    document.getElementById('asfiblog-ad-consent')?.remove();
    if (value === 'accepted') showAds();
    else if (rendered) window.location.reload();
  }
  function addCss() {
    if (document.getElementById('asfiblog-ads-css')) return;
    const st = document.createElement('style');
    st.id = 'asfiblog-ads-css';
    st.textContent = `
      .asfi-ad { position:relative; box-sizing:border-box; clear:both; width:100%; max-width:100%; margin:22px auto 30px; text-align:center; overflow:hidden; isolation:isolate; }
      .asfi-ad-label { display:block; font:500 10px/1.4 Arial,sans-serif; letter-spacing:.08em; color:var(--ink-faint,#6b7280); margin:0 0 8px; text-transform:uppercase; }
      .asfi-ad--top { min-height:275px; }
      .asfi-ad--top .asfi-ad-creative { width:300px; height:250px; max-width:100%; margin:0 auto; }
      .asfi-ad--bottom { min-height:215px; }
      .asfi-ad--bottom .asfi-ad-creative { width:100%; max-width:100%; overflow-x:auto; overflow-y:hidden; -webkit-overflow-scrolling:touch; }
      .asfi-ad--bottom .asfi-ad-creative > div { max-width:100%; }
      @media(max-width:680px){ .asfi-ad{margin:16px auto 22px;} .asfi-ad--bottom{min-height:230px;} }
    `;
    document.head.appendChild(st);
  }
  function slot(type) {
    const el = document.createElement('aside');
    el.className = `asfi-ad asfi-ad--${type}`;
    el.setAttribute('aria-label', 'Advertisement');
    el.innerHTML = '<span class="asfi-ad-label">Advertisement</span><div class="asfi-ad-creative"></div>';
    return el;
  }
  function attachTop(target) {
    const ad = slot('top');
    target.after(ad);
    // Exact Adsterra 300 x 250 tag: atOptions must precede the script.
    window.atOptions = { key: BANNER_ID, format:'iframe', height:250, width:300, params:{} };
    const scr = document.createElement('script');
    scr.src = BANNER_URL;
    scr.async = true;
    ad.querySelector('.asfi-ad-creative').appendChild(scr);
  }
  function attachBottom(main) {
    const ad = slot('bottom');
    main.appendChild(ad);
    const load = () => {
      if (ad.dataset.loaded === 'yes') return;
      ad.dataset.loaded = 'yes';
      const container = document.createElement('div');
      container.id = 'container-' + NATIVE_ID;
      ad.querySelector('.asfi-ad-creative').appendChild(container);
      const scr = document.createElement('script');
      scr.async = true;
      scr.setAttribute('data-cfasync', 'false');
      scr.src = NATIVE_URL;
      ad.appendChild(scr);
    };
    if (!('IntersectionObserver' in window)) return load();
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e=>e.isIntersecting)) { observer.disconnect(); load(); }
    }, {rootMargin:'600px 0px'});
    observer.observe(ad);
  }
  function showAds() {
    if (rendered || window.navigator.globalPrivacyControl === true) return;
    const main = document.querySelector('main');
    if (!main) return;
    rendered = true;
    addCss();
    const article = main.querySelector('article.post');
    const heading = article?.querySelector('h1') || main.querySelector('h1');
    if (heading) {
      // On home / archive: avoid inserting a fixed-width creative inside hero grid.
      const hero = heading.closest('.hero');
      attachTop(hero || heading);
    } else {
      const target = main.firstElementChild;
      if (target) attachTop(target);
    }
    // The 4:1 native block exists on mobile as well as desktop, once per page.
    attachBottom(main);
  }
  function consentPrompt() {
    if (document.getElementById('asfiblog-ad-consent')) return;
    const notice = document.createElement('aside');
    notice.className = 'cookie-consent';
    notice.id = 'asfiblog-ad-consent';
    notice.setAttribute('aria-label', 'Advertising consent');
    notice.innerHTML = '<div><strong>Advertising choice</strong><p>Adsterra may use cookies and device data. Allow sponsored ads on this site? You can continue reading without accepting. <a href="/privacy-policy.html">Privacy policy</a>.</p></div><div class="cookie-consent__actions"><button type="button" data-asfi-ad="rejected">No thanks</button><button type="button" data-asfi-ad="accepted">Allow ads</button></div>';
    notice.addEventListener('click', event => {
      const button = event.target.closest('[data-asfi-ad]');
      if (button) setPreference(button.dataset.asfiAd);
    });
    document.body.appendChild(notice);
  }
  async function start() {
    const btn = document.querySelector('[data-reopen-ad-consent]');
    if (btn) {
      btn.hidden = false;
      btn.addEventListener('click', () => consentPrompt());
    }
    if (window.navigator.globalPrivacyControl === true) return;
    if (preference() === 'rejected') return;
    let policy = 'consent-required';
    try {
      const response = await fetch('/api/ad-eligibility', { credentials:'same-origin', cache:'no-store' });
      if (response.ok) {
        const result = await response.json();
        if (result && result.policy === 'auto') policy = 'auto';
      }
    } catch (_) { /* If geo check fails, do not load third-party tracking by default. */ }
    if (policy === 'auto' || preference() === 'accepted') showAds();
    else if (preference() === null) {
      // Only visitors in restricted/unknown regions see the necessary consent choice.
      // Wait until the existing analytics cookie prompt has closed.
      if (document.getElementById('cookie-consent')) {
        const onClick = event => {
          if (event.target.closest('[data-consent]')) {
            document.removeEventListener('click', onClick);
            setTimeout(consentPrompt, 75);
          }
        };
        document.addEventListener('click', onClick);
      } else consentPrompt();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
