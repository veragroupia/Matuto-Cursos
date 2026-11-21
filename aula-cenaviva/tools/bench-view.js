import {makeFilm} from '../src/stage.js';
const canvas=document.querySelector('canvas');canvas.width=1920;canvas.height=1080;
window.ready=makeFilm(canvas,n=>'/'+n).then(f=>{window.drawOnly=n=>f.draw(n);window.encode=()=>canvas.toDataURL('image/jpeg',.94);window.paint=1;return true});
