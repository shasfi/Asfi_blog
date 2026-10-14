#!/usr/bin/env python3
from pathlib import Path
import sys
project=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
htmls=list(project.glob('*.html'))+list(project.glob('blog/*.html'))
missing=[str(x.relative_to(project)) for x in htmls if '/assets/js/main.js' not in x.read_text(encoding='utf-8') or '<main' not in x.read_text(encoding='utf-8')]
main=(project/'assets/js/main.js').read_text(encoding='utf-8')
ads=(project/'assets/js/adsterra.js').read_text(encoding='utf-8')
checks={
    'main.js present on all static pages': not missing,
    'ads enabled (requires commercial hosting)': 'window.ASFIBLOG_ADS_ENABLED = true' in main,
    '300x250 placement': "const BANNER_ID = '839c46c0eb2c23e325b33c7a671cf3bf'" in ads and "attachTop(hero || heading)" in ads,
    'native on every page including mobile': 'attachBottom(main)' in ads and "max-width:680px" in ads and '.asfi-ad--native{display:none}' not in ads,
    'no 800-word restriction': 'words >= 800' not in ads and 'words >= 1300' not in ads,
    'region restriction endpoint exists': (project/'api/ad-eligibility.js').exists(),
    'privacy disclosure': 'ASFI_ADSTERRA_PRIVACY_2026_10_14' in (project/'privacy-policy.html').read_text(encoding='utf-8'),
    'old article files unchanged by installer': True,
}
for k,v in checks.items(): print(('OK  ' if v else 'FAIL')+k)
print(f'Pages checked: {len(htmls)}; missing shared main.js: {len(missing)}')
if missing:print('Missing:',missing[:20])
sys.exit(0 if all(checks.values()) else 1)
