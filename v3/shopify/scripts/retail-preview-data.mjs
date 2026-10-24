// Reads prepared local content only; this module never calls Shopify.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {basename} from 'node:path';
import {fileURLToPath} from 'node:url';
const manifestUrl=new URL('../product-content/belgian-chocolate/product.json',import.meta.url);
export function applyRetailContent(product) {
 const record=JSON.parse(readFileSync(manifestUrl,'utf8'));
 if(product.handle!==record.handle)throw new Error('Retail preview content must match the exact product handle.');
 product.title=record.title;
 product.description=readFileSync(new URL(record.description_file,manifestUrl),'utf8');
 product.seo=record.seo;
 product.media=record.media.map((item,index)=>{
  const source=new URL(item.source_file,manifestUrl);
  const bytes=readFileSync(source);
  if(createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw new Error('Prepared product image checksum mismatch: '+item.source_file);
  const image={src:'/assets/'+basename(fileURLToPath(source)),alt:item.alt};
  return {id:'local-retail-'+(index+1),media_type:'image',preview_image:image,alt:item.alt};
 });
 product.featured_image=product.media[0].preview_image;
 return product;
}

