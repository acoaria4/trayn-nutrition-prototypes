import { defineConfig } from 'vite';
import {readFile} from 'node:fs/promises';
export default defineConfig({
  base: process.env.SITE_BASE_PATH || './',
  plugins:[{name:'local-version-picker',configureServer(server){server.middlewares.use('/versions/',async(_req,res)=>{let html=await readFile(new URL('../index.html',import.meta.url),'utf8');html=html.replaceAll('/trayn-nutrition-prototypes/v4/','/').replaceAll('/trayn-nutrition-prototypes/','https://trayn-nutrition-v2.blondridge1.chatgpt.site/');res.setHeader('Content-Type','text/html');res.end(html);});}}],
  build: { target: 'es2022', chunkSizeWarningLimit: 650 },
});
