#!/usr/bin/env python3
"""Verify installed source without running ad network code or contacting the Internet."""
from pathlib import Path
import sys
project=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
main=(project/'assets/js/main.js').read_text(encoding='utf-8')
ads=(project/'assets/js/adsterra.js').read_text(encoding='utf-8')
privacy=(project/'privacy-policy.html').read_text(encoding='utf-8')
posts=list((project/'blog').glob('*.html'))
articles=[p for p in posts if p.name!='index.html']
checks={
  'opt-in publisher feature flag': 'window.ASFIBLOG_ADS_ENABLED = false' in main or 'window.ASFIBLOG_ADS_ENABLED = true' in main,
  'shared ad loader': '/assets/js/adsterra.js' in main,
  'native widget exact publisher ID': 'bc9ccbb45c50d34c46c04ff7f0cf29f8' in ads,
  'display exact publisher key': '839c46c0eb2c23e325b33c7a671cf3bf' in ads,
  'both supplied script URLs': 'https://bauval.org/21/' in ads and 'https://bauval.org/22/' in ads,
  'advertising consent gate': "getChoice() !== 'accepted'" in ads,
  'privacy disclosure updated': 'ASFI_ADSTERRA_PRIVACY_2026_10_14' in privacy,
  'homepage uses shared main.js': '/assets/js/main.js' in (project/'index.html').read_text(encoding='utf-8'),
  'blog archive uses shared main.js': '/assets/js/main.js' in (project/'blog/index.html').read_text(encoding='utf-8'),
  'all existing article pages use shared main.js': all('/assets/js/main.js' in p.read_text(encoding='utf-8') for p in articles),
  'at least one article available': bool(articles),
}
for label,ok in checks.items(): print(('PASS' if ok else 'FAIL')+'  '+label)
print(f'Blog posts covered via shared script: {len(articles)}')
if not all(checks.values()): sys.exit(1)
