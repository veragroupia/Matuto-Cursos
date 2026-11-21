import {T,clamp} from './form.js';
import {room} from './room.js';
import {actor} from './actor.js';
import {act,objects,lens,actingTime} from './direction.js';
import cut from './cut.json';
export async function makeFilm(canvas,asset){
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
 let loader=new T.TextureLoader();
 const names=['recibo','verso','tira','caderno','cartaz','monitor','janela','madeira',...Array.from({length:6},(_,i)=>'campo-0'+(i+1))];
 const tx=await Promise.all(names.map(n=>loader.loadAsync(asset(n+'.jpg'))));
 const tex={};tx.forEach((m,i)=>{m.colorSpace=T.SRGBColorSpace;m.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());tex[names[i]]=m});
 tex.campo=tx.slice(-6);for(const page of tex.campo){page.repeat.set(.2,.2);page.generateMipmaps=false;page.minFilter=T.LinearFilter}
 const set=room(scene,tex),animate=actor(scene);
 const ctx=canvas.getContext('2d',{alpha:false});const vignette=ctx.createRadialGradient(width*.49,height*.46,height*.33,width*.5,height*.5,width*.69);
 vignette.addColorStop(0,'rgba(28,21,21,0)');vignette.addColorStop(1,'rgba(25,21,23,.24)');
 const wordAt=t=>cut.cues.find(c=>t>=c.s&&t<c.e);
 function label(t){
   const cap=wordAt(t);if(!cap)return;
   ctx.save();ctx.scale(width/1920,height/1080);ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.font='600 39px "Segoe UI", Arial, sans-serif';let w=ctx.measureText(cap.t).width;
   const y=1000,h=64;ctx.fillStyle='rgba(19,32,32,.88)';ctx.beginPath();ctx.roundRect((1920-w)/2-23,y-h/2,w+46,h,13);ctx.fill();
   ctx.fillStyle='#fff5dd';ctx.fillText(cap.t,960,y-1);ctx.restore();
 }
 function draw(frame){
   let t=frame/60,performanceTime=actingTime(t),p=act(performanceTime,frame);animate(p);objects(performanceTime,p,set);lens(performanceTime,cam);
   const archive=clamp(Math.floor((t-cut.clip)*15),0,Math.ceil(cut.cliplen*15)-1);
   const idx=archive%25,page=tex.campo[Math.floor(archive/25)];
   page.offset.set((idx%5)/5,(4-Math.floor(idx/5))/5);set.film.material.map=page;set.bar.scale.x=clamp((archive+1)/150,.002,1);
   renderer.render(scene,cam);ctx.drawImage(gl,0,0,width,height);ctx.fillStyle=vignette;ctx.fillRect(0,0,width,height);label(t);
 }
 return {draw,dispose(){scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose?.()});tx.forEach(m=>m.dispose());renderer.dispose()}}
}
