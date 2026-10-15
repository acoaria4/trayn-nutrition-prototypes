// Read-only verification of the selected preview or published storefront.
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const preview=process.env.SHOPIFY_TEST_URL || 'https://trayn-nutrition.myshopify.com?preview_theme_id=192540770592';
const expectedRole=process.env.SHOPIFY_TEST_ROLE || 'unpublished';
await mkdir('artifacts',{recursive:true});
for(const [name,engine,options,width,height] of [['desktop',chromium,{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'},1280,650],['mobile',webkit,{},390,844]]) {
 const browser=await engine.launch({...options,headless:true});
 try {
  const page=await browser.newPage({viewport:{width,height}});page.setDefaultTimeout(12000);
  const errors=[],analyticsBlocked=[],badAssets=[];
  page.on('pageerror',e=>{
   if(/^\/(monorail-edge|error-analytics-sessions-production)\.shopifysvc\.com\/.*due to access control checks\.$/.test(e.message)) analyticsBlocked.push(e.message);
   else errors.push(e.message);
  });
  page.on('response',r=>{if(r.status()>=400 && /\/assets\/(trayn|barlow|manrope|belgian|tension)/.test(r.url()))badAssets.push(r.url());});
  const response=await page.goto(preview,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
  await page.waitForFunction(()=>document.querySelector('.hero-story')?.dataset.scrollDistance==='2040');
  assert.equal(await page.evaluate(()=>Shopify.theme.id),192540770592);
  assert.equal(await page.evaluate(()=>Shopify.theme.role),expectedRole);
  await page.locator('#purchase').evaluate(el=>el.scrollIntoView());
  await page.waitForFunction(()=>{const img=document.querySelector('.purchase-flavour-image');return img?.complete && img.naturalWidth>0;});
  assert.match(await page.locator('.purchase-flavour-image').getAttribute('src'),/belgian-chocolate-flavour/);
  await page.waitForFunction(()=>document.querySelector('.mindset-poster').dataset.motionEnd);
  const interval=await page.locator('.mindset-poster').evaluate(el=>({start:Number(el.dataset.motionStart),end:Number(el.dataset.motionEnd)}));
  assert.ok(interval.end-interval.start>(width>=900?780:540));
  const positions=[];
  for(const phase of [.1,.5,.85]) {
   await page.evaluate(y=>window.scrollTo(0,y),interval.start+(interval.end-interval.start)*phase);await page.waitForTimeout(120);
   const states=await page.locator('.mindset-word').evaluateAll(words=>words.map(el=>({x:new DOMMatrix(getComputedStyle(el).transform).m41,progress:Number(el.dataset.motionProgress),y:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,header:document.querySelector('.study-header').offsetHeight})));
   assert.equal(states[0].progress,states[1].progress);assert.ok(Math.abs(states[0].progress-phase)<.05);
   assert.ok(states[0].y>states[0].header+10 && states[1].y<height-24);
   if(phase>.8) assert.ok(states.every(s=>s.bottom<height-24));
   positions.push(states.map(s=>s.x));
   await page.screenshot({path:`artifacts/shopify-${name}-mindset-${Math.round(phase*100)}.png`});
  }
  assert.ok(positions[2][0]-positions[0][0]>(width>=900?210:100));
  assert.ok(positions[0][1]-positions[2][1]>(width>=900?210:100));
  assert.equal(await page.locator('.pin-spacer').count(),2);
  await page.screenshot({path:`artifacts/shopify-${name}-mindset.png`});
  const redY=await page.locator('.product-intro').evaluate(el=>{const header=document.querySelector('.study-header').offsetHeight;return el.getBoundingClientRect().top+scrollY-header-(innerHeight-header)*.48;});
  await page.evaluate(y=>window.scrollTo(0,y),redY);await page.waitForTimeout(120);
  assert.ok(Math.abs(Number(await page.locator('.product-section').getAttribute('data-takeover-progress'))-.5)<.05);
  await page.screenshot({path:`artifacts/shopify-${name}-red-reveal.png`});
  await page.locator('[data-study-inspect]').click();
  await page.getByRole('button',{name:'Back Label',exact:true}).click();
  await page.locator('[data-inspector-image]').evaluate(img=>img.decode());
  assert.match(await page.locator('[data-inspector-image]').getAttribute('src'),/\.webp\?/);
  await page.keyboard.press('Escape');
  await page.locator('#purchase').evaluate(el=>el.scrollIntoView());await page.waitForTimeout(200);
  assert.ok(Math.abs((await page.locator('.study-header').boundingBox()).y)<1);
  assert.ok(await page.locator('[data-add-button]').isDisabled());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`artifacts/shopify-${name}-purchase.png`});
  await page.locator('[data-cart-open]').click();
  await page.waitForFunction(()=>document.querySelector('[data-cart-status]').textContent==='');
  assert.ok(await page.locator('#cart-drawer').evaluate(el=>el.open));
  assert.ok(await page.locator('[data-checkout]').isHidden());
  await page.keyboard.press('Escape');
  await page.locator('#product').evaluate(el=>el.scrollIntoView());
  await page.locator('#full-nutrition summary').click();
  assert.ok(await page.locator('#full-nutrition').evaluate(el=>el.open));
  const layout=await page.locator('.label-reader').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:innerWidth-r.right};});assert.ok(layout.left>=7.9 && layout.right>=7.9);
  if(width<900){await page.getByRole('radio',{name:'Per 100 g',exact:true}).check();assert.ok(await page.locator('#full-nutrition [data-basis="100g"]').first().isVisible());}
  await page.goto(new URL('/products/trayn-whey-rich-chocolate',page.url()).href,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('[data-purchase]')?.dataset.commerceReady==='true');
  assert.equal(await page.locator('.hero-story').count(),0);assert.match(await page.locator('h1').innerText(),/TRAYN WHEY BELGIAN CHOCOLATE/);
  assert.ok(await page.locator('[data-add-button]').isDisabled());
  assert.deepEqual(errors,[]);assert.deepEqual(badAssets,[]);
  if(analyticsBlocked.length) console.log(`${name}: ${analyticsBlocked.length} Shopify analytics requests blocked by browser access controls; storefront assertions passed.`);
  console.log(`${name}: ${expectedRole} theme, sticky header, hero, inspector, flavour image, large visible typography sequence, visible red wipe, Shopify cart rendering, reader and product route PASS`);
 } finally {await browser.close();}
}
