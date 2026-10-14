#!/usr/bin/env python3
"""Minimal, idempotent AsfiBlog Adsterra integration repair. Does not replace articles."""
from pathlib import Path
import argparse, re, sys, shutil

HERE = Path(__file__).resolve().parent
MARK = '// ASFI_ADSTERRA_LOADER_REPAIR_2026_10_14'
BOOTSTRAP = r'''
// ASFI_ADSTERRA_LOADER_REPAIR_2026_10_14
// Use only on hosting that permits commercial ads, with appropriate privacy setup.
// This is the missing link: load the existing shared ad code from every page's main.js.
(function () {
  if (window.__asfiAdBootstrapInstalled) return;
  window.__asfiAdBootstrapInstalled = true;
  window.ASFIBLOG_ADS_ENABLED = true;
  window.ASFIBLOG_AD_BOOTSTRAP = { initialized: false, scriptUrl: '/assets/js/adsterra.js' };
  function connectAdsterra() {
    if (window.ASFIBLOG_ADS_ENABLED !== true) return;
    if (document.querySelector('script[src="/assets/js/adsterra.js"]')) {
      window.ASFIBLOG_AD_BOOTSTRAP.initialized = true;
      return;
    }
    var script = document.createElement('script');
    script.src = '/assets/js/adsterra.js';
    script.async = true;
    script.onerror = function () {
      window.ASFIBLOG_AD_BOOTSTRAP.error = 'Unable to load /assets/js/adsterra.js';
      console.error('[AsfiBlog Ads] Failed to load adsterra.js');
    };
    document.head.appendChild(script);
    window.ASFIBLOG_AD_BOOTSTRAP.initialized = true;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectAdsterra, { once: true });
  } else connectAdsterra();
})();
'''

def build(project: Path):
    main = project / 'assets/js/main.js'
    article_folder = project / 'blog'
    home = project / 'index.html'
    if not (main.is_file() and home.is_file() and article_folder.is_dir()):
        raise ValueError('Not an AsfiBlog project: expected assets/js/main.js, index.html, blog/')
    before = main.read_text(encoding='utf-8')
    if 'main.js' not in before[:150]:
        raise ValueError('Unexpected main.js; refusing blind patch')
    if MARK in before:
        revised = before
    else:
        revised = before.rstrip() + '\n' + BOOTSTRAP
    existing_ad = project/'assets/js/adsterra.js'
    if existing_ad.exists():
        body = existing_ad.read_text(encoding='utf-8')
        if not ('asfiblog_adsterra_choice' in body and 'bc9ccbb45c50d34c46c04ff7f0cf29f8' in body):
            raise ValueError('Existing adsterra.js is unfamiliar; not overwriting it without review')
    result = {main:revised,
              existing_ad:(HERE/'assets/js/adsterra.js').read_text(encoding='utf-8')}
    eligibility = project/'api/ad-eligibility.js'
    if not eligibility.exists():
        result[eligibility] = (HERE/'api/ad-eligibility.js').read_text(encoding='utf-8')
    # 404 sometimes lacks shared main.js; do not assume all templates load it.
    notfound = project/'404.html'
    if notfound.exists():
        text = notfound.read_text(encoding='utf-8')
        if '/assets/js/main.js' not in text:
            if '</head>' not in text: raise ValueError('404.html has no </head>')
            result[notfound] = text.replace('</head>', '<script src="/assets/js/main.js" defer></script>\n</head>', 1)
    return result

def run():
    p=argparse.ArgumentParser()
    p.add_argument('--project', required=True)
    p.add_argument('--apply', action='store_true')
    args=p.parse_args()
    project=Path(args.project).expanduser().resolve()
    try: changes=build(project)
    except (OSError,ValueError) as e: sys.exit('Preflight FAILED: '+str(e))
    changes={k:v for k,v in changes.items() if not k.exists() or k.read_text(encoding='utf-8') != v}
    print('Preflight OK:')
    for k in changes: print(' '+str(k.relative_to(project)))
    if not changes: print('No changes needed (patch already installed).')
    if not args.apply:
        print('Dry run only. Run with --apply after confirming commercial hosting is allowed.')
        return
    for k,v in changes.items():
        if k.exists():
            backup=project.parent/(project.name+'_before_adsterra_loader_fix')/k.relative_to(project)
            backup.parent.mkdir(parents=True, exist_ok=True)
            if not backup.exists(): shutil.copy2(k,backup)
        k.parent.mkdir(parents=True,exist_ok=True)
        k.write_text(v, encoding='utf-8')
    print('APPLIED. Existing article files and generator untouched. Verify before pushing.')

if __name__=='__main__':run()
