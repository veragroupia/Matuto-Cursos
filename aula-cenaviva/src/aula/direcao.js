// Direção da aula depois do piloto: decupagem por frase, atuação e câmera.
// Tudo depende só do número do quadro (render determinístico a 60 fps).
import {V,mix,clamp,ease,ramp,pulse} from '../form.js';
import {aula,INTRO,FPS,beatEm,palavraEm,frases,fraseEm} from './linha.js';
import {usaMonitor} from './telas.js';
import capitulos from '../../audio/capitulos.json';

const P=pulse;
const familia=b=>usaMonitor(b.action)?'tela':['desk','paper','proof'].includes(b.shot)?'mesa':'pessoa';
const hash=n=>{let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};

// ───────── decupagem: cada beat vira 1–3 planos, sempre cortando em início de frase ─────────
const frasesEntre=(s,e)=>frases.filter(f=>f.s>=s-.05&&f.s<e-.2);
const inicioPerto=(s,e,alvo,min,max)=>{let best=null;for(const f of frasesEntre(s,e)){if(f.s<min||f.s>max)continue;if(!best||Math.abs(f.s-alvo)<Math.abs(best.s-alvo))best=f}return best?best.s-.12:null};
export const planos=[];
aula.beats.forEach((b,j)=>{
  const fam=familia(b),dur=b.e-b.s,prev=j?familia(aula.beats[j-1]):'pessoa';
  const out=[];
  if(fam==='pessoa'){
    out.push({s:b.s,cam:b.shot});
    const alt={host:'close',close:'host',wide:'host'}[b.shot];
    if(dur>9.5){const c=inicioPerto(b.s,b.e,b.s+dur*.55,b.s+3.5,b.e-3);if(c)out.push({s:c,cam:alt})}
  }else if(fam==='tela'){
    // Primeiro a pessoa (vira pro monitor ou fala com a gente), depois a tela.
    const fs=frasesEntre(b.s,b.e);let corte=b.s+1.8;
    if(fs.length>1&&fs[1].s-b.s>1.1&&fs[1].s-b.s<3.4)corte=fs[1].s-.12;
    else {const w=aula.words.find(w=>w.s>b.s+1.6);if(w&&w.s<b.s+3)corte=w.s-.08}
    out.push({s:b.s,cam:prev==='tela'?'close':'dupla'});
    out.push({s:corte,cam:'tela',tela:true});
  }else{
    out.push({s:b.s,cam:'mesa',mesa:true});
    const fs=frasesEntre(b.s,b.e),last=fs.at(-1);
    if(dur>9.5&&last&&last.s>b.s+dur*.6&&last.e-last.s>1.6)out.push({s:last.s-.12,cam:'host'});
  }
  out.forEach((p,i)=>{p.e=out[i+1]?.s??b.e;p.beat=j;p.olhar=p.cam==='dupla'||p.cam==='tela'?'monitor':p.mesa?'mesa':'camera'});
  // Progresso do conteúdo da tela/caderno: começa quando o plano aparece, termina antes do corte.
  const t0=out.find(p=>p.tela||p.mesa);b.conteudo=t0?[t0.s,t0.e]:[b.s,b.e];
  planos.push(...out);
});
// Mesmo enquadramento em sequência: pessoa vira um plano só; caderno alterna entre dois ângulos.
for(let i=planos.length-1;i>0;i--){const a=planos[i-1],b=planos[i];
  if(a.cam===b.cam&&!a.mesa&&!a.tela){a.e=b.e;planos.splice(i,1)}}
for(let i=1;i<planos.length;i++)if(planos[i].mesa&&planos[i-1].mesa&&planos[i-1].cam==='mesa')planos[i].cam='mesa2';
export const planoEm=t=>{let lo=0,hi=planos.length-1;if(t<planos[0].s)return 0;while(lo<hi){const m=(lo+hi+1)>>1;if(planos[m].s<=t)lo=m;else hi=m-1}return lo};
export const progresso=(b,t)=>clamp((t-b.conteudo[0])/Math.max(.5,(b.conteudo[1]-b.conteudo[0])*.96));

