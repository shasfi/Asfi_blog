#!/usr/bin/env python3
"""Add Adsterra integration without replacing existing articles or generator."""
import argparse
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent
MAIN_MARK = '// ASFI_ADSTERRA_SETUP_2026_10_14'
PRIVACY_MARK = '<!-- ASFI_ADSTERRA_PRIVACY_2026_10_14 -->'
MAIN_INSERT = '''
// ASFI_ADSTERRA_SETUP_2026_10_14
// Keep FALSE until your hosting plan permits commercial monetization,
// your privacy/advertising consent setup is appropriate for visitors,
// and the ad code is confirmed in your Adsterra publisher dashboard.
window.ASFIBLOG_ADS_ENABLED = false;
if (window.ASFIBLOG_ADS_ENABLED === true) {
  document.addEventListener('DOMContentLoaded', () => {
    const adLoader = document.createElement('script');
    adLoader.src = '/assets/js/adsterra.js';
    adLoader.async = true;
    document.head.appendChild(adLoader);
  });
}
'''
PRIVACY_INSERT = '''
  <!-- ASFI_ADSTERRA_PRIVACY_2026_10_14 -->
  <p>When publisher advertising is enabled, Asfi Blog may show clearly labeled sponsored Native Banner and 300 x 250 display advertisements from Adsterra. These are provided by an independent third party and may use cookies, device data, and similar technology. We ask separately before loading optional advertising scripts. Declining does not prevent access to our articles. Learn more in <a href="https://adsterra.com/privacy-policy-managed" rel="noopener noreferrer" target="_blank">Adsterra's privacy policy</a>.</p>
  <p><button type="button" data-reopen-ad-consent hidden>Change advertising preference</button></p>
'''

def changes(project):
    main = project / 'assets/js/main.js'
    policy = project / 'privacy-policy.html'
    target = project / 'assets/js/adsterra.js'
    if not main.is_file() or not policy.is_file() or not (project/'blog/index.html').is_file():
        raise ValueError('Missing expected AsfiBlog structure (main.js, privacy-policy.html, blog/index.html)')
    text_main = main.read_text(encoding='utf-8')
    text_policy = policy.read_text(encoding='utf-8')
    if 'ASFI_ADSTERRA_SETUP_2026_10_14' not in text_main and '// assets/js/main.js' not in text_main:
        raise ValueError('main.js is not recognized, refusing blind replacement')
    if PRIVACY_MARK not in text_policy and '<h2>Cookies and advertising</h2>' not in text_policy:
        raise ValueError('Cannot find Privacy Policy advertising section to update safely')
    if MAIN_MARK not in text_main:
        text_main = text_main.rstrip() + '\n' + MAIN_INSERT
    if PRIVACY_MARK not in text_policy:
        text_policy = text_policy.replace('<h2>Cookies and advertising</h2>',
                                          '<h2>Cookies and advertising</h2>' + PRIVACY_INSERT, 1)
    return [(main, text_main), (policy, text_policy), (target, (ROOT/'assets/js/adsterra.js').read_text(encoding='utf-8'))]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--project', required=True)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    project = Path(args.project).expanduser().resolve()
    try:
        plans = changes(project)
    except (OSError, ValueError) as exc:
        sys.exit('Preflight FAILED: ' + str(exc))
    to_write = [(path, content) for path, content in plans if not path.exists() or path.read_text(encoding='utf-8') != content]
    print('Preflight OK. Files requiring change:')
    for path, _ in to_write:
        print(' -', path.relative_to(project))
    if not to_write:
        print('Already installed, no changes needed.')
    if not args.apply:
        print('Dry run only. Add --apply to write files.')
        return
    for path, content in to_write:
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.exists():
            backup = project.parent / (project.name + '_ads_patch_backup') / path.relative_to(project)
            backup.parent.mkdir(parents=True, exist_ok=True)
            if not backup.exists():
                shutil.copy2(path, backup)
        path.write_text(content, encoding='utf-8')
    print('APPLIED. Ad scripts are OFF by default. Do not deploy active ads until compliant hosting and consent are ready.')
    print('Backups saved in a separate sibling folder. Run npm test and inspect git status before committing.')

if __name__ == '__main__':
    main()
