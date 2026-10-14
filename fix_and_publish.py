#!/usr/bin/env python3
"""AsfiBlog: synchronize two Musk articles, safely commit/push once, VERIFY remote + live.
Requires local git clone with permission to push origin/main; no tokens are stored or requested.
"""
import argparse,datetime,html,json,re,subprocess,sys,time,urllib.request,urllib.error,xml.etree.ElementTree as ET
from pathlib import Path
from email.utils import format_datetime
ROOT=Path(__file__).resolve().parent
ARTICLES=json.loads((ROOT/'VIRAL_ARTICLES_METADATA.json').read_text(encoding='utf8'))
BASE='https://asfiblog.vercel.app'
SLUGS=[a['slug'] for a in ARTICLES]
TARGETS=['assets/js/posts-data.js','blog/index.html','index.html','sitemap.xml','rss.xml']
for a in ARTICLES: TARGETS.append('blog/'+a['slug']+'.html')

def fail(msg):
    print('\nSTOP:',msg,flush=True)
    sys.exit(1)
def git(p,*args,check=True):
    cmd=['git','-C',str(p),*args]
    ret=subprocess.run(cmd,capture_output=True,text=True)
    if check and ret.returncode: fail('git '+' '.join(args)+' failed: '+(ret.stderr or ret.stdout).strip()[-1300:])
    return ret
def write_if_changed(p,text):
    old=p.read_text(encoding='utf8')
    if text!=old: p.write_text(text,encoding='utf8',newline='\n')

def sync_catalog(t):
    marker='window.ASFIBLOG_POSTS = ['
    if marker not in t:fail('posts-data.js catalog marker missing')
    for a in reversed(ARTICLES):
        if re.search(r'[\'\"]?slug[\'\"]?\s*:\s*[\'\"]'+re.escape(a['slug'])+r'[\'\"]',t):continue
        record={'slug':a['slug'],'title':a['title'],'excerpt':a['description'],'category':a['category'],'image':BASE+'/logo.png','date':a['date'][:10],'timestamp':a['date'],'readMins':max(5,round(a['word_count']/225)),'views':0}
        t=t.replace(marker,marker+'\n  '+json.dumps(record,ensure_ascii=False)+',',1)
    return t

def sync_archive(t):
    begin='<!-- STATIC_ARCHIVE_START -->';end='<!-- STATIC_ARCHIVE_END -->'
    if begin not in t or end not in t:
        print('INFO: Static directory markers absent; JS catalog handles blog listing.')
        return t
    x,tail=t.split(begin,1);middle,y=tail.split(end,1)
    for a in ARTICLES:
        href='/blog/'+a['slug']+'.html'
        if href not in middle:
            middle='\n<li><a href="'+href+'">'+html.escape(a['title'])+'</a></li>'+middle
    t=x+begin+middle+end+y
    n=len(re.findall(r'<li><a href="/blog/[^"<>]+\.html"',middle))
    if n:t=re.sub(r'Complete article directory \(\d+ articles\)',f'Complete article directory ({n} articles)',t,count=1)
    return t

def sync_sitemap(t):
    if '</urlset>' not in t:fail('sitemap.xml missing closing urlset')
    for a in ARTICLES:
        loc=f'{BASE}/blog/{a["slug"]}.html'
        if loc not in t:
            t=t.replace('</urlset>',f'  <url><loc>{loc}</loc><lastmod>{a["date"][:10]}</lastmod></url>\n</urlset>',1)
    return t

def sync_rss(t):
    if '</channel>' not in t:fail('rss.xml missing channel')
    chunks=[]
    for a in ARTICLES:
        link=f'{BASE}/blog/{a["slug"]}.html'
        if link in t:continue
        dt=datetime.datetime.fromisoformat(a['date'].replace('Z','+00:00'))
        chunks.append('<item><title>'+html.escape(a['title'])+'</title><link>'+link+'</link><guid>'+link+'</guid><description>'+html.escape(a['description'])+'</description><pubDate>'+format_datetime(dt,usegmt=True)+'</pubDate></item>')
    if not chunks:return t
    return t.replace('<channel>','<channel>\n'+'\n'.join(chunks),1)

