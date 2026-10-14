/* AsfiBlog Adsterra 300x250 top + native at article/page bottom.
   One of each per page; no article-length or viewport-size restriction.
   Requires existing regional/privacy controls to permit ad requests. */
(function () {
  'use strict';
  if (window.__asfiAdModuleStarted) return;
  window.__asfiAdModuleStarted = true;
  const status = window.ASFIBLOG_AD_DIAGNOSTICS = {
    loaderExecuted:true, enabled:window.ASFIBLOG_ADS_ENABLED === true,
    geoPolicy:null, consent:null, topMounted:false, nativeMounted:false,
    bannerRequested:false, nativeRequested:false, bannerScriptLoaded:false,
    nativeScriptLoaded:false, bannerScriptError:false, nativeScriptError:false
  };
  if (!status.enabled) { status.reason='Ads feature disabled'; return; }
  const CONSENT_KEY='asfiblog_adsterra_choice';
  const NATIVE_ID='bc9ccbb45c50d34c46c04ff7f0cf29f8';
  const BANNER_ID='839c46c0eb2c23e325b33c7a671cf3bf';
  const NATIVE_URL='https://bauval.org/21/' + NATIVE_ID;
  const BANNER_URL='https://bauval.org/22/' + BANNER_ID;
  let rendered=false;
  function preference() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
  }
  function setPreference(value) {
    try { localStorage.setItem(CONSENT_KEY,value); } catch (_) {}
    status.consent=value;
    document.getElementById('asfiblog-ad-consent')?.remove();
    if(value==='accepted') showAds();
    else if(rendered) window.location.reload();
  }
  function addCss() {
    if(document.getElementById('asfiblog-ads-css')) return;
    const st=document.createElement('style'); st.id='asfiblog-ads-css';
    st.textContent=`
      .asfi-ad { position:relative; box-sizing:border-box; clear:both; width:100%; max-width:100%; margin:20px auto 28px; text-align:center; overflow:hidden; isolation:isolate }
      .asfi-ad-label { display:block; font:500 11px/1.5 Arial,sans-serif; letter-spacing:.06em; color:#71717a; margin:0 0 8px; text-transform:uppercase }
      .asfi-ad--top { min-height:278px; }
      .asfi-ad--top .asfi-ad-creative { width:300px; height:250px; margin:auto; max-width:100%; }
      .asfi-ad--bottom { min-height:215px; }
      .asfi-ad--bottom .asfi-ad-creative { width:100%; max-width:100%; overflow-x:auto; overflow-y:hidden; -webkit-overflow-scrolling:touch; }
      @media (max-width:680px) { .asfi-ad { margin:14px auto 18px; } .asfi-ad--bottom { min-height:210px } }
    `;
    document.head.appendChild(st);
  }
  function slot(type) {
    const el=document.createElement('aside');
    el.className='asfi-ad asfi-ad--'+type;
    el.setAttribute('aria-label','Advertisement');
    el.innerHTML='<span class="asfi-ad-label">Advertisement</span><div class="asfi-ad-creative"></div>';
    return el;
  }
  function attachTop(target) {
    if(document.querySelector('.asfi-ad--top')) return;
    const ad=slot('top'); target.after(ad); status.topMounted=true;
    // Exact 300x250 publisher options provided by site owner.
    window.atOptions={key:BANNER_ID,format:'iframe',height:250,width:300,params:{}};
    const scr=document.createElement('script'); scr.async=true; scr.src=BANNER_URL;
    scr.onload=()=>{status.bannerScriptLoaded=true;};
    scr.onerror=()=>{status.bannerScriptError=true;console.warn('[AsfiBlog Ads] Banner network request failed');};
    ad.querySelector('.asfi-ad-creative').appendChild(scr);
    status.bannerRequested=true;
  }
  function attachBottom(main) {
    if(document.querySelector('.asfi-ad--bottom')) return;
    const ad=slot('bottom'); main.appendChild(ad); status.nativeMounted=true;
    const load=()=>{
      if(ad.dataset.loaded==='yes')return;
      ad.dataset.loaded='yes';
      const div=document.createElement('div'); div.id='container-'+NATIVE_ID;
      ad.querySelector('.asfi-ad-creative').appendChild(div);
      const scr=document.createElement('script');
      scr.async=true; scr.setAttribute('data-cfasync','false');scr.src=NATIVE_URL;
      scr.onload=()=>{status.nativeScriptLoaded=true;};
      scr.onerror=()=>{status.nativeScriptError=true;console.warn('[AsfiBlog Ads] Native network request failed');};
      ad.appendChild(scr); status.nativeRequested=true;
    };
    if(!('IntersectionObserver' in window))return load();
    const ob=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)){ob.disconnect();load();}
    }, {rootMargin:'600px 0px'});
    ob.observe(ad);
  }
  function showAds() {
    if(rendered || window.navigator.globalPrivacyControl===true)return;
    const main=document.querySelector('main');
    if(!main){status.reason='Missing main element';return;}
    addCss();
    const article=main.querySelector('article.post');
    const heading=article?.querySelector('h1')||main.querySelector('h1');
    const hero=heading?.closest('.hero');
    const target=hero||heading||main.firstElementChild;
    if(!target){status.reason='Missing top insertion target';return;}
    rendered=true;
    attachTop(target);
    attachBottom(main);
  }
  function consentPrompt() {
    if(document.getElementById('asfiblog-ad-consent'))return;
    const notice=document.createElement('aside');
    notice.className='cookie-consent'; notice.id='asfiblog-ad-consent';notice.setAttribute('aria-label','Advertising consent');
    notice.innerHTML='<div><strong>Advertising choice</strong><p>Advertising may use cookies and device data. Allow sponsored ads on this site? You can read without accepting. <a href="/privacy-policy.html">Privacy policy</a>.</p></div><div class="cookie-consent__actions"><button type="button" data-asfi-ad="rejected">No thanks</button><button type="button" data-asfi-ad="accepted">Allow ads</button></div>';
    notice.addEventListener('click',event=>{
      const btn=event.target.closest('[data-asfi-ad]');
      if(btn)setPreference(btn.dataset.asfiAd);
    });
    document.body.appendChild(notice);
  }
  async function start(){
    const btn=document.querySelector('[data-reopen-ad-consent]');
    if(btn){btn.hidden=false;btn.addEventListener('click',consentPrompt);}
    if(window.navigator.globalPrivacyControl===true){status.reason='Global Privacy Control opt-out';return;}
    const pref=preference();status.consent=pref;
    if(pref==='rejected'){status.reason='Visitor declined advertising';return;}
    let policy='consent-required';
    try {
      const r=await fetch('/api/ad-eligibility',{credentials:'same-origin',cache:'no-store'});
      if(r.ok){const data=await r.json();if(data && data.policy==='auto')policy='auto';}
    }catch(e){status.reason='Country policy endpoint unavailable';}
    status.geoPolicy=policy;
    if(policy==='auto'||pref==='accepted')showAds();
    else if(pref===null){
      if(document.getElementById('cookie-consent')){
        const afterChoice=e=>{
          if(e.target.closest('[data-consent]')){
            document.removeEventListener('click',afterChoice);
            setTimeout(consentPrompt,75);
          }
        };
        document.addEventListener('click',afterChoice);
      }else consentPrompt();
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
