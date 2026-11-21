// Palco único da aula: o piloto "O recibo" (quadros 0–4249, direção do Codex intocada)
// seguido dos 16 capítulos, no mesmo quarto, com o mesmo Matuto e a mesma luz.
import {T,V,clamp,ramp,box,plane,canvasTex} from '../form.js';
import {room} from '../room.js';
import {actor} from '../actor.js';
import {act,objects,lens,actingTime} from '../direction.js';
import cut from '../cut.json';
import {aula,INTRO,FPS,legendaEm,capituloEm} from './linha.js';
import {atuar,enquadrar,planos,planoEm,progresso} from './direcao.js';
import {tela,pagina,usaMonitor} from './telas.js';
import {carregarFontes} from './fontes.js';
import {fundirCena} from './otimizar.js';

const carregarImg=src=>new Promise((ok,err)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=err;i.src=src});

export async function montarPalco(canvas,asset){
  await carregarFontes(asset).catch(()=>{});
  const width=canvas.width,height=canvas.height,gl=document.createElement('canvas');
  const renderer=new T.WebGLRenderer({canvas:gl,antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.setSize(width,height,false);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.23;
  const scene=new T.Scene(),cam=new T.PerspectiveCamera(32,16/9,.025,28);
  scene.add(new T.HemisphereLight('#fff0d3','#d1b39e',1.75));
  const sun=new T.DirectionalLight('#ffdfad',2.45);sun.position.set(-2.9,4.0,2.1);sun.target.position.set(-.2,1,0);scene.add(sun,sun.target);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-2.7;sun.shadow.camera.right=2.7;sun.shadow.camera.top=2.4;sun.shadow.camera.bottom=-2.3;sun.shadow.normalBias=.007;sun.shadow.bias=-.00065;
  const rim=new T.DirectionalLight('#f9ba88',1.15);rim.position.set(1.0,2.85,-1.43);scene.add(rim);
  const fill=new T.DirectionalLight('#c9e4ef',.80);fill.position.set(1.1,1.95,2.0);scene.add(fill);
  const loader=new T.TextureLoader();
  const names=['recibo','verso','tira','caderno','cartaz','monitor','janela','madeira',...Array.from({length:6},(_,i)=>'campo-0'+(i+1))];
  const tx=await Promise.all(names.map(n=>loader.loadAsync(asset(n+'.jpg'))));
  const tex={};tx.forEach((m,i)=>{m.colorSpace=T.SRGBColorSpace;m.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());tex[names[i]]=m});
  tex.campo=tx.slice(-6);for(const page of tex.campo){page.repeat.set(.2,.2);page.generateMipmaps=false;page.minFilter=T.LinearFilter}
  const imgs={insights:await carregarImg(asset('insights.jpg')),retencao:await carregarImg(asset('retencao.jpg'))};
  const set=room(scene,tex),animate=actor(scene);

  // Tela viva do monitor (só na aula) e caderno aberto na mesa.
  const telaCanvas=document.createElement('canvas');telaCanvas.width=1600;telaCanvas.height=875;
  const telaTex=new T.CanvasTexture(telaCanvas);telaTex.colorSpace=T.SRGBColorSpace;telaTex.anisotropy=8;
  const monitorPlano=set.mon.children.find(o=>o.material?.map===tex.monitor);
  const pagCanvas=document.createElement('canvas');pagCanvas.width=1600;pagCanvas.height=900;
  const pagTex=new T.CanvasTexture(pagCanvas);pagTex.colorSpace=T.SRGBColorSpace;pagTex.anisotropy=8;
  const cadernoAberto=new T.Group();scene.add(cadernoAberto);cadernoAberto.position.set(.31,.872,.635);
  box(cadernoAberto,0,0,0,.63,.012,.36,'#8f5f43',.004);
  const folhaMesh=plane(cadernoAberto,0,.0068,0,.60,.3375,pagTex,true);folhaMesh.rotation.x=-Math.PI/2;folhaMesh.receiveShadow=true;
  cadernoAberto.visible=false;
  // Geometria estática fundida por material (menos chamadas de desenho, mesma imagem).
  const otimizar=true;
  const fundirGeometria=/fundir/.test(globalThis.location?.search||'');
  if(fundirGeometria){const [a,d]=fundirCena(scene,new Set([set.bar,set.film,folhaMesh]));console.log('malhas fundidas',a,'→',d)}
  let ultimoPlano=-1;

  const ctx=canvas.getContext('2d',{alpha:false});
  const vignette=ctx.createRadialGradient(width*.49,height*.46,height*.33,width*.5,height*.5,width*.69);
  vignette.addColorStop(0,'rgba(28,21,21,0)');vignette.addColorStop(1,'rgba(25,21,23,.24)');
  const caixa=(texto,y=1000,fonte='600 39px "Segoe UI", Inter, Arial, sans-serif')=>{
    ctx.save();ctx.scale(width/1920,height/1080);ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=fonte;const w=ctx.measureText(texto).width;const h=64;ctx.fillStyle='rgba(19,32,32,.88)';ctx.beginPath();ctx.roundRect((1920-w)/2-23,y-h/2,w+46,h,13);ctx.fill();
    ctx.fillStyle='#fff5dd';ctx.fillText(texto,960,y-1);ctx.restore();
  };
  // Marcador discreto de capítulo nos primeiros segundos de cada um.
  function capitulo(frame){
    const i=capituloEm(frame),c=aula.chapters[i],t=(frame-c.fromFrame)/FPS;
    const a=ramp(t,.15,.6)*(1-ramp(t,3.4,3.9));if(a<=0)return;
    ctx.save();ctx.scale(width/1920,height/1080);ctx.globalAlpha=a;
    const x=72+(1-a)*-30,y=86;
    ctx.font='700 22px "JetBrains Mono", monospace';const num=String(i+1).padStart(2,'0')+' / '+aula.chapters.length;
    ctx.font='600 40px "Source Serif 4", Georgia, serif';const w=Math.max(ctx.measureText(c.title).width,220);
    ctx.fillStyle='rgba(19,32,32,.86)';ctx.beginPath();ctx.roundRect(x-26,y-50,w+52,118,14);ctx.fill();
    ctx.fillStyle='#e2956b';ctx.fillRect(x-26,y-50,8,118);
    ctx.font='700 22px "JetBrains Mono", monospace';ctx.fillStyle='#9fc2a9';ctx.fillText(num,x,y-14);
    ctx.font='600 40px "Source Serif 4", Georgia, serif';ctx.fillStyle='#fff5dd';ctx.fillText(c.title,x,y+40);
    ctx.restore();
  }

  // Estado final do piloto para os objetos da mesa.
  const fimPiloto={lift:0,hands:[V(-.9,1,.3),V(-.15,1,.3)]};
  let telaChave='',pagChave='';
  function telaInicio(c){
    const g=c;g.save();g.scale(1600/1280,875/700);g.fillStyle='#172a2c';g.fillRect(0,0,1280,700);
    g.font='36px "Barlow Semi Condensed", sans-serif';g.fillStyle='#f6e3b4';g.fillText('CENAVIVA',44,62);
    g.font='bold 16px "JetBrains Mono", monospace';g.fillStyle='#9fc2a9';g.fillText('ILHA DE EDIÇÃO',46,96);
    g.font='italic 600 54px "Source Serif 4", serif';g.fillStyle='#f6e3b4';g.fillText('Aula de',44,330);
    g.font='bold 86px "Source Serif 4", serif';g.fillText('boas-vindas',44,420);
    g.font='bold 20px "JetBrains Mono", monospace';g.fillStyle='#e2956b';g.fillText('O RECIBO · CAPÍTULOS 1–16',46,480);g.restore();
  }

  function desenharAula(frame){
    const t=frame/FPS,p=atuar(frame),b=p.beat,pl=p.plano;
    animate(p);
    objects(actingTime(cut.frames/60),fimPiloto,set);
    set.receipt.position.set(-.60,.882,.66);set.receipt.rotation.set(-Math.PI/2,0,.10);
    set.receiptShadow.position.set(-.60,.875,.66);
    set.book.visible=false;set.film.visible=false;set.bar.visible=false;cadernoAberto.visible=true;
    // monitor: tela do beat (se for de monitor) ou tela de início
    if(monitorPlano)monitorPlano.material.map=telaTex;
    if(usaMonitor(b.action)){tela(telaCanvas.getContext('2d'),b.action,progresso(b,t),t-b.s,imgs);telaTex.needsUpdate=true;telaChave=''}
    else if(telaChave!=='inicio'){telaInicio(telaCanvas.getContext('2d'));telaTex.needsUpdate=true;telaChave='inicio'}
    // caderno: página do beat de mesa; senão mantém a última
    if(['desk','paper','proof'].includes(b.shot)&&!usaMonitor(b.action)){
      const u=progresso(b,t),chave=b.action+':'+Math.round(u*120);
      if(chave!==pagChave){pagina(pagCanvas.getContext('2d'),b.action,u,imgs);pagTex.needsUpdate=true;pagChave=chave}
    }else if(!pagChave){pagina(pagCanvas.getContext('2d'),'tema',0,imgs);pagTex.needsUpdate=true;pagChave='inicial'}
    enquadrar(t,cam);
    // Nos planos de monitor e de caderno nada que projeta sombra entra em quadro: congela o mapa de sombras.
    const k=planoEm(t),fixo=(pl.tela||pl.mesa)&&otimizar;
    renderer.shadowMap.autoUpdate=!fixo;if(fixo&&k!==ultimoPlano)renderer.shadowMap.needsUpdate=true;ultimoPlano=k;
    renderer.render(scene,cam);ctx.drawImage(gl,0,0,width,height);ctx.fillStyle=vignette;ctx.fillRect(0,0,width,height);
    capitulo(frame);
    const cap=legendaEm(t);if(cap)caixa(cap.t);
  }
  function desenharPiloto(frame){
    renderer.shadowMap.autoUpdate=true;ultimoPlano=-1;
    set.book.visible=true;set.film.visible=true;set.bar.visible=true;cadernoAberto.visible=false;
    if(monitorPlano)monitorPlano.material.map=tex.monitor;
    const t=frame/60,performanceTime=actingTime(t),p=act(performanceTime,frame);animate(p);objects(performanceTime,p,set);lens(performanceTime,cam);
    const archive=clamp(Math.floor((t-cut.clip)*15),0,Math.ceil(cut.cliplen*15)-1);
    const idx=archive%25,page=tex.campo[Math.floor(archive/25)];
    page.offset.set((idx%5)/5,(4-Math.floor(idx/5))/5);set.film.material.map=page;set.bar.scale.x=clamp((archive+1)/150,.002,1);
    renderer.render(scene,cam);ctx.drawImage(gl,0,0,width,height);ctx.fillStyle=vignette;ctx.fillRect(0,0,width,height);
    const c=cut.cues.find(c=>t>=c.s&&t<c.e);if(c)caixa(c.t);
  }
  return {
    frames:aula.frames,intro:INTRO,
    draw(frame){frame<INTRO?desenharPiloto(frame):desenharAula(frame)},
    info:()=>renderer.info.render,
    dispose(){scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose?.()});tx.forEach(m=>m.dispose());telaTex.dispose();pagTex.dispose();renderer.dispose()}
  };
}
