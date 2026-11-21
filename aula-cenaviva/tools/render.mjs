/* Exportador da aula (Windows, macOS ou Linux). Desenha cada quadro com a MESMA função do Remotion
   (src/aula/palco.js), sem relógio nem interpolação, e entrega JPEG intra-quadro ao FFmpeg.
   Uso:
     node tools/render.mjs segmento <ini> <fim> <saida.mp4>     # vídeo sem áudio, quadros [ini,fim]
     node tools/render.mjs quadros <n1,n2,...> <pasta>          # quadros soltos em JPEG
   Variáveis: CENAVIVA_CHROME (navegador), CENAVIVA_FFMPEG, CENAVIVA_ANGLE (d3d11 | swiftshader | gl), CENAVIVA_LARGURA. */
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import http from 'node:http';
import {spawn} from 'node:child_process';import {once} from 'node:events';import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';import WebSocket from 'ws';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));process.chdir(root);
const [modo,a,b,c]=process.argv.slice(2);const width=Number(process.env.CENAVIVA_LARGURA||1920);
const bundle=await build({absWorkingDir:root,entryPoints:['./tools/view-aula.js'],bundle:true,write:false,format:'iife',logLevel:'error'});
const html='<!doctype html><meta charset="utf-8"><style>*{margin:0}canvas{width:100vw;display:block}</style><canvas></canvas><script src="/bundle.js"></script>';
const MIME={'.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.wav':'audio/wav','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{const file=decodeURIComponent(new URL(req.url,'http://localhost').pathname.slice(1));
 if(!file)return res.end(html);if(file==='bundle.js'){res.setHeader('Content-Type','text/javascript');return res.end(bundle.outputFiles[0].contents)}
 const src=path.resolve(root,'public',file);if(!src.startsWith(path.resolve(root,'public'))||!fs.existsSync(src)){res.writeHead(404);return res.end()}
 res.setHeader('Content-Type',MIME[path.extname(src)]||'application/octet-stream');fs.createReadStream(src).pipe(res)});
server.listen(0,'127.0.0.1');await once(server,'listening');
const guess=process.platform==='win32'?path.join(root,'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe'):'/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const binary=process.env.CENAVIVA_CHROME||guess;
const angle=process.env.CENAVIVA_ANGLE||(process.platform==='win32'?'d3d11':'swiftshader');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'cenaviva-'));
const chrome=spawn(binary,['--headless','--remote-debugging-port=0','--remote-allow-origins=*','--user-data-dir='+profile,'--no-first-run','--no-sandbox','--use-gl=angle','--use-angle='+angle,'--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl','--disable-background-timer-throttling','about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
let ws,ff;
try{
 let trace='';const browser=await new Promise((resolve,reject)=>{chrome.stderr.on('data',s=>{trace+=s;const m=trace.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m)resolve(m[1]);trace=trace.slice(-8000)});chrome.once('error',reject);chrome.once('exit',code=>reject(Error('Chrome '+code+' '+trace)))});
 const port=new URL(browser).port,targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl,{maxPayload:60e6});await once(ws,'open');
 const pending=new Map();let id=0;ws.on('message',data=>{const m=JSON.parse(data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}});
 const call=(method,params)=>new Promise(r=>{pending.set(++id,r);ws.send(JSON.stringify({id,method,params}))});
 const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result?.exceptionDetails)throw Error(r.result.exceptionDetails.exception?.description||r.result.exceptionDetails.text);return r.result?.result?.value};
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/?w='+width});
 for(let n=0;n<240;n++){if(await ev('window.ready instanceof Promise ? window.ready.then(()=>true,e=>{throw e}) : false'))break;await new Promise(ok=>setTimeout(ok,300))}
 if(!await ev('Boolean(window.paint)'))throw Error('O palco WebGL não iniciou.');
 if(modo==='quadros'){
   fs.mkdirSync(b,{recursive:true});
   for(const n of a.split(',').map(Number)){fs.writeFileSync(path.join(b,'q'+String(n).padStart(5,'0')+'.jpg'),Buffer.from(await ev('window.paint('+n+')'),'base64'))}
 }else{
   const ini=Number(a),fim=Number(b),out=c;
   const exe=process.env.CENAVIVA_FFMPEG||'ffmpeg';
   ff=spawn(exe,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','60','-vcodec','mjpeg','-i','pipe:0','-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p','-r','60','-movflags','+faststart',out],{stdio:['pipe','ignore','inherit'],windowsHide:true});ff.stdin.on('error',()=>{});
   const t0=Date.now();
   for(let n=ini;n<=fim;n++){const jpg=Buffer.from(await ev('window.paint('+n+')'),'base64');if(!ff.stdin.write(jpg))await once(ff.stdin,'drain');
     if((n-ini)%300===0)console.log('quadro',n,'de',fim,'|',Math.round((Date.now()-t0)/1000),'s')}
   const done=once(ff,'exit');ff.stdin.end();const [code]=await done;if(code)throw Error('FFmpeg '+code);
   console.log('pronto',out,(fim-ini+1),'quadros em',Math.round((Date.now()-t0)/1000),'s');
 }
}finally{ws?.close();chrome.kill();server.close();setTimeout(()=>{try{fs.rmSync(profile,{recursive:true,force:true})}catch{}},800).unref()}
