/* Exporteur local déterministe : même fonction de dessin que la composition Remotion.
   Capture par JPEG intra-image, sans horloge de lecture ni interpolation. */
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import http from 'node:http';
import {spawn} from 'node:child_process';import {once} from 'node:events';import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';import WebSocket from 'ws';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));process.chdir(root);
const width=Number(process.argv[2]||1920),spec=process.argv[3]||'all';
const out=process.argv[4]||'entrega/CenaViva-O-Recibo.mp4';
const bundle=await build({absWorkingDir:root,entryPoints:['./tools/view.js'],bundle:true,write:false,format:'iife',logLevel:'error'});
const html='<!doctype html><meta charset="utf-8"><style>*{margin:0}canvas{width:100vw;display:block}</style><canvas></canvas><script src="/bundle.js"></script>';
const server=http.createServer((req,res)=>{let file=new URL(req.url,'http://localhost').pathname.slice(1);
 if(!file)return res.end(html);if(file==='bundle.js'){res.setHeader('Content-Type','text/javascript');return res.end(bundle.outputFiles[0].contents)}
 if(!/^[a-z0-9._-]+$/i.test(file)){res.writeHead(403);return res.end()}
 let src=path.join(root,'public',file);if(!fs.existsSync(src)){res.writeHead(404);return res.end()}res.setHeader('Content-Type','image/jpeg');fs.createReadStream(src).pipe(res)});
server.listen(0,'127.0.0.1');await once(server,'listening');
const binary=process.env.CENAVIVA_CHROME||path.join(root,'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'cenaviva-'));
const chrome=spawn(binary,['--headless','--remote-debugging-port=0','--remote-allow-origins=*','--user-data-dir='+profile,'--no-first-run','--no-sandbox','--use-gl=angle','--use-angle='+(process.env.CENAVIVA_ANGLE||(process.platform==='win32'?'d3d11':'swiftshader')),'--ignore-gpu-blocklist','--enable-webgl','--disable-background-timer-throttling','about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
let ws,ff;
try{
 let trace='';const browser=await new Promise((resolve,reject)=>{chrome.stderr.on('data',s=>{trace+=s;let a=trace.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(a)resolve(a[1]);trace=trace.slice(-8000)});chrome.once('error',reject);chrome.once('exit',code=>reject(Error('Chrome '+code+' '+trace)))});
 const port=new URL(browser).port,targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl,{maxPayload:30e6});await once(ws,'open');
 const pending=new Map();let id=0;ws.on('message',data=>{let a=JSON.parse(data);if(pending.has(a.id)){pending.get(a.id)(a);pending.delete(a.id)}});
 const call=(method,params)=>new Promise(resolve=>{pending.set(++id,resolve);ws.send(JSON.stringify({id,method,params}))});
 async function ev(expression){const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result?.exceptionDetails)throw Error(r.result.exceptionDetails.exception?.description||r.result.exceptionDetails.text);return r.result?.result?.value}
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/?w='+width});
 for(let n=0;n<180;n++){if(await ev('window.ready || false'))break;await new Promise(ok=>setTimeout(ok,350))}
 if(!await ev('Boolean(window.paint)'))throw Error('Le rendu WebGL ne s’est pas initialisé.');
 const total=await ev('window.frames'),isList=spec!=='all'&&!spec.includes('-');
 const list=isList?spec.split(',').map(Number):null;const [start,end]=spec==='all'?[0,total-1]:spec.split('-').map(Number);
 if(!isList){
  const bundled=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
  const exe=process.env.CENAVIVA_FFMPEG||(fs.existsSync(bundled)?bundled:'ffmpeg');
  ff=spawn(exe,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','60','-vcodec','mjpeg','-i','pipe:0','-ss',String(start/60),'-i',process.env.CENAVIVA_AUDIO||'public/mix.wav','-map','0:v','-map','1:a','-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-t',String((end-start+1)/60),out],{stdio:['pipe','ignore','inherit'],windowsHide:true});ff.stdin.on('error',()=>{});
 }
 const since=Date.now();for(let k=0;k<(list?.length??end-start+1);k++){
   const n=isList?list[k]:start+k;const jpg=Buffer.from(await ev('window.paint('+n+')'),'base64');
   if(isList)fs.writeFileSync('revisao/frame-'+n+'.jpg',jpg);
   else if(!ff.stdin.write(jpg))await once(ff.stdin,'drain');
   if(k%300===0)console.log('Frame',n,'/',total,'|',Math.round((Date.now()-since)/1000),'s')
 }
 if(ff){const done=once(ff,'exit');ff.stdin.end();const [code]=await done;if(code)throw Error('FFmpeg '+code)}
}finally{ws?.close();chrome.kill();server.close();setTimeout(()=>{try{fs.rmSync(profile,{recursive:true,force:true})}catch{}},800).unref()}
