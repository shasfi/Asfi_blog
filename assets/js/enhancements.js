// assets/js/enhancements.js
// Auto-injects on blog articles: visible breadcrumb, reading time badge,
// related posts (3), and a simple Table of Contents for long articles.
(function(){
  var path = location.pathname;
  var isArticle = /^\/blog\/[^/]+\.html$/.test(path) && !/\/blog\/index\.html$/.test(path);
  if(!isArticle) return;

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function(){
    var slug = path.replace('/blog/','').replace('.html','');
    var posts = window.ASFIBLOG_POSTS || [];
    var current = posts.find(function(p){return p.slug===slug;}) || {};
    var main = document.querySelector('main') || document.body;
    var h1 = document.querySelector('h1');

    // ---- Breadcrumb (visible + matches JSON-LD)
    if(h1 && !document.getElementById('crumbs')){
      var bc = document.createElement('nav');
      bc.id = 'crumbs';
      bc.setAttribute('aria-label','Breadcrumb');
      bc.style.cssText = 'font-size:13px;color:var(--ink-soft,#666);margin:16px 0 8px;';
      bc.innerHTML = '<a href="/" style="color:inherit;text-decoration:none;">Home</a> <span aria-hidden="true">›</span> ' +
                     '<a href="/blog/index.html" style="color:inherit;text-decoration:none;">Blog</a> <span aria-hidden="true">›</span> ' +
                     '<span style="color:var(--ink,#111);">' + (h1.textContent || '') + '</span>';
      h1.parentNode.insertBefore(bc, h1);
    }

    // ---- Reading time badge
    var article = document.querySelector('article') || main;
    if(article && !document.getElementById('read-time')){
      var words = (article.innerText || '').trim().split(/\s+/).length;
      var mins = current.readMins || Math.max(1, Math.round(words/220));
      var badge = document.createElement('div');
      badge.id = 'read-time';
      badge.style.cssText = 'display:inline-flex;gap:8px;align-items:center;font-size:13px;color:var(--ink-soft,#666);margin:4px 0 16px;';
      badge.innerHTML = '⏱ ' + mins + ' min read' +
                        (current.category ? ' · <span style="text-transform:uppercase;letter-spacing:.06em;">' + current.category + '</span>' : '');
      if(h1 && h1.nextSibling) h1.parentNode.insertBefore(badge, h1.nextSibling);
    }

    // ---- Table of Contents (only if article has 3+ h2)
    var h2s = article ? article.querySelectorAll('h2') : [];
    if(h2s.length >= 3 && !document.getElementById('toc')){
      var toc = document.createElement('aside');
      toc.id = 'toc';
      toc.style.cssText = 'border:1px solid var(--line,#eee);border-radius:12px;padding:16px 20px;margin:24px 0;background:var(--surface,#fafafa);';
      var html = '<div style="font-weight:600;margin-bottom:8px;font-size:14px;letter-spacing:.02em;">On this page</div><ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;">';
      h2s.forEach(function(h,i){
        var id = h.id || ('sec-'+i);
        h.id = id;
        html += '<li><a href="#'+id+'" style="color:inherit;text-decoration:none;">'+ (h.textContent||'') +'</a></li>';
      });
      html += '</ol>';
      toc.innerHTML = html;
      if(h2s[0] && h2s[0].parentNode) h2s[0].parentNode.insertBefore(toc, h2s[0]);
    }

    // ---- Related posts (same category first, then latest)
    if(posts.length && !document.getElementById('related')){
      var pool = posts.filter(function(p){return p.slug!==slug;});
      var same = current.category ? pool.filter(function(p){return p.category===current.category;}) : [];
      var others = pool.filter(function(p){return !same.includes(p);});
      var picks = same.concat(others).slice(0,3);
      if(picks.length){
        var wrap = document.createElement('section');
        wrap.id = 'related';
        wrap.style.cssText = 'margin:56px 0 24px;';
        var cards = picks.map(function(p){
          return '<a href="/blog/'+p.slug+'.html" style="display:block;border:1px solid var(--line,#eee);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;background:var(--card,#fff);transition:transform .15s;">'+
            '<img src="'+p.image+'" alt="'+ (p.title||'').replace(/"/g,'&quot;') +'" loading="lazy" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;" />'+
            '<div style="padding:14px 16px;"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft,#888);margin-bottom:6px;">'+(p.category||'')+'</div>'+
            '<div style="font-weight:600;font-size:15px;line-height:1.35;">'+ (p.title||'') +'</div></div></a>';
        }).join('');
        wrap.innerHTML = '<h2 style="font-size:20px;margin:0 0 16px;">Related dispatches</h2>'+
                         '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">'+cards+'</div>';
        // append near end of article/main
        var target = article || main;
        target.appendChild(wrap);
      }
    }
  });
})();
