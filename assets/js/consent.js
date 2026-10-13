// Consent Mode: opt-in analytics. No ad code is loaded without an AdSense account.
(function () {
  function stored() { try { return localStorage.getItem('asfiblog_cookie_choice'); } catch (_) { return null; } }
  function setChoice(value) {
    try { localStorage.setItem('asfiblog_cookie_choice', value); } catch (_) {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {analytics_storage: value === 'accepted' ? 'granted' : 'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    }
    document.getElementById('cookie-consent')?.remove();
  }
  function show() {
    if (stored() === 'accepted' || stored() === 'rejected' || document.getElementById('cookie-consent')) return;
    var notice = document.createElement('aside');
    notice.id='cookie-consent'; notice.className='cookie-consent'; notice.setAttribute('aria-label','Cookie preferences');
    notice.innerHTML='<div><strong>Analytics preferences</strong><p>We use optional Google Analytics cookies to learn which articles readers find useful. You can accept or decline. Read our <a href="/privacy-policy.html">Privacy Policy</a>.</p></div><div class="cookie-consent__actions"><button type="button" data-consent="rejected">Decline</button><button type="button" data-consent="accepted">Accept analytics</button></div>';
    notice.addEventListener('click', function(e) { var choice = e.target.closest('[data-consent]'); if (choice) setChoice(choice.dataset.consent); });
    document.body.appendChild(notice);
  }
  document.addEventListener('DOMContentLoaded', show);
  document.addEventListener('click', function(e){ if (e.target.closest('[data-reopen-consent]')) { try{localStorage.removeItem('asfiblog_cookie_choice')}catch(_){} show(); } });
})();
