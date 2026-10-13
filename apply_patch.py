#!/usr/bin/env python3
"""Non-destructive installer for verified viral news articles on an existing AsfiBlog checkout.
Dry-run by default. No secrets, remote writes or deployments. Python 3.9+.
"""
from __future__ import annotations
import argparse
import copy
import datetime
import email.utils
import html
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ARTICLES = json.loads((HERE / 'VIRAL_ARTICLES_METADATA.json').read_text(encoding='utf-8'))
BASE='https://asfiblog.vercel.app'
PUBLISHED = '2026-10-13'


def fail(message):
    raise SystemExit('STOP: '+message)


def update_catalog(content, article):
    slug=article['slug']
    if re.search(r'"slug"\s*:\s*"'+re.escape(slug)+r'"|\bslug\s*:\s*"'+re.escape(slug)+r'"',content):
        print('Catalog already has:',slug)
        return content
    marker='window.ASFIBLOG_POSTS = ['
    if marker not in content:fail('posts-data.js structure changed; cannot safely update catalog')
    record={
        'slug':slug,'title':article['title'],'excerpt':article['description'],
        'category':article['category'],'image':BASE+'/logo.png',
        'date':PUBLISHED,'timestamp':article['date'],
        'readMins':max(5,round(article['word_count']/225)),'views':0,
    }
    return content.replace(marker,marker+'\n  '+json.dumps(record,ensure_ascii=False,indent=2).replace('\n','\n  ')+',',1)


def update_archive(content,articles):
    marker='<!-- STATIC_ARCHIVE_START -->'
    if marker not in content or '<!-- STATIC_ARCHIVE_END -->' not in content:
        fail('blog/index.html static archive markers not found')
    before,tail=content.split(marker,1)
    listing,after=tail.split('<!-- STATIC_ARCHIVE_END -->',1)
    for article in articles:
        slug=article['slug']
        if f'href="/blog/{slug}.html"' in listing:continue
        listing='\n<li><a href="/blog/'+slug+'.html">'+html.escape(article['title'])+'</a></li>'+listing
    count=len(re.findall(r'<li><a href="/blog/[^"<>]+\.html"',listing))
    result=before+marker+listing+'<!-- STATIC_ARCHIVE_END -->'+after
    return re.sub(r'Complete article directory \(\d+ articles\)',f'Complete article directory ({count} articles)',result,count=1)


def update_sitemap(content,articles):
    if '</urlset>' not in content:fail('sitemap.xml missing closing urlset')
    for a in articles:
        url=BASE+'/blog/'+a['slug']+'.html'
        if html.escape(url) not in content:
            item=f'  <url>\n    <loc>{html.escape(url)}</loc>\n    <lastmod>{PUBLISHED}</lastmod>\n  </url>\n'
            content=content.replace('</urlset>',item+'</urlset>',1)
    return content


def update_rss(content,articles):
    if '</channel>' not in content:fail('rss.xml missing channel')
    items=[]
    for a in articles:
        url=BASE+'/blog/'+a['slug']+'.html'
        if url in content:continue
        pub=datetime.datetime.fromisoformat(a['date'].replace('Z','+00:00'))
        items.append('    <item>\n'+f'      <title>{html.escape(a["title"])}</title>\n'
            +f'      <link>{html.escape(url)}</link>\n'
            +f'      <guid>{html.escape(url)}</guid>\n'
            +f'      <description>{html.escape(a["description"])}</description>\n'
            +f'      <pubDate>{email.utils.format_datetime(pub,usegmt=True)}</pubDate>\n'+'    </item>\n')
    if items:
        content=content.replace('</channel>',''.join(items)+'</channel>',1)
    return content


