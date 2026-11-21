import {makeFilm} from '../src/stage.js';
import cut from '../src/cut.json';
const p=new URLSearchParams(location.search);const canvas=document.querySelector('canvas');
canvas.width=Number(p.get('w')||1920);canvas.height=canvas.width*9/16;
window.ready=makeFilm(canvas,n=>'/'+n).then(f=>{window.paint=n=>{f.draw(n);return canvas.toDataURL('image/jpeg',.94).split(',')[1]};window.frames=cut.frames;return true});
