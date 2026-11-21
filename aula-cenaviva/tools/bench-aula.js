import {montarPalco} from '../src/aula/palco.js';
const canvas=document.querySelector('canvas');canvas.width=1920;canvas.height=1080;
window.ready=montarPalco(canvas,n=>'/'+n).then(f=>{window.drawOnly=n=>{f.draw(n);window.calls=f.info().calls};window.encode=()=>canvas.toDataURL('image/jpeg',.94);window.paint=1;return true});
