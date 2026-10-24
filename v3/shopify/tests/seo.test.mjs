import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRenderer} from '../scripts/preview.mjs';

const jsonLd=html=>[...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map(match=>JSON.parse(match[1]));
const meta=(html,name)=>html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1];
const make=()=>{const renderer=createRenderer();renderer.globals.shop.url='https://theme.test';return renderer;};

test('every native landing template emits descriptions, canonical URLs and sharing metadata',async()=>{
 for(const type of ['index','product','collection','page','blog','article','cart','search','404']){
  const renderer=make();const html=await renderer.renderPage(type);
  assert.equal((html.match(/<title>/g)||[]).length,1,type);
  assert.ok(meta(html,'description')?.length>10,type);
  for(const field of ['og:title','og:description','og:type','og:url','og:image','twitter:card'])assert.ok(meta(html,field),`${type} ${field}`);
  assert.match(meta(html,'og:image'),/^https:\/\//,type);
  assert.match(html,/<link rel="canonical" href="https:\/\/theme.test\//,type);
  assert.equal(html.includes('Liquid error'),false,type);
  jsonLd(html);
 }
});

test('merchant search copy wins and encoded ampersands are escaped once',async()=>{
 const renderer=make();renderer.globals.page_description='Owner supplied description.';
 renderer.globals.shop.name='Owner supplied home title';
 const snippet=await renderer.engine.renderFile('snippets/seo-meta.liquid',{page_title:'A specific homepage title',canonical_url:'https://theme.test/'});
 assert.match(snippet,/<title>A specific homepage title — TRAYN Nutrition<\/title>/);
 assert.equal(meta(snippet,'description'),'Owner supplied description.');
 renderer.globals.request.page_type='product';
 const encoded=await renderer.engine.renderFile('snippets/seo-meta.liquid',{page_title:'TRAYN Whey Cookies &amp; Cream',canonical_url:'https://theme.test/products/cookies'});
 assert.match(encoded,/<title>TRAYN Whey Cookies &amp; Cream — TRAYN Nutrition<\/title>/);
 assert.doesNotMatch(encoded,/&amp;amp;/);
});

test('approved native product media and descriptions flow to page previews and native schema',async()=>{
 const renderer=make();const p=renderer.globals.product;
 p.description='<p>Owner approved fixture description.</p>';
 p.featured_image={src:'https://theme.test/approved-pack.webp',alt:'Approved fixture pack'};
 p.media=[{media_type:'image',preview_image:p.featured_image,alt:''},{media_type:'image',preview_image:{src:'https://theme.test/back.webp'},alt:'Approved back'}];
 const html=await renderer.renderPage('product');
 assert.equal(meta(html,'description'),'Owner approved fixture description.');
 assert.match(meta(html,'og:image'),/approved-pack.webp/);
 assert.match(html,/loading="eager" fetchpriority="high" alt="TRAYN Whey Belgian Chocolate"/);
 assert.match(html,/loading="lazy" fetchpriority="auto" alt="Approved back"/);
 const schema=jsonLd(html).find(item=>item['@type']==='Product');
 assert.equal(schema.image,p.featured_image.src);
 assert.equal(schema.description,'Owner approved fixture description.');
 assert.equal(schema.offers.price,'3299.00');assert.equal(schema.offers.priceCurrency,'INR');
 assert.match(schema.offers.availability,/OutOfStock$/);
 // Production uses the platform filter, not the fixture approximation above.
 assert.match(await readFile('sections/main-product.liquid','utf8'),/product \| structured_data/);
});

test('missing retail facts never turn campaign art into product schema or invented claims',async()=>{
 const renderer=make();const html=await renderer.renderPage('product');
 const schema=jsonLd(html).find(item=>item['@type']==='Product');
 assert.equal(schema.image,undefined);assert.equal(schema.description,'');
 assert.doesNotMatch(meta(html,'description'),/500|23 g|isolate|tested|certified/i);
 assert.equal(meta(html,'twitter:card'),'summary');
 assert.doesNotMatch(html,/Shipping policy ↗|Returns policy ↗|Terms of service ↗/);
});

test('approved detail blocks require both explicit approval and matching product identity',async()=>{
 const renderer=make();
 const block=(id,approved,text)=>({settings:{product:{id},approved,heading:'Ingredients',content:`<p>${text}</p>`}});
 const section={id:'test',settings:{},blocks:[block(10331931017504,true,'Approved matching detail'),block(10331931017504,false,'Unapproved detail'),block(999,true,'Wrong product detail')]};
 const html=await renderer.engine.renderFile('sections/main-product.liquid',{section});
 assert.match(html,/Approved matching detail/);assert.doesNotMatch(html,/Unapproved detail|Wrong product detail/);
});

test('Contact has a usable email fallback and policy links appear only for populated policies',async()=>{
 const renderer=make();let html=await renderer.renderPage('page');
 assert.match(html,/For product enquiries and customer support/);
 assert.match(html,/href="mailto:traynnutrition@gmail.com"/);
 assert.match(html,/href="\/pages\/contact">Contact TRAYN/);
 assert.match(html,/href="\/collections\/trayn-whey-collection">Shop all/);
 const policy={title:'Shipping policy',url:'/policies/shipping-policy',body:'Owner approved policy.'};
 renderer.globals.shop.policies=[policy];renderer.globals.shop.shipping_policy=policy;
 html=await renderer.renderPage('product');assert.match(html,/href="\/policies\/shipping-policy"/);
 renderer.globals.page.content='<p>Owner supplied contact content.</p>';
 html=await renderer.renderPage('page');assert.match(html,/Owner supplied contact content/);assert.doesNotMatch(html,/For product enquiries and customer support/);
});

test('blog and article templates render real content; empty blogs and utility pages are noindex',async()=>{
 const renderer=make();let html=await renderer.renderPage('blog');
 assert.equal(meta(html,'robots'),'noindex, follow');
 renderer.globals.blog.articles_count=1;renderer.globals.blog.articles=[{title:'Fixture article',url:'/blogs/news/fixture',published_at:'2026-10-23',excerpt:'<p>Fixture excerpt.</p>'}];
 html=await renderer.renderPage('blog');assert.equal(meta(html,'robots'),undefined);assert.match(html,/href="\/blogs\/news\/fixture"/);
 html=await renderer.renderPage('article');assert.equal(meta(html,'og:type'),'article');assert.ok(jsonLd(html).some(item=>item['@type']==='Article'));
 for(const type of ['cart','search','404'])assert.equal(meta(await renderer.renderPage(type),'robots'),'noindex, follow');
 assert.equal(meta(await renderer.renderPage('product'),'robots'),undefined);
});

test('canonical product URLs stay canonical in breadcrumb markup and dangerous title characters cannot close scripts',async()=>{
 const renderer=make();renderer.globals.product.title='Fixture </script> & "quoted"';
 const html=await renderer.renderPage('product');const breadcrumb=jsonLd(html).find(item=>item['@type']==='BreadcrumbList');
 assert.equal(breadcrumb.itemListElement.at(-1).name,renderer.globals.product.title);
 assert.equal(breadcrumb.itemListElement.at(-1).item,'https://theme.test/products/trayn-whey-rich-chocolate');
 assert.match(html,/Fixture &lt;\/script&gt; &amp; (?:&quot;|&#34;)quoted(?:&quot;|&#34;)/);
});

test('prepared retail content carries the exact approved tables and ordered media into product schema',async()=>{
 const renderer=createRenderer({retailContent:true});renderer.globals.shop.url='https://theme.test';
 const p=renderer.globals.product,html=await renderer.renderPage('product'),schema=jsonLd(html).find(item=>item['@type']==='Product');
 assert.equal(p.media.length,3);assert.match(schema.image,/front-retail.webp$/);
 assert.match(schema.description,/23 g protein \(dry basis\)/);assert.match(schema.description,/Contains milk/);
 assert.match(html,/retail-product-detail/);assert.doesNotMatch(html,/not an approved retail specification|pouch concept/);
 const label=await readFile('sections/trayn-label-artwork.liquid','utf8');
 const tables=[...label.matchAll(/<table>[\s\S]*?<\/table>/g)].map(m=>m[0].replaceAll(/ data-basis="[^"]*"/g,''));
 assert.equal(tables.length,4);for(const table of tables)assert.ok(p.description.includes(table),'Original label table must be preserved exactly');
 assert.ok(p.media.slice(1).every(m=>m.preview_image.src.includes('manufacturer-blank')));
 assert.equal(p.variants[0].available,false);assert.equal(p.variants[0].price,329900);
 assert.match(meta(html,'description'),/dry basis/);assert.doesNotMatch(meta(html,'description'),/certified|lab-tested|isolate/i);
 const collection=await renderer.renderPage('collection');assert.doesNotMatch(collection,/Vanilla|Mocha|Cookies/);
});

test('populating native product content preserves the homepage purchase scene and keeps details below product controls',async()=>{
 const bare=createRenderer(),retail=createRenderer({retailContent:true});
 const section=html=>html.match(/<section class="purchase-section[\s\S]*?<\/section>/)?.[0];
 assert.equal(section(await retail.renderPage('index')),section(await bare.renderPage('index')));
 const html=await retail.renderPage('product'),purchase=section(html);
 assert.match(purchase,/23 g protein/);assert.doesNotMatch(purchase,/<table>|retail-product-detail/);
 assert.ok(html.indexOf('retail-product-detail')>html.indexOf('data-add-button'));
});