// ───────── piscadas e humor ─────────
const piscadas=[];{let z=INTRO/FPS+.6,n=0;const fim=aula.frames/FPS;while(z<fim){piscadas.push(z);z+=2.1+2.7*hash(n++)}for(const p of planos)piscadas.push(p.s+.06);piscadas.sort((a,b)=>a-b)}
const humorCap={playfully:.55,warmly:.42,mischievously:.6,curious:.32,thoughtfully:.22,'matter-of-fact':.28,cautiously:.12,softly:.3};
const direcaoDe=Object.fromEntries(capitulos.map(c=>[c.id,c.direction.replace(/[\[\]]/g,'')]));
const graca=new Set(['camisa','verbo','grito','pastas','honesto','fim','colete','tema','bolso','promessa']);
const tensao=new Set(['duvida','limites','medida','impede','falha','pix','plantio']);

// ───────── gestos (alvos dos pulsos no espaço da mesa) ─────────
const R0=[-.86,.995,.31],L0=[-.20,.995,.31];
const GESTOS=[
  {r:[-.78,1.16,.42],l:[-.28,1.16,.42],turn:.72},   // palmas abertas
  {r:[-.72,1.22,.44],l:L0,turn:.55},                // direita explica
  {r:R0,l:[-.33,1.21,.44],turn:.55},                // esquerda explica
  {r:[-.66,1.12,.46],l:[-.41,1.12,.46],turn:.42},   // mãos juntas, precisão
];
const APONTA={r:R0,l:[.05,1.25,.28],turn:.3};

function alvoMaos(t,pl){
  let r=V(...R0),l=V(...L0),turnR=.22,turnL=.22;
  if(pl.olhar==='mesa')return {r:V(-.80,.99,.36),l:V(-.24,.99,.38),tr:.2,tl:.2};
  const k=fraseEm(t+.25);
  let acc=0;const dr=V(0,0,0),dl=V(0,0,0);let tt=0;
  for(let i=Math.max(0,k-1);i<=Math.min(frases.length-1,k+1);i++){
    const f=frases[i];const len=f.e-f.s;if(len<.55)continue;
    const nxt=frases[i+1];const segura=nxt&&nxt.s-f.e<.5?nxt.s+.1:f.e+.1;
    const w=ramp(t,f.s-.28,f.s+.12)*(1-ramp(t,segura,segura+.45))*(len<1.1?.55:1);
    if(w<=0)continue;
    let g=GESTOS[Math.floor(hash(i*3.1)*GESTOS.length)];
    if(f.pergunta)g=GESTOS[0];
    if(pl.cam==='dupla'&&f.s>=planos[planoEm(t)].s-.3&&f.s<planos[planoEm(t)].s+1.2)g=APONTA;
    // batida na palavra de ênfase
    const bat=Math.exp(-(((t-f.enfase-.05)/.11)**2));
    dr.add(V(...g.r).sub(V(...R0)).add(V(0,-.035*bat,.01*bat)).multiplyScalar(w));
    dl.add(V(...g.l).sub(V(...L0)).add(V(0,-.035*bat,.01*bat)).multiplyScalar(w));
    tt+=g.turn*w;acc+=w;
  }
  if(acc>1){dr.multiplyScalar(1/acc);dl.multiplyScalar(1/acc);tt/=acc}
  // respiração das mãos: deriva lenta, nunca parada
  const d=V(Math.sin(t*.9)*.006,Math.sin(t*1.3+1)*.005,0);
  return {r:r.add(dr).add(d),l:l.add(dl).sub(d),tr:turnR+tt,tl:turnL+tt};
}

