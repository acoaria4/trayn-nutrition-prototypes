import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,relative,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../dist');
const base=(process.env.PAGES_BASE??'/trayn-nutrition-prototypes').replace(/\/$/,'');
const origin='https://acoaria4.github.io';
for(const route of ['index.html','v1/index.html','v2/index.html','v3/index.html','v4/index.html','v2/drafts/index.html','v2/drafts/quiet.html','v2/drafts/tension.html','v2/drafts/flavour.html'])assert.match(await readFile(resolve(root,route),'utf8'),/<main\b/,route);
async function filesWithin(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){assert.ok(!entry.isSymbolicLink());const p=resolve(dir,entry.name);if(entry.isDirectory())files.push(...await filesWithin(p));else files.push(p);}return files;}
let checked=0;
for(const file of await filesWithin(root)){
 const ext=extname(file);if(!['.html','.css'].includes(ext))continue;
 const text=await readFile(file,'utf8');assert.ok(!text.includes('http://127.0.0.1:'),`Local URL in ${file}`);
 let refs=ext==='.css'?[...text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)].map(m=>m[1]):[...text.matchAll(/\b(?:href|src|poster)="([^"]*)"/g)].map(m=>m[1]);
 if(ext==='.html')for(const match of text.matchAll(/\b(?:srcset|imagesrcset)="([^"]*)"/g))refs.push(...match[1].split(',').map(x=>x.trim().split(/\s+/)[0]));
 for(const ref of refs){const url=new URL(ref.replaceAll('&amp;','&'),`${origin}${base}/${relative(root,file).split(sep).join('/')}`);if(url.origin!==origin)continue;assert.ok(url.pathname.startsWith(`${base}/`),`Escaped Pages prefix: ${ref}`);const path=resolve(root,'.'+decodeURIComponent(url.pathname.slice(base.length)));assert.ok(path===root||path.startsWith(root+sep));let info;try{info=await stat(path);if(info.isDirectory())info=await stat(resolve(path,'index.html'));}catch{assert.fail(`${relative(root,file)} → missing ${ref}`);}assert.ok(info.isFile());checked++;}
}
for(const path of ['v4/models/trayn-pouch.glb','v4/video/training-wide.mp4','v4/video/training-phone.mp4'])assert.ok((await stat(resolve(root,path))).size>0);
console.log(`PASS: V1–V4, all opening studies, and ${checked} local HTML/CSS references under ${base||'/'}.`);