def sync_home(t,count):
    # The dynamic grid reads posts-data.js. Featured links are intentionally inserted so
    # the user can SEE these two posts immediately even while older static cards exist.
    start='<!-- MUSK_AMBANI_EDITORIAL_LINKS_START -->';end='<!-- MUSK_AMBANI_EDITORIAL_LINKS_END -->'
    cards='\n'.join('    <a class="card in-view" href="/blog/'+a['slug']+'.html"><div class="card__body"><span class="stamp">'+html.escape(a['category'])+'</span><h3 class="card__title">'+html.escape(a['title'])+'</h3><p class="card__excerpt">'+html.escape(a['description'])+'</p></div></a>' for a in ARTICLES)
    block=start+'\n<section class="editorial-highlights" aria-label="Starlink India coverage" style="padding-bottom:24px"><div class="section-head"><h2>Starlink India: Latest Explainers</h2><a href="/blog/index.html" class="see-all">All stories</a></div><div class="grid grid--trending">\n'+cards+'\n</div></section>\n'+end
    if start in t and end in t:
        t=re.sub(re.escape(start)+r'[\s\S]*?'+re.escape(end),lambda _:block,t,count=1)
    else:
        marker='  <section style="padding-bottom:56px;">'
        if marker in t:t=t.replace(marker,block+'\n'+marker,1)
        else:
            m=re.search(r'<main\b[^>]*>',t,re.I)
            if not m:fail('index.html has no main element, cannot add editorial links')
            t=t[:m.end()]+'\n'+block+t[m.end():]
    # If the static count is rendered, synchronize it. The JS dynamic count also uses catalog.
    t=re.sub(r'(<span[^>]*data-dynamic="posts-count"[^>]*data-count=")[^\"]+("[^>]*>)[^<]*(</span>)',lambda m:m.group(1)+str(count)+m.group(2)+str(count)+m.group(3),t)
    return t

def validate(p):
    cat=(p/'assets/js/posts-data.js').read_text(encoding='utf8')
    home=(p/'index.html').read_text(encoding='utf8')
    archive=(p/'blog/index.html').read_text(encoding='utf8')
    site=(p/'sitemap.xml').read_text(encoding='utf8')
    rss=(p/'rss.xml').read_text(encoding='utf8')
    for a in ARTICLES:
        slug=a['slug']
        for where,s in [('catalog',cat),('homepage',home),('sitemap',site),('rss',rss)]:
            if slug not in s:fail('Local verify FAILED: '+slug+' missing from '+where)
        if 'STATIC_ARCHIVE_START' in archive and slug not in archive:fail('Missing static archive link: '+slug)
        if not (p/'blog'/(slug+'.html')).exists():fail('Article HTML missing: '+slug)
        # Catalog must contain EXACTLY one record for each slug
        hits=re.findall(r'[\'\"]?slug[\'\"]?\s*:\s*[\'\"]'+re.escape(slug)+r'[\'\"]',cat)
        if len(hits)!=1:fail('Duplicate/missing catalog slug: '+slug+' ('+str(len(hits))+')')
    for name,s in [('sitemap.xml',site),('rss.xml',rss)]:
        try:ET.fromstring(s)
        except ET.ParseError as e:fail(name+' XML invalid: '+str(e))
    import shutil
    if shutil.which('node'):
        ret=subprocess.run(['node','--check',str(p/'assets/js/posts-data.js')],capture_output=True,text=True)
        if ret.returncode:fail('JS syntax invalid: '+ret.stderr[-800:])
    if git(p,'diff','--check',check=False).returncode:fail('git diff --check failed')
    print('VERIFIED: 2 articles, catalog, homepage, archive (if applicable), XML sitemap, RSS; no duplicates.',flush=True)

def sync(p):
    catalog=p/'assets/js/posts-data.js'
    write_if_changed(catalog,sync_catalog(catalog.read_text(encoding='utf8')))
    # Use a JS sandbox only for counting static posts, if node available; fallback
    # matches both JSON and unquoted property names in source.
    data=catalog.read_text(encoding='utf8')
    count=len(re.findall(r'[\'\"]?slug[\'\"]?\s*:\s*[\'\"][^\'\"]+[\'\"]',data))
    if count<200:fail('Catalog count is unexpectedly small ('+str(count)+'). Refusing update.')
    for name,fn in [('blog/index.html',sync_archive),('sitemap.xml',sync_sitemap),('rss.xml',sync_rss)]:
        dest=p/name;write_if_changed(dest,fn(dest.read_text(encoding='utf8')))
    home=p/'index.html';write_if_changed(home,sync_home(home.read_text(encoding='utf8'),count))
    for a in ARTICLES:
        dest=p/'blog'/(a['slug']+'.html'); src=ROOT/'blog'/dest.name
        if not dest.exists():
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(src.read_bytes())
        # Preserve existing HTML instead of overwriting potentially updated content.
    validate(p)
    print('Article count in catalog:',count)

