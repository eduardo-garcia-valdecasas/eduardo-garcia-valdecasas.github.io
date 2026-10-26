import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'source');
const output=path.resolve(process.argv[2]??path.join(root,'dist'));
if(output===root||output===source||source.startsWith(output+path.sep))throw new Error('Choose a separate output directory.');
const generated=spawnSync(process.execPath,[path.join(root,'scripts/generate-pages.mjs')],{stdio:'inherit'});
if(generated.status!==0)process.exit(generated.status??1);
const quarto=(process.env.QUARTO_BIN??(process.platform==='win32'?'quarto.exe':'quarto')).replace(/\.cmd$/i,'.exe');
const rendered=spawnSync(quarto,['render',source],{stdio:'inherit'});
if(rendered.status!==0)process.exit(rendered.status??1);
await fs.mkdir(output,{recursive:true});
await fs.cp(path.join(source,'_site'),output,{recursive:true});
for(const lang of ['', 'es/'])for(const page of ['index','research','teaching','outreach','talks','404']){
 const file=path.join(output,lang,page+'.html');
 let html=await fs.readFile(file,'utf8');
 html='<!doctype html>\n'+html.replace(/^\s*<!doctype html>\s*/i,'');
 if(page==='404'||page==='thanks')html=html.replace('<head>','<head><meta name="robots" content="noindex">');
 await fs.writeFile(file,html);
}
await fs.writeFile(path.join(output,'.nojekyll'),'');
await fs.rm(path.join(output,'search.json'),{force:true});
const data=JSON.parse(await fs.readFile(path.join(source,'data/content.json'),'utf8'));
const entries=['','es/'].flatMap(lang=>['index','research','teaching','outreach','talks'].map(page=>`${data.site_url}/${lang}${page==='index'?'':page+'.html'}`));
await fs.writeFile(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+entries.map(url=>`  <url><loc>${url}</loc></url>`).join('\n')+'\n</urlset>\n');
await fs.writeFile(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${data.site_url}/sitemap.xml\n`);
console.log(`Built website: ${output}`);
