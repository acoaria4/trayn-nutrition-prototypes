import {chromiumOptions} from './browser-options.mjs';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,stat} from 'node:fs/promises';
import {extname,resolve,relative} from 'node:path';
import {chromium} from '@playwright/test';
const base=process.env.SITE_BASE_PATH||'/trayn-nutrition-prototypes/v4/';
const root=resolve('dist');const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.glb':'model/gltf-binary','.mp4':'video/mp4','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!pathname.startsWith(base))throw Error();const path=resolve(root,pathname.slice(base.length)||'index.html');if(relative(root,path).startsWith('..'))throw Error();const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 browser=await chromium.launch(chromiumOptions());
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('response',r=>{if(r.status()>=400)errors.push(r.url())});page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}${base}`,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.body.dataset.sceneReady==='true');await page.locator('#packaging').evaluate(el=>el.scrollIntoView());await page.locator('[data-view=back]').click();await page.locator('#flavour').evaluate(el=>el.scrollIntoView());await page.waitForTimeout(250);assert.deepEqual(errors,[]);assert.ok(await page.evaluate(()=>document.fonts.check('800 40px Manrope')));assert.equal(await page.locator('canvas').count(),1);
 console.log(`PASS: nested ${base} HTML, split modules, fonts, images, video and GLB resolve.`);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
