#!/usr/bin/env python3
"""Apply all-page responsive ad patch safely without overwriting articles."""
from pathlib import Path
import argparse
import shutil
import sys
import re

HERE = Path(__file__).resolve().parent
MARK = '// ASFI_ADSTERRA_SETUP_2026_10_14'
ACTIVATE = '''// ASFI_ADSTERRA_SETUP_2026_10_14
// IMPORTANT: Commercial ads require a commercial-permitted hosting plan.
window.ASFIBLOG_ADS_ENABLED = true;
if (window.ASFIBLOG_ADS_ENABLED === true) {
  const loadAsfiAds = () => {
    if (document.querySelector('script[src="/assets/js/adsterra.js"]')) return;
    const loader = document.createElement('script');
    loader.src = '/assets/js/adsterra.js';
    loader.async = true;
    document.head.appendChild(loader);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadAsfiAds);
  else loadAsfiAds();
}
'''
PRIVACY_BLOCK = '''<!-- ASFI_ADSTERRA_PRIVACY_2026_10_14 -->
  <p>Asfi Blog uses third-party Adsterra Native and 300 x 250 sponsored advertisements. The vendor may collect device identifiers, cookies and activity data. In certain locations (including the UK/EEA and where location is unknown), advertising scripts are withheld unless you opt in. For other locations where automatic loading is configured, applicable opt-out rights and browser privacy controls must be respected. If you previously declined ads or enable a Global Privacy Control browser signal, our ad loader will not intentionally request those scripts. You can update your preference here. <a href="https://adsterra.com/privacy-policy-managed" target="_blank" rel="noopener noreferrer">Adsterra privacy policy</a>.</p>
  <p><button type="button" data-reopen-ad-consent>Advertising preferences</button></p>
'''

def generate(project):
    main = project/'assets/js/main.js'
    policy = project/'privacy-policy.html'
    page404 = project/'404.html'
    if not main.exists() or not policy.exists() or not (project/'blog/index.html').exists():
        raise ValueError('Expected AsfiBlog folder structure not found')
    main_text = main.read_text(encoding='utf-8')
    if '// assets/js/main.js' not in main_text or MARK not in main_text:
        raise ValueError('Old Adsterra patch must already be installed in main.js; stopping to avoid damaging site')
    # Replace only the marked Adsterra block which is appended to main.js.
    main_text = main_text[:main_text.index(MARK)].rstrip() + '\n\n' + ACTIVATE
    privacy_text = policy.read_text(encoding='utf-8')
    block_pattern = re.compile(r'<!-- ASFI_ADSTERRA_PRIVACY_2026_10_14 -->.*?(?=<p>This site may use cookies)', re.S)
    if not block_pattern.search(privacy_text):
        raise ValueError('Privacy block marker not found; stop rather than replacing arbitrary text')
    privacy_text = block_pattern.sub(PRIVACY_BLOCK + '\n  ', privacy_text, count=1)
    notfound = page404.read_text(encoding='utf-8')
    if '/assets/js/main.js' not in notfound:
        notfound = notfound.replace('</head>', '<script src="/assets/js/main.js" defer></script>\n</head>', 1)
    return {
      main:main_text,
      policy:privacy_text,
      page404:notfound,
      project/'assets/js/adsterra.js':(HERE/'assets/js/adsterra.js').read_text(encoding='utf-8'),
      project/'api/ad-eligibility.js':(HERE/'api/ad-eligibility.js').read_text(encoding='utf-8')
    }

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--project',required=True)
    parser.add_argument('--apply',action='store_true')
    args=parser.parse_args()
    project=Path(args.project).resolve()
    try: changes=generate(project)
    except (OSError,ValueError) as e:sys.exit('Preflight FAILED: '+str(e))
    changes={path:content for path,content in changes.items() if not path.exists() or path.read_text(encoding='utf-8')!=content}
    print('Preflight OK. Changes:')
    for f in changes:print(' - '+str(f.relative_to(project)))
    if not args.apply:
        print('DRY RUN only. Run again with --apply after confirming commercial hosting.')
        return
    for path,content in changes.items():
        backup=project.parent/(project.name+'_adsterra_allpages_backup')/path.relative_to(project)
        if path.exists() and not backup.exists():
            backup.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(path,backup)
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(content,encoding='utf-8')
    print('Applied. Review git diff and run npm test before committing. Live ad delivery is NOT verified.')
if __name__=='__main__':main()
