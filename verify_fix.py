#!/usr/bin/env python3
"""Static checks for loader linkage, all-page inclusion, and no duplicate bootstraps."""
from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
main=(p/'assets/js/main.js').read_text(encoding='utf-8')
ads=(p/'assets/js/adsterra.js').read_text(encoding='utf-8')
htmls=list(p.glob('*.html'))+list(p.glob('blog/*.html'))
missing=[str(f.relative_to(p)) for f in htmls if '/assets/js/main.js' not in f.read_text(encoding='utf-8')]
checks={
'bootstrap present exactly once':main.count('// ASFI_ADSTERRA_LOADER_REPAIR_2026_10_14')==1,
'bootstrap actually references shared ad loader':'script.src = \'/assets/js/adsterra.js\'' in main,
'ads enabled in bootstrap':'window.ASFIBLOG_ADS_ENABLED = true;' in main,
'shared file exists with native and display network IDs':'839c46c0eb2c23e325b33c7a671cf3bf' in ads and 'bc9ccbb45c50d34c46c04ff7f0cf29f8' in ads,
'geo/consent endpoint exists':(p/'api/ad-eligibility.js').is_file(),
'every local HTML page includes main.js':not missing,
'no short-article/mobile ad restriction':'generatedWords' not in ads and 'words >= 800' not in ads and 'asfi-ad--native{display:none}' not in ads,
'ads diagnostic object exposed':'ASFIBLOG_AD_DIAGNOSTICS' in ads,
}
for k,v in checks.items():print(('PASS' if v else 'FAIL'),k)
print('HTML pages checked:',len(htmls),'missing main.js:',missing[:15])
sys.exit(0 if all(checks.values()) else 1)
