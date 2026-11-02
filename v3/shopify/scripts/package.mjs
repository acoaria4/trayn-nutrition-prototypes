import { mkdir, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const dirs=['assets','config','layout','locales','sections','snippets','templates'];
await mkdir('artifacts',{recursive:true});
execFileSync('/usr/bin/zip',['-q','-r','artifacts/trayn-slipstream-theme.zip',...dirs]);
console.log(`Theme archive: artifacts/trayn-slipstream-theme.zip (${(await stat('artifacts/trayn-slipstream-theme.zip')).size} bytes)`);
