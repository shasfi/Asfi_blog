#!/usr/bin/env python3
"""Safely synchronize two existing Musk-Ambani article HTML files with the AsfiBlog catalog, blog archive, sitemap, RSS, and homepage. Dry-run by default. No deployment or secrets."""
import argparse
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
import json, html, re, subprocess, shutil, sys

HERE=Path(__file__).resolve().parent
ARTICLES=json.loads((HERE/'VIRAL_ARTICLES_METADATA.json').read_text(encoding='utf-8'))
BASE='https://asfiblog.vercel.app'
FILES=('assets/js/posts-data.js','blog/index.html','sitemap.xml','rss.xml','index.html')

def fail(msg):
    raise SystemExit('STOP: '+msg)

def update_catalog(src):
    marker='window.ASFIBLOG_POSTS = ['
    if marker not in src: fail('Cannot locate catalog array')
    for a in ARTICLES:
        slug=a['slug']
        if re.search(r'\bslug\s*:\s*"'+re.escape(slug)+r'"|"slug"\s*:\s*"'+re.escape(slug)+r'"',src): continue
        rec={'slug':slug,'title':a['title'],'excerpt':a['description'],'category':a['category'],
             'image':BASE+'/logo.png','date':a['date'][:10],'timestamp':a['date'],
             'readMins':max(5,round(a['word_count']/225)),'views':0}
        src=src.replace(marker,marker+'\n  '+json.dumps(rec,ensure_ascii=False,indent=2).replace('\n','\n  ')+',',1)
    return src

def update_archive(src):
    start='<!-- STATIC_ARCHIVE_START -->';end='<!-- STATIC_ARCHIVE_END -->'
    if start not in src or end not in src:fail('Static archive markers absent')
    head,rest=src.split(start,1);body,foot=rest.split(end,1)
    for a in ARTICLES:
        url=f'/blog/{a["slug"]}.html'
        if f'href="{url}"' not in body:
            body='\n<li><a href="'+url+'">'+html.escape(a['title'])+'</a></li>'+body
    count=len(re.findall(r'<li><a href="/blog/[^"<>]+\.html"',body))
    return re.sub(r'Complete article directory \(\d+ articles\)',f'Complete article directory ({count} articles)',head+start+body+end+foot,count=1)

def update_sitemap(src):
    if '</urlset>' not in src: fail('Sitemap closing tag missing')
    for a in ARTICLES:
        url=BASE+'/blog/'+a['slug']+'.html'
        if url not in src:
            chunk=f'  <url>\n    <loc>{html.escape(url)}</loc>\n    <lastmod>{a["date"][:10]}</lastmod>\n  </url>\n'
            src=src.replace('</urlset>',chunk+'</urlset>',1)
    return src

def update_rss(src):
    if '</channel>' not in src:fail('RSS closing tag missing')
    chunks=[]
    for a in ARTICLES:
        url=BASE+'/blog/'+a['slug']+'.html'
        if url in src:continue
        date=datetime.fromisoformat(a['date'].replace('Z','+00:00'))
        chunks.append(f'<item><title>{html.escape(a["title"])}</title><link>{url}</link><guid>{url}</guid><description>{html.escape(a["description"])}</description><pubDate>{format_datetime(date,usegmt=True)}</pubDate></item>\n')
    return src.replace('</channel>',''.join(chunks)+'</channel>',1) if chunks else src

def update_home(src):
    begin='<!-- ASFI_EDITORIAL_PICKS_BEGIN -->';end='<!-- ASFI_EDITORIAL_PICKS_END -->'
    cards='\n'.join(f'''      <a class="card in-view" href="/blog/{a['slug']}.html"><div class="card__body"><span class="stamp">Explainer</span><h3 class="card__title">{html.escape(a['title'])}</h3><p class="card__excerpt">{html.escape(a['description'])}</p></div></a>''' for a in ARTICLES)
    block=f'''{begin}\n  <section style="padding-bottom:28px" aria-label="Editors' picks"><div class="section-head"><h2>Editor's picks: Starlink and India</h2><a href="/blog/index.html" class="see-all">More reporting →</a></div><div class="grid grid--trending">\n{cards}\n</div></section>\n{end}'''
    if begin in src and end in src:return re.sub(re.escape(begin)+r'[\s\S]*?'+re.escape(end),lambda _:block,src,count=1)
    marker='  <section style="padding-bottom:56px;">'
    if marker in src:return src.replace(marker,block+'\n'+marker,1)
    if '  <main' in src:return src.replace('  <main',block+'\n  <main',1)
    fail('Homepage insertion marker not found')

def main():
    arg=argparse.ArgumentParser(description=__doc__)
    arg.add_argument('--project',required=True)
    arg.add_argument('--apply',action='store_true')
    opts=arg.parse_args()
    project=Path(opts.project).resolve()
    if not (project/'.git').is_dir():fail('Point --project at cloned repository root with .git')
    for f in FILES:
        if not (project/f).is_file():fail('Missing file: '+f)
    if opts.apply:
        s=subprocess.run(['git','-C',str(project),'status','--porcelain'],capture_output=True,text=True)
        if s.returncode or s.stdout.strip():fail('Uncommitted changes found; commit or back up before --apply')
    updates={}
    for name,func in [('assets/js/posts-data.js',update_catalog),('blog/index.html',update_archive),('sitemap.xml',update_sitemap),('rss.xml',update_rss),('index.html',update_home)]:
        old=(project/name).read_text(encoding='utf-8')
        updates[name]=func(old)
    for a in ARTICLES:
        dest=project/'blog'/f'{a["slug"]}.html'
        src=HERE/'blog'/dest.name
        if dest.exists() and dest.read_bytes()!=src.read_bytes():fail('Existing article differs. No overwrite: '+dest.name)
    print('PREVIEW:')
    for name,new in updates.items():
        old=(project/name).read_text(encoding='utf-8')
        print(' ',name, 'UPDATE' if old!=new else 'already correct')
    if not opts.apply:
        print('Preflight OK (dry-run). No files changed.')
        return
    backup=project.parent/('AsfiBlog_Musk_Backup_'+datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S'))
    for name,new in updates.items():
        old=project/name
        to=backup/name;to.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(old,to)
        if old.read_text(encoding='utf-8')!=new:old.write_text(new,encoding='utf-8',newline='\n')
    for a in ARTICLES:
        dest=project/'blog'/f'{a["slug"]}.html'
        if not dest.exists():shutil.copy2(HERE/'blog'/dest.name,dest)
    print('APPLIED. Backup:',backup)
    print('Next: npm test; git diff --check; git status -sb')

if __name__=='__main__':main()
