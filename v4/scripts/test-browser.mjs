import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';
const root=fileURLToPath(new URL('../',import.meta.url));
let server,port,code=1;
async function stop(){if(!server||server.exitCode!==null)return;server.kill('SIGTERM');await Promise.race([new Promise(resolve=>server.once('exit',resolve)),delay(3000)]);if(server.exitCode===null)server.kill('SIGKILL');}
process.once('SIGINT',()=>{stop().finally(()=>process.exit(130));});
process.once('SIGTERM',()=>{stop().finally(()=>process.exit(143));});
try{
 let url=process.env.TEST_URL;
 if(!url){
  const socket=createServer();await new Promise((resolve,reject)=>{socket.once('error',reject);socket.listen(0,'127.0.0.1',resolve);});port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
  server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:root,stdio:['ignore','pipe','pipe'],env:process.env});let log='';server.stdout.on('data',data=>log+=data);server.stderr.on('data',data=>log+=data);
  url=`http://127.0.0.1:${port}/`;let ready=false;
  for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error(`Vite exited: ${log}`);try{if((await fetch(url)).ok){ready=true;break;}}catch{}await delay(100);}
  if(!ready)throw Error(`Temporary test server did not start: ${log}`);
 }
 console.log(`Browser checks: ${url} (${process.env.BROWSER||'chromium'})`);
 const child=spawn(process.execPath,['--test','tests/browser.test.mjs'],{cwd:root,stdio:'inherit',env:{...process.env,TEST_URL:url}});
 code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',value=>resolve(value??1));});
}finally{await stop();}
process.exitCode=code;
