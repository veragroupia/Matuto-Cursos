// Timeline da aula gerada por tools/montar_aula.py (src/aula.json).
import aula from '../aula.json';
export {aula};
export const FPS=60;
export const INTRO=aula.introFrames;
const beats=aula.beats;

export const beatEm=t=>{let lo=0,hi=beats.length-1;if(t<beats[0].s)return 0;while(lo<hi){const m=(lo+hi+1)>>1;if(beats[m].s<=t)lo=m;else hi=m-1}return lo};
export const capituloEm=f=>{const c=aula.chapters;for(let i=c.length-1;i>=0;i--)if(f>=c[i].fromFrame)return i;return 0};
export const palavraEm=t=>{const w=aula.words;let lo=0,hi=w.length-1;while(lo<=hi){const m=(lo+hi)>>1;if(w[m].e+.025<t)lo=m+1;else if(w[m].s-.025>t)hi=m-1;else return w[m]}return null};
export const legendaEm=t=>aula.cues.find(c=>t>=c.s&&t<c.e);

// Frases: palavras separadas por pausa >.26 s ou por pontuação final.
export const frases=[];
{let atual=null;
 for(const w of aula.words){
   if(!atual||w.s-atual.e>.26){atual={s:w.s,e:w.e,palavras:[]};frases.push(atual)}
   atual.palavras.push(w);atual.e=w.e;
   if(/[.!?]$/.test(w.w))atual=null;
 }
 for(const f of frases){
   f.pergunta=/\?$/.test(f.palavras.at(-1).w);
   // Ênfase: a palavra mais longa da frase (marca o "beat" do gesto).
   let m=f.palavras[0];for(const w of f.palavras)if(w.w.replace(/\W/g,'').length>m.w.replace(/\W/g,'').length)m=w;
   f.enfase=m.s;
 }
}
export const fraseEm=t=>{let lo=0,hi=frases.length-1,r=-1;while(lo<=hi){const m=(lo+hi)>>1;if(frases[m].s<=t){r=m;lo=m+1}else hi=m-1}return r};