// ───────── atuação ─────────
export function atuar(frame){
  const t=frame/FPS,k=planoEm(t),pl=planos[k],b=aula.beats[beatEm(t)];
  const env=aula.env[frame-INTRO]||0;
  const w=palavraEm(t);const chars=(w?.w||'').toLowerCase(),pos=w?clamp((t-w.s)/Math.max(.05,w.e-w.s)):0;
  const ch=chars[Math.min(chars.length-1,Math.floor(pos*chars.length))]||'';
  const wide=ch&&'eiéêí'.includes(ch)?.86:ch&&'oôóu'.includes(ch)?-.64:.05;
  const closure=ch&&'pbm'.includes(ch)?(.4+.6*Math.abs(pos-.5)):1;

  // Para onde olha: troca um pouco ANTES do corte (o olhar motiva o corte).
  const olharDe=p=>p.olhar==='monitor'?1:0,mesaDe=p=>p.olhar==='mesa'?1:0;
  const nx=planos[k+1],pv=planos[k-1];
  const blend=(fn)=>{let v=fn(pl);if(nx)v=mix(v,fn(nx),ramp(t,nx.s-.32,nx.s+.05));if(pv)v=mix(fn(pv),v,ramp(t,pl.s-.32,pl.s+.18));return v};
  const monitor=blend(olharDe),baixo=blend(mesaDe);

  const fi=fraseEm(t),f=frases[fi];
  const naFrase=f&&t<f.e+.25?1:0;
  const pergunta=f&&f.pergunta?P(t,f.e-.6,f.e-.25,f.e+.2,f.e+.7):0;
  const humor=humorCap[direcaoDe[b.ch]]??.35;
  const riso=graca.has(b.action)?P(t,b.s+.2,b.s+.9,b.e-.6,b.e):0;
  const aperto=tensao.has(b.action)?P(t,b.s+.1,b.s+.8,b.e-.6,b.e):0;
  const smile=clamp(humor+.35*riso-.3*aperto+.12*Math.sin(t*.37),0,1);
  const asym=.55*riso+.4*pergunta;
  const concern=.55*aperto;

  // Acenos na ênfase de cada frase (afirmação desce, pergunta sobe)
  let nod=0;for(let i=Math.max(0,fi-1);i<=fi+1&&i<frases.length;i++){if(i<0)continue;const fr=frases[i];const h=fr.pergunta?-.04:.052*(.6+.8*hash(i));nod+=h*Math.exp(-(((t-fr.enfase-.1)/.14)**2))-h*.3*Math.exp(-(((t-fr.enfase-.34)/.16)**2))}
  const inhale=.009*Math.sin(t*2+.35*Math.sin(t*.72));

  // Olhar para a lente: leve deslocamento conforme a câmera; para o monitor: +0.68
  const camX={host:.18,close:.08,wide:.2,dupla:.12,tela:.12}[pl.cam]??0;
  const sacada=.05*Math.sin(t*1.7)*Math.sin(t*.53)+.03*Math.sin(t*3.1);
  const turnCam=camX+sacada*(1-monitor);
  const turn=mix(turnCam,.68,monitor)*(1-baixo*.6);

  const maos=alvoMaos(t,pl);
  const blink=Math.max(0,...piscadas.filter(z=>Math.abs(z-t)<.2).map(z=>P(t,z-.063,z,z+.021,z+.108)));
  return {
    open:Math.min(1,env*closure),wide,smile,asym,concern,turn,reach:0,lift:0,
    pitch:.026+baixo*.24+nod+inhale-pergunta*.03,lean:.028+baixo*.085+inhale+naFrase*.01,
    tilt:.026*Math.sin(t*.78)+.05*asym-.044*concern+.03*pergunta,
    brow:.21+asym*.5-concern*.45+env*.14+pergunta*.35,
    blink,gazeX:clamp(turn*2.15+Math.sin(t*1.6)*.085,-1,1),gazeY:-.78*baixo+.065*Math.sin(t*1.2),
    breathe:inhale*.5,hands:[maos.r,maos.l],handTurns:[clamp(maos.tr),clamp(maos.tl)],
    plano:pl,beat:b,
  };
}

// ───────── câmeras ─────────
const MON=V(.775,1.418,-.027),NORMAL=V(-.169,0,.986);
const CAMS={
  host:{p:[-.06,1.56,2.02],a:[-.40,1.40,.05],f:31},
  close:{p:[-.36,1.60,1.86],a:[-.50,1.50,.04],f:31},
  wide:{p:[.32,1.70,2.78],a:[-.10,1.28,-.12],f:38},
  dupla:{p:[.10,1.52,2.28],a:[-.02,1.38,-.04],f:34},
  tela:{p:MON.clone().addScaledVector(NORMAL,1.10).toArray(),a:MON.toArray(),f:35},
  mesa:{p:[.31,1.56,.80],a:[.31,.874,.635],f:30},
  mesa2:{p:[.37,1.60,.88],a:[.32,.874,.635],f:29},
};
export function enquadrar(t,cam){
  const pl=planos[planoEm(t)],c=CAMS[pl.cam];
  const u=ease((t-pl.s)/Math.max(.5,pl.e-pl.s));
  const pos=V(...c.p),alvo=V(...c.a);
  const push=pl.cam==='tela'?.035:pl.mesa?.05:.045;
  pos.lerp(alvo,push*u);
  const mao=pl.tela||pl.mesa?.25:1;
  pos.add(V(Math.sin(t*.71)*.004,Math.sin(t*.93+1)*.003,Math.sin(t*.37)*.003).multiplyScalar(mao));
  cam.position.copy(pos);cam.lookAt(alvo);cam.fov=c.f;cam.updateProjectionMatrix();
}
