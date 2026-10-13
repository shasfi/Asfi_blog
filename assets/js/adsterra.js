// AsfiBlog Adsterra integration. The shared main.js loads this file ONLY
// after the publisher explicitly enables ADS_ENABLED in main.js.
// Each ad script is injected ONLY after a reader opts in to advertising.
(function () {
  'use strict';
  if (window.ASFIBLOG_ADS_ENABLED !== true) return;

  const CONSENT_KEY = 'asfiblog_adsterra_choice';
  const NATIVE_ID = 'bc9ccbb45c50d34c46c04ff7f0cf29f8';
  const BANNER_KEY = '839c46c0eb2c23e325b33c7a671cf3bf';
  const NATIVE_URL = 'https://bauval.org/21/' + NATIVE_ID;
  const BANNER_URL = 'https://bauval.org/22/' + BANNER_KEY;
  let launched = false;

  function getChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
  }
  function setChoice(choice) {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch (_) {}
    document.getElementById('asfiblog-ad-consent')?.remove();
    if (choice === 'accepted') initializeAds();
    // Scripts already loaded in this page cannot be undone by hiding the slot.
    if (choice === 'rejected' && launched) window.location.reload();
  }

  function showConsent(force) {
    if (!force && getChoice() !== null) return;
    if (document.getElementById('cookie-consent') || document.getElementById('asfiblog-ad-consent')) return;
    const notice = document.createElement('aside');
    notice.id = 'asfiblog-ad-consent';
    notice.className = 'cookie-consent';
    notice.setAttribute('aria-label', 'Advertising preferences');
    notice.innerHTML = '<div><strong>Optional sponsored advertising</strong><p>Allow AsfiBlog to load third-party Adsterra banners? The advertising service may use cookies and device information. Declining will not limit article access. <a href="/privacy-policy.html">Privacy policy</a>.</p></div><div class="cookie-consent__actions"><button type="button" data-ad-choice="rejected">Decline ads</button><button type="button" data-ad-choice="accepted">Allow ads</button></div>';
    notice.addEventListener('click', (event) => {
      const button = event.target.closest('[data-ad-choice]');
      if (button) setChoice(button.dataset.adChoice);
    });
    document.body.appendChild(notice);
  }

  function scheduleConsent() {
    if (getChoice() !== null) return;
    if (document.getElementById('cookie-consent')) return;
    showConsent(false);
  }

  function addStyles() {
    if (document.getElementById('asfiblog-ad-styles')) return;
    const sheet = document.createElement('style');
    sheet.id = 'asfiblog-ad-styles';
    sheet.textContent = '.asfiblog-ad{clear:both;position:relative;margin:30px auto;max-width:100%;text-align:center;isolation:isolate}.asfiblog-ad__label{display:block;font:500 10px/1.5 Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:var(--ink-faint,#6b7280);margin:0 0 10px}.asfiblog-ad--display{width:300px;max-width:100%;min-height:275px}.asfiblog-ad--display .asfiblog-ad__creative{width:300px;height:250px;max-width:100%;margin:0 auto;overflow:hidden}.asfiblog-ad--native{min-height:170px}.asfiblog-ad__creative{display:block}@media(max-width:680px){.asfiblog-ad--native{display:none}}';
    document.head.appendChild(sheet);
  }

  function makeSlot(type) {
    const aside = document.createElement('aside');
    aside.className = 'asfiblog-ad asfiblog-ad--' + type;
    aside.setAttribute('aria-label', 'Advertisement');
    aside.innerHTML = '<span class="asfiblog-ad__label">Advertisement</span><div class="asfiblog-ad__creative"></div>';
    return aside;
  }

  function runNearViewport(target, callback) {
    if (!('IntersectionObserver' in window)) { callback(); return; }
    const watcher = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { watcher.disconnect(); callback(); }
    }, { rootMargin: '250px 0px' });
    watcher.observe(target);
  }

  function nativeSlot(anchor, after) {
    if (!anchor || document.getElementById('container-' + NATIVE_ID)) return;
    if (window.matchMedia && window.matchMedia('(max-width: 680px)').matches) return;
    const slot = makeSlot('native');
    after ? anchor.after(slot) : anchor.appendChild(slot);
    runNearViewport(slot, () => {
      if (getChoice() !== 'accepted') return;
      const div = document.createElement('div');
      div.id = 'container-' + NATIVE_ID;
      slot.querySelector('.asfiblog-ad__creative').appendChild(div);
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = NATIVE_URL;
      slot.appendChild(script);
    });
  }

  function displaySlot(after) {
    if (!after || document.querySelector('.asfiblog-ad--display')) return;
    const slot = makeSlot('display');
    after.after(slot);
    runNearViewport(slot, () => {
      if (getChoice() !== 'accepted') return;
      // Mirrors the exact 300x250 banner options supplied by the publisher.
      window.atOptions = { key: BANNER_KEY, format: 'iframe', height: 250, width: 300, params: {} };
      const script = document.createElement('script');
      script.async = true;
      script.src = BANNER_URL;
      slot.querySelector('.asfiblog-ad__creative').appendChild(script);
    });
  }

  function initializeAds() {
    if (launched || getChoice() !== 'accepted') return;
    launched = true;
    addStyles();
    const post = document.querySelector('article.post');
    if (post) {
      const content = post.querySelector('.content');
      if (!content) return;
      const words = (content.textContent || '').trim().split(/\s+/).filter(Boolean).length;
      const headline = (post.querySelector('h1')?.textContent || '').toLowerCase();
      // Conservative brand-safety check: skip ad placement on potentially tragic or graphic news.
      if (/\b(killed|murder|suicide|rape|assassinat|dead|death|fatal|terror|abuse)\b/.test(headline)) return;
      const paragraphs = Array.from(content.querySelectorAll('p'));
      if (words >= 800 && paragraphs.length >= 4) displaySlot(paragraphs[3]);
      if (words >= 1300) nativeSlot(post.querySelector('.faq') || post.querySelector('.tags') || content, true);
      return;
    }
    // Exactly one native block per listing page; no repeated ads between each card.
    const homeGrid = document.getElementById('trending-grid');
    if (homeGrid) {
      nativeSlot(homeGrid.closest('section') || homeGrid, true);
      return;
    }
    const archiveGrid = document.getElementById('posts-grid');
    if (archiveGrid) nativeSlot(archiveGrid, true);
  }

  function ready() {
    const preferenceButton = document.querySelector('[data-reopen-ad-consent]');
    if (preferenceButton) preferenceButton.hidden = false;
    if (getChoice() === 'accepted') initializeAds();
    else scheduleConsent();
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-reopen-ad-consent]')) {
        try { localStorage.removeItem(CONSENT_KEY); } catch (_) {}
        showConsent(true);
      } else if (event.target.closest('[data-consent]')) {
        // The existing analytics notice is dismissed before this is checked.
        setTimeout(scheduleConsent, 50);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
