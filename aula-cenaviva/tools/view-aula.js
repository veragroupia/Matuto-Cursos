import {montarPalco} from '../src/aula/palco.js';
const p=new URLSearchParams(location.search);const canvas=document.querySelector('canvas');
canvas.width=Number(p.get('w')||1920);canvas.height=Math.round(canvas.width*9/16);
window.ready=montarPalco(canvas,n=>'/'+n).then(f=>{window.paint=(n,q)=>{f.draw(n);return canvas.toDataURL('image/jpeg',q||.94).split(',')[1]};window.frames=f.frames;window.intro=f.intro;return true});
