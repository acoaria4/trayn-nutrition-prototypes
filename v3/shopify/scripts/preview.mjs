// Local-only Liquid approximation. Shopify's renderer remains the final authority.
import { Liquid } from 'liquidjs';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { resolve, extname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseShopifyJson } from './shopify-json.mjs';
import { applyRetailContent } from './retail-preview-data.mjs';
export const productFixture={id:10331931017504,title:'TRAYN Whey Belgian Chocolate',handle:'trayn-whey-rich-chocolate',url:'/products/trayn-whey-rich-chocolate',description:'',media:[],available:false,has_only_default_variant:true,requires_selling_plan:false,variants:[{id:51737000116512,title:'Default Title',price:329900,available:false,quantity_rule:{min:1,increment:1,max:null}}]};
productFixture.selected_or_first_available_variant=productFixture.variants[0];
export function createRenderer({available=false,currency='INR',retailContent=false}={}) {
 const p=structuredClone(productFixture);p.available=available;p.variants[0].available=available;p.selected_or_first_available_variant=p.variants[0];
 if(retailContent)applyRetailContent(p);
 const cart={item_count:0,items:[],currency:{iso_code:currency},total_price:0,taxes_included:false,cart_level_discount_applications:[]};
 const collection={title:'TRAYN Whey Collection',url:'/collections/trayn-whey-collection',description:'',products:[p],products_count:1};
 const contact={title:'Contact',handle:'contact',url:'/pages/contact',content:''};
 const blog={title:'News',url:'/blogs/news',articles:[],articles_count:0};
 const globals={product:p,collection,collections:{'trayn-whey-collection':collection},page:contact,pages:{contact},blog,article:{title:'Local preview article',url:'/blogs/news/local-preview',author:'Preview author',published_at:'2026-10-23',content:'<p>Local fixture content.</p>',excerpt_or_content:'Local fixture content.'},settings:{featured_product:p},shop:{name:'TRAYN Nutrition',url:'http://127.0.0.1:4180',currency,email:'traynnutrition@gmail.com',policies:[],refund_policy:{body:''},shipping_policy:{body:''},terms_of_service:{body:''}},routes:{root_url:'/',cart_url:'/cart',cart_add_url:'/cart/add',cart_change_url:'/cart/change',all_products_collection_url:'/collections/all',search_url:'/search'},request:{locale:{iso_code:'en'},page_type:'index'},cart,canonical_url:'http://127.0.0.1:4180/',page_title:'TRAYN Nutrition',page_description:'',current_page:1,content_for_header:''};
 globals.shop.url=`http://127.0.0.1:${Number(process.env.PORT)||4180}`;globals.canonical_url=globals.shop.url+'/';
 const engine=new Liquid({root:['.','snippets','sections','layout'],extname:'.liquid',globals});
 const translations=parseShopifyJson(readFileSync('locales/en.default.json','utf8'));
 engine.registerFilter('t',key=>key.split('.').reduce((value,part)=>value?.[part],translations) || key);
 engine.registerFilter('asset_url',name=>`/assets/${name}?v=local-preview`);
 engine.registerFilter('stylesheet_tag',url=>`<link rel="stylesheet" href="${url}">`);
 engine.registerFilter('preload_tag',url=>`<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin>`);
 const escapeAttribute=value=>String(value??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 engine.registerFilter('image_url',(image,...args)=>{const width=args.find(v=>Array.isArray(v)&&v[0]==='width')?.[1];const src=typeof image==='string'?image:image?.src;if(!src)return '';return `${src}${src.includes('?')?'&':'?'}width=${width||1200}`;});
 engine.registerFilter('image_tag',(src,...args)=>`<img src="${escapeAttribute(src)}" ${args.filter(Array.isArray).filter(([key])=>!['widths'].includes(key)).map(([key,value])=>`${key}="${escapeAttribute(value)}"`).join(' ')}>`);
 // Fixture approximation of Shopify's native filter, not a production serializer.
 engine.registerFilter('structured_data',value=>{
  if(value===globals.article)return JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:value.title,author:{'@type':'Person',name:value.author},datePublished:value.published_at}).replaceAll('<','\\u003c');
  const variant=value.selected_or_first_available_variant||value.variants[0];
  const schema={'@context':'https://schema.org','@type':'Product',name:value.title,description:(value.description||'').replace(/<[^>]*>/g,''),offers:{'@type':'Offer',price:(variant.price/100).toFixed(2),priceCurrency:currency,availability:`https://schema.org/${variant.available?'InStock':'OutOfStock'}`,url:new URL(value.url,globals.shop.url).href}};
  if(value.featured_image?.src)schema.image=new URL(value.featured_image.src,globals.shop.url).href;
  return JSON.stringify(schema).replaceAll('<','\\u003c');
 });
 engine.registerFilter('default_pagination',()=> '');
 const money=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency}).format(Number(v)/100);
 engine.registerFilter('money_with_currency',v=>currency==='INR'?money(v):`${money(v)} ${currency}`);engine.registerFilter('money',money);engine.registerFilter('money_without_trailing_zeros',v=>new Intl.NumberFormat('en-IN',{style:'currency',currency,minimumFractionDigits:Number(v)%100?2:0,maximumFractionDigits:2}).format(Number(v)/100));engine.registerFilter('default_errors',()=> '');
 engine.registerTag('schema',{parse(token,tokens){this.liquid.parser.parseStream(tokens).on('tag:endschema',function(){this.stop();}).start();},render(){return '';}});
 engine.registerTag('doc',{parse(token,tokens){this.liquid.parser.parseStream(tokens).on('tag:enddoc',function(){this.stop();}).start();},render(){return '';}});
 engine.registerTag('form',{parse(token,tokens){this.type=token.args.split(',')[0].replaceAll("'",'').trim();this.id=token.args.match(/id:\s*([a-z_]+)/)?.[1];this.tpl=[];const templates=this.tpl;this.liquid.parser.parseStream(tokens).on('template',tpl=>templates.push(tpl)).on('tag:endform',function(){this.stop();}).start();},*render(ctx,emitter){const id=this.id?yield this.liquid.evalValue(this.id,ctx):'form';emitter.write(`<form method="post" action="${this.type==='product'?'/cart/add':'/password'}" id="${id}" class="purchase-form" ${this.type==='product'?'data-product-form':''}>`);yield this.liquid.renderer.renderTemplates(this.tpl,ctx,emitter);emitter.write('</form>');}});
 engine.registerTag('section',{parse(token){this.name=token.args.replaceAll("'",'').trim();},async render(){return `<div id="shopify-section-${this.name}" class="shopify-section">${await renderSection(this.name,{id:this.name,settings:{}})}</div>`;}});
 engine.registerTag('paginate',{parse(token,tokens){this.tpl=[];const templates=this.tpl;this.liquid.parser.parseStream(tokens).on('template',tpl=>templates.push(tpl)).on('tag:endpaginate',function(){this.stop();}).start();},*render(ctx,emitter){yield this.liquid.renderer.renderTemplates(this.tpl,ctx,emitter);}});
 async function renderSection(type,section){const source=await readFile(`sections/${type}.liquid`,'utf8');const match=source.match(/{% schema %}([\s\S]*?){% endschema %}/);const defaults=Object.fromEntries((match?JSON.parse(match[1]).settings:[]).filter(s=>s.default!==undefined).map(s=>[s.id,s.default]));section.settings={...defaults,...section.settings};return engine.renderFile(`sections/${type}.liquid`,{section});}
 async function renderPage(page='index') {
  globals.request.page_type=page;
  const resource=page==='product'?globals.product:page==='collection'?globals.collection:page==='page'?globals.page:page==='article'?globals.article:page==='blog'?globals.blog:null;
  globals.page_title=resource?.title || (page==='index'?globals.shop.name:page==='cart'?'Your cart':page==='404'?'Page not found':'Search');
  if(retailContent){globals.page_description=page==='product'?p.seo.description:'';if(page==='product')globals.page_title=p.seo.title;}
  globals.canonical_url=new URL(resource?.url || (page==='index'?'/':`/${page}`),globals.shop.url).href;
  globals.page_image=page==='product'?globals.product.featured_image:page==='collection'?globals.collection.image:page==='article'?globals.article.image:null;
  const template=parseShopifyJson(await readFile(`templates/${page}.json`,'utf8'));
  let content='';
  for(const id of template.order){const section=template.sections[id];content+=`<div class="shopify-section">${await renderSection(section.type,{id,settings:section.settings||{}})}</div>`;}
  const rendered=await engine.renderFile('layout/theme.liquid',{content_for_layout:content});
  const notice=retailContent?'Local review · confirmed product content · sample price and stock · checkout disabled':'Local Shopify theme preview · no real purchases';
  return rendered.replace('<body ', '<body data-local-preview="true" ').replace('<main id="MainContent"',`<p style="margin:0;padding:8px 24px;background:#151313;color:#c8c4c0;font:12px sans-serif">${notice}</p><main id="MainContent"`);
 }
 return {renderPage,engine,globals};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const demos=new Map();
 const updateDemo=(demo,quantity)=> {
  const product=demo.globals.product;
  Object.assign(demo.globals.cart,{item_count:quantity,total_price:quantity*product.variants[0].price,items:quantity?[{key:'local-demo-line',product,variant:product.variants[0],quantity,url:product.url,url_to_remove:'/cart',final_line_price:quantity*product.variants[0].price,properties:[],line_level_discount_allocations:[]}]:[]});
 };
 const mime={'.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.pdf':'application/pdf'};
 createServer(async(req,res)=> {
  try {
   const url=new URL(req.url,'http://127.0.0.1');
   if(url.pathname.startsWith('/assets/')){const path=resolve(`.${url.pathname}`);const assetPath=relative(resolve('assets'),path);if(assetPath.startsWith('..')||isAbsolute(assetPath))throw new Error('Invalid path');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path));return;}
   let demo=demos.get(req.headers.cookie?.match(/(?:^|; )trayn_cart_demo=([^;]+)/)?.[1]);
   if(url.searchParams.get('demo')==='cart' && !demo) {
    const id=randomUUID();demo=createRenderer({available:true,retailContent:true});demos.set(id,demo);
    res.setHeader('Set-Cookie',`trayn_cart_demo=${id}; Path=/; HttpOnly; SameSite=Lax`);
   }
   if(demo && ['/cart.js','/cart/add.js','/cart/change.js'].includes(url.pathname)) {
    if(url.pathname!=='/cart.js') {
     const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
     const payload=url.pathname==='/cart/add.js'?await new Request(url,{method:'POST',headers:req.headers,body}).formData():JSON.parse(body.toString());
     const quantity=url.pathname==='/cart/add.js'?demo.globals.cart.item_count+Number(payload.get('quantity')):Number(payload.quantity);
     if(!Number.isInteger(quantity)||quantity<0||quantity>99){res.writeHead(422,{'Content-Type':'application/json'});res.end(JSON.stringify({description:'Use a quantity from 0 to 99 in this local demo.'}));return;}
     updateDemo(demo,quantity);
    }
    res.setHeader('Content-Type','application/json');res.end(JSON.stringify(demo.globals.cart));return;
   }
   if(demo && url.searchParams.get('section_id')==='cart-content') {
    res.setHeader('Content-Type','text/html');res.end(await demo.engine.renderFile('sections/cart-content.liquid'));return;
   }
   if(req.method==='POST' && url.pathname==='/cart'){res.writeHead(400,{'Content-Type':'text/plain'});res.end('Checkout is disabled in the local preview. No order was created.');return;}
   if(url.pathname.endsWith('.js')||url.searchParams.has('section_id')){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({message:'Shopping is not connected in the local preview. Use the unpublished Shopify theme.'}));return;}
   const page=url.pathname.startsWith('/products/')?'product':url.pathname==='/cart'?'cart':url.pathname.startsWith('/collections/')?'collection':url.pathname.startsWith('/pages/')?'page':url.pathname.startsWith('/blogs/')?(url.pathname.split('/').filter(Boolean).length>2?'article':'blog'):'index';
   res.setHeader('Content-Type','text/html');let html=await (demo||createRenderer({retailContent:true})).renderPage(page);
   if(demo) html=html.replace('Local review · confirmed product content · sample price and stock · checkout disabled','LOCAL CART DEMO · sample price and stock · checkout disabled').replaceAll('name="checkout"','name="checkout" disabled').replace('>Checkout <span','>Checkout disabled in demo <span');
   res.end(html);
  }catch(error){res.writeHead(500,{'Content-Type':'text/plain'});res.end(error.stack);}
 }).listen(Number(process.env.PORT)||4180,'127.0.0.1',()=>console.log(`Local Shopify preview: http://127.0.0.1:${Number(process.env.PORT)||4180}/ (checkout disabled; add ?demo=cart for a sample cart)`));
}
