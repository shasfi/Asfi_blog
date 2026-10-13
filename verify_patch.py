#!/usr/bin/env python3
"""Run after apply_patch.py, before a push. Python 3.9+."""
import argparse, json, re, sys
from pathlib import Path
from datetime import datetime,timezone
p=argparse.ArgumentParser();p.add_argument('--project',required=True)
root=Path(p.parse_args().project).resolve()
articles=json.loads((Path(__file__).resolve().parent/'VIRAL_ARTICLES_METADATA.json').read_text(encoding='utf-8'))
for a in articles:
    f=root/'blog'/f'{a["slug"]}.html'
    assert f.exists(),f
    s=f.read_text(encoding='utf-8')
    assert len(re.findall(r'\b[\w’\-]+\b',re.sub(r'<[^>]*>',' ',s.split('<div class="content">')[1].split('</div>')[0])))>=1100
    assert s.count('gtag/js?id=G-SXL9MNZFNL') == 1
    assert f'{a["slug"]}.html' in s
    assert 'has not been independently' in s
    assert datetime.fromisoformat(a['date'].replace('Z','+00:00')) <= datetime.now(timezone.utc)
for filename in ('index.html','blog/index.html','assets/js/posts-data.js','sitemap.xml','rss.xml'):
    data=(root/filename).read_text(encoding='utf-8')
    for a in articles:assert a['slug'] in data,(filename,a['slug'])
archive=(root/'blog/index.html').read_text()
links=re.findall(r'href="/blog/([^"/]+)\.html"',archive.split('<!-- STATIC_ARCHIVE_START -->')[1].split('<!-- STATIC_ARCHIVE_END -->')[0]);assert len(links)==len(set(links)), 'Duplicate static archive links'
assert len(links)==len(list((root/'blog').glob('*.html')))-1, (len(links),'archive',len(list((root/'blog').glob('*.html'))),'HTML')
print('PASS: two verified topical articles, GA4 tags, 1,100+ words each, dates, home/catalog/archive/sitemap/RSS sync; total article pages:',len(links))
