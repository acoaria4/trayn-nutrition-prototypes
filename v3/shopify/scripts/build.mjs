import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
await build({entryPoints:['scripts/storefront-entry.js'],bundle:true,minify:true,format:'iife',target:'es2022',outfile:'assets/trayn.js',legalComments:'eof'});
const css=(await readFile('scripts/reference/v3.css','utf8')).replace(/\/(?:images|fonts)\/([A-Za-z0-9_./-]+)/g,(_,path)=>path.split('/').at(-1));
await writeFile('assets/trayn.css',`${css}\n${await readFile('scripts/commerce.css','utf8')}`);
console.log('Built theme assets. Liquid sections and store settings preserved.');