def github_remote_verify(p):
    # Git remote is definitive: compare server's branch HEAD with our commit.
    head=git(p,'rev-parse','HEAD').stdout.strip()
    remote=git(p,'ls-remote','origin','refs/heads/main')
    sha=remote.stdout.split()[0] if remote.stdout.strip() else ''
    if sha!=head:fail('Remote main HEAD does not match our pushed commit. Local='+head[:9]+' remote='+sha[:9])
    print('GITHUB MAIN VERIFIED: commit '+head[:12],flush=True)

def live_verify():
    # Give Vercel a chance to deploy, but always distinguish repo push from live readiness.
    urls=[BASE+'/assets/js/posts-data.js',BASE+'/sitemap.xml']
    print('Checking Vercel production files (up to ~70 seconds)...',flush=True)
    for attempt in range(10):
        ok=True;failures=[]
        for url in urls:
            try:
                req=urllib.request.Request(url+'?publish_check='+str(int(time.time())),headers={'User-Agent':'AsfiBlog-Publish-Verification/1.0','Cache-Control':'no-cache'})
                with urllib.request.urlopen(req,timeout=6) as r: page=r.read().decode('utf8','replace')
                if not all(s in page for s in SLUGS):ok=False;failures.append(url.rsplit('/',1)[-1]+' missing slugs')
            except Exception as e:
                ok=False;failures.append(type(e).__name__+':'+str(e)[:70])
        if ok:
            print('LIVE VERIFIED: Vercel catalog AND sitemap contain BOTH Musk articles!')
            print('Home:',BASE+'/')
            for slug in SLUGS:print('Article:',BASE+'/blog/'+slug+'.html')
            return
        if attempt<9:time.sleep(6)
    print('PUSHED TO GITHUB, BUT VERCEL NOT YET VERIFIED:', '; '.join(failures))
    print('Check Vercel latest Production deployment/commit SHA, then refresh the website. Do NOT reapply ZIP.')

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--project',default=r'E:\Projects\Asfi_blog');ap.add_argument('--no-push',action='store_true',help='test locally only');opts=ap.parse_args()
    p=Path(opts.project).expanduser().resolve()
    if not (p/'.git').is_dir():fail('Git project not found: '+str(p))
    if git(p,'branch','--show-current').stdout.strip()!='main':fail('Switch to main branch (git switch main) first')
    if git(p,'status','--porcelain').stdout.strip():fail('Uncommitted changes exist. Save/commit them first. NO files modified.')
    git(p,'fetch','origin','main')
    git(p,'pull','--ff-only','origin','main')
    for name in TARGETS[:5]:
        if not (p/name).is_file():fail('Missing required project file: '+name)
    print('Syncing catalog, homepage, blog archive, sitemap and RSS...')
    sync(p)
    changed=git(p,'status','--porcelain').stdout.strip()
    if not changed:
        print('ALREADY CORRECT locally; checking GitHub main.')
        if not opts.no_push:github_remote_verify(p);live_verify()
        return
    if opts.no_push:
        print('DRY-RUN MODE: files updated locally, NOT committed or pushed.')
        return
    git(p,'add','--',*TARGETS)
    git(p,'commit','-m','Publish both Musk Ambani articles across catalog, homepage, sitemap and RSS')
    print('Pushing article visibility fix to GitHub main...',flush=True)
    pushed=git(p,'push','origin','main',check=False)
    if pushed.returncode:
        # Retry once for concurrent automatic blog publications.
        print('Remote advanced during publishing; rebasing once against new articles...',flush=True)
        git(p,'fetch','origin','main')
        result=git(p,'rebase','origin/main',check=False)
        if result.returncode:
            git(p,'rebase','--abort',check=False)
            fail('Push race/conflict. Nothing force-pushed. Share git status -sb with assistant.')
        sync(p)
        if git(p,'status','--porcelain').stdout.strip():
            git(p,'add','--',*TARGETS)
            git(p,'commit','-m','Resync Musk article visibility after automated blog update')
        git(p,'push','origin','main')
    github_remote_verify(p)
    live_verify()

if __name__=='__main__':main()