def update_home(content,articles):
    begin='<!-- ASFI_EDITORIAL_PICKS_BEGIN -->';end='<!-- ASFI_EDITORIAL_PICKS_END -->'
    first=articles[0];second=articles[1]
    picks=f'''{begin}
  <section style="padding-bottom:28px" aria-label="Editors' picks">
    <div class="section-head"><h2>Editor's picks: Starlink and India</h2><a href="/blog/index.html" class="see-all">More reporting →</a></div>
    <div class="grid grid--trending">
      <a class="card in-view" href="/blog/{first['slug']}.html"><div class="card__body"><span class="stamp">Explainer</span><h3 class="card__title">{html.escape(first['title'])}</h3><p class="card__excerpt">{html.escape(first['description'])}</p></div></a>
      <a class="card in-view" href="/blog/{second['slug']}.html"><div class="card__body"><span class="stamp">Explainer</span><h3 class="card__title">{html.escape(second['title'])}</h3><p class="card__excerpt">{html.escape(second['description'])}</p></div></a>
    </div>
  </section>
{end}'''
    if begin in content and end in content:
        return re.sub(re.escape(begin)+r'[\s\S]*?'+re.escape(end),lambda _:picks,content,count=1)
    marker='    <!-- Rendered by assets/js/blog-render.js from posts-data.js, ranked by views -->'
    # Insert a standalone curated section BEFORE the trending section, not inside its wrapping container.
    marker2='  <section style="padding-bottom:56px;">'
    if marker2 in content:
        return content.replace(marker2,picks+'\n'+marker2,1)
    if marker in content:
        return content.replace(marker,picks+'\n'+marker,1)
    fail('Homepage editorial section marker changed, cannot insert safely')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project',required=True,help='Existing GitHub cloned Asfi_blog project directory')
    parser.add_argument('--apply',action='store_true',help='Write changes locally; without this flag only dry run')
    args=parser.parse_args()
    project=Path(args.project).resolve()
    required=['assets/js/posts-data.js','blog/index.html','index.html','sitemap.xml','rss.xml','api/generate-blog.js']
    for f in required:
        if not (project/f).is_file():fail(f'Project missing {f}. Point --project to the repo ROOT.')
    if not (project/'.git').exists():fail('Not a Git checkout. Use your existing GitHub repository directory.')
    git=['git','-C',str(project)]
    branch=subprocess.run(git+['branch','--show-current'],capture_output=True,text=True)
    if branch.returncode or branch.stdout.strip() != 'main':fail('Expected main branch, but found '+repr(branch.stdout.strip()))
    dirty=subprocess.run(git+['status','--porcelain'],capture_output=True,text=True)
    if dirty.returncode:fail('Git status failed; stop and inspect the repository')
    if dirty.stdout.strip() and args.apply:
        fail('Working tree has uncommitted changes. Back them up or commit before installing this patch.')
    if dirty.stdout.strip():print('WARNING: working tree is not clean; --apply will stop until you resolve it')
    for a in ARTICLES:
        dest=project/'blog'/f"{a['slug']}.html"
        source=HERE/'blog'/f"{a['slug']}.html"
        if dest.exists() and dest.read_bytes()!=source.read_bytes():
            fail('Existing article has same slug but different content; manual merge required: '+a['slug'])
    replacements={}
    for file,mutator in [
        ('assets/js/posts-data.js',lambda s:update_catalog(update_catalog(s,ARTICLES[0]),ARTICLES[1])),
        ('blog/index.html',lambda s:update_archive(s,ARTICLES)),
        ('sitemap.xml',lambda s:update_sitemap(s,ARTICLES)),
        ('rss.xml',lambda s:update_rss(s,ARTICLES)),
        ('index.html',lambda s:update_home(s,ARTICLES))]:
        old=(project/file).read_text(encoding='utf-8')
        replacements[file]=mutator(old)
    gen=(project/'api/generate-blog.js').read_text(encoding='utf-8')
    already_updated='Priority = credible, current, widely-covered US-interest stories.' in gen
    if not already_updated:
        chk=subprocess.run(git+['apply','--check',str(HERE/'automation.patch')],capture_output=True,text=True)
        if chk.returncode != 0:
            fail('Automation code differs from previously supplied ZIP. No unsafe overwrite. '+chk.stderr.strip()[:550])
    print('Preflight OK; articles:',len(ARTICLES),'| old existing archive preserved | generator patch:', 'already present' if already_updated else 'ready')
    print('Action:', 'APPLY changes locally' if args.apply else 'DRY RUN ONLY')
    if not args.apply:return
    backup=Path.home()/'Documents'/'AsfiBlog-Patch-Backups'/datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    backup.mkdir(parents=True,exist_ok=True)
    for path in list(replacements)+(['api/generate-blog.js'] if not already_updated else []):
        dest=backup/path;dest.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(project/path,dest)
    print('Backup:',backup)
    if not already_updated:
        applied=subprocess.run(git+['apply',str(HERE/'automation.patch')],capture_output=True,text=True)
        if applied.returncode:fail('Git apply failed. Backup available: '+str(backup)+'\n'+applied.stderr)
    for path,content in replacements.items():
        (project/path).write_text(content,encoding='utf-8',newline='\n')
    for a in ARTICLES:
        dest=project/'blog'/f"{a['slug']}.html"
        if not dest.exists():shutil.copy2(HERE/'blog'/dest.name,dest)
    print('LOCAL PATCH APPLIED. No GitHub push/deployment performed.')
    print('Next: run npm test, then git status --short, then review before commit/push.')

if __name__=='__main__':
    main()
