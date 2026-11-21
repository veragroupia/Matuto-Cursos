// Tudo o que aparece DENTRO do quarto 3D durante a aula:
//  • tela(): o monitor do Matuto (prompts, celular, ilha de edição, quadro, mini-filme)
//  • pagina(): o caderno aberto na mesa, filmado de cima
// Coordenadas lógicas: monitor 1280×700, caderno 1280×720 (o canvas real é 1,25× maior).
// Reaproveita os desenhos do Codex (desenho.js) e os textos que ele já tinha escrito em oficina.js.
import {pal,clamp,at,mix,rect,stroke,poly,ellipse,tx,paragraph,local,shaded,label,ball,keyArt,jersey,ticket,phone,field,pen,pointer,familia} from '../desenho.js';
const {ink,muted,paper,light,red,gold,teal,dark,pale,blue}=pal;
const cream='#f6e3b4',mint='#9fc2a9',orange='#e2956b',bg='#172a2c',line='#2c4446',panel='#1f3638',panel2='#24403f';
const type=(u,str)=>str.slice(0,Math.round(str.length*clamp(u)));
const seg=(u,a,b)=>clamp((u-a)/(b-a));
const fade=(c,a,fn)=>{if(a<=0)return;c.save();c.globalAlpha*=clamp(a);fn();c.restore()};

// ───────────────────────── moldura do monitor ─────────────────────────
function moldura(c,secao,direita=''){
  rect(c,0,0,1280,700,bg);
  c.save();c.strokeStyle='rgba(120,170,160,.06)';c.lineWidth=1;
  for(let x=0;x<1280;x+=38){c.beginPath();c.moveTo(x,0);c.lineTo(x,700);c.stroke()}
  for(let y=0;y<700;y+=38){c.beginPath();c.moveTo(0,y);c.lineTo(1280,y);c.stroke()}
  c.restore();
  tx(c,'CENAVIVA',44,62,36,cream,'Bahnschrift',false);
  tx(c,secao.toUpperCase(),46,96,16,mint,'Consolas',true);
  stroke(c,[[42,116],[300,116]],'#4f7470',2);
  if(direita)tx(c,direita.toUpperCase(),1236,62,16,mint,'Consolas',true,'right');
}
function cartao(c,x,y,w,h,cor=panel,borda=null){rect(c,x,y,w,h,cor,14);if(borda){c.save();c.strokeStyle=borda;c.lineWidth=3;c.beginPath();c.roundRect(x,y,w,h,14);c.stroke();c.restore()}}
function chip(c,s,x,y,cor=orange,fg='#1b2b2a',size=16){c.font='bold '+size+'px "Barlow Semi Condensed", sans-serif';const w=c.measureText(s).width+24;rect(c,x,y-size-6,w,size+14,cor,8);tx(c,s,x+12,y,size,fg,'Bahnschrift',true);return w}
function cursor(c,x,y,t){if(Math.floor(t*2.2)%2===0)rect(c,x+2,y-22,3,26,orange)}
function seta(c,x1,y1,x2,y2,cor=orange,w=4){stroke(c,[[x1,y1],[x2,y2]],cor,w);const a=Math.atan2(y2-y1,x2-x1);poly(c,[[x2,y2],[x2-16*Math.cos(a-.45),y2-16*Math.sin(a-.45)],[x2-16*Math.cos(a+.45),y2-16*Math.sin(a+.45)]],cor)}

// ───────────────────────── telefone (textos do Codex) ─────────────────────────
function screenText(c,k,p){
 if(['pix','chamada','resposta','contato'].includes(k)){
   const call=k!=='pix'||p>.63;
   if(call){rect(c,-103,-183,206,362,'#375d59');ellipse(c,0,-62,34,34,'#aec3ad');
     tx(c,'C',0,-50,32,ink,'Georgia',true,'center');tx(c,'Secretaria',0,7,23,light,'Bahnschrift',true,'center');
     tx(c,k==='resposta'?'Em chamada':'Chamando'+'.'.repeat(1+Math.floor(p*8)%3),0,37,14,'#c8d9c2','Consolas',false,'center');
     for(let j=0;j<3;j++){const rad=27+(p*65+j*17)%56;c.save();c.globalAlpha=(1-(rad-27)/56)*.35;c.strokeStyle='#d2e4c1';c.lineWidth=1.6;c.beginPath();c.arc(0,-62,rad,0,7);c.stroke();c.restore()}
     rect(c,-29,101,58,36,'#be765b',18);tx(c,'•••',0,126,20,light,'Bahnschrift',true,'center');
   }else{tx(c,'Conferir pagamento',-84,-99,18,ink,'Bahnschrift',true);tx(c,'R$ 200,00',-84,-47,32,red,'Georgia',true);tx(c,'Favorecido',-84,-2,15,muted);tx(c,'Rogério',-84,24,25,ink,'Georgia',true);rect(c,-86,93,172,37,teal,10);tx(c,'Confirmar',0,118,18,light,'Bahnschrift',true,'center')}
 }else if(['gravar','cortar','falha','entregar','celia'].includes(k)){
   rect(c,-103,-183,206,362,'#203936');
   if(k==='celia'){tx(c,'Tomadas de voz',-87,-115,20,light,'Bahnschrift',true);
    for(let i=0;i<2;i++){const y=-80+i*89;rect(c,-86,y,172,72,i===Number(p>.5)?'#597e70':'#354b48',9);tx(c,i?'Com dúvida':'Apurado',-73,y+23,16,light);for(let z=0;z<27;z++){let h=5+15*(.5+.5*Math.sin(z*5+i));rect(c,-73+z*5,y+45-h/2,2,h,pale,1)}}
   }else{
     c.save();c.beginPath();c.rect(-100,-118,200,211);c.clip();rect(c,-100,-118,200,211,'#c18e64');
     if(k==='entregar'){const ph=Math.min(2,Math.floor(p*3));if(ph===0)keyArt(c,0,-30,.88,-.4);else if(ph===1){rect(c,-78,-107,156,188,'#657a68');rect(c,-16,-46,34,74,'#dac48e',8);keyArt(c,15,-5,.55,-.9)}else{rect(c,-71,-40,150,71,'#d6a775',8);tx(c,'CASA',4,6,34,ink,'Consolas',true,'center')}}
     else{ticket(c,3,-12,k==='cortar'?.63+at(p,.32,.77)*.31:.70,-.05);if(k==='falha'){const s=at(p,.4,.72);local(c,mix(6,-142,s),-8,1,-.20,()=>{rect(c,-102,-19,142,36,'#ad7350',16);rect(c,13,-13,21,20,'#c4916e',8)})}}
     c.restore();tx(c,k==='cortar'?'Edição da escala':k==='falha'?'Revisão · celular':k==='entregar'?'Primeiro corte':'Câmera',0,-145,17,light,'Bahnschrift',true,'center');
     if(k==='cortar'){stroke(c,[[-82,131],[82,131]],'#95b3a0',3);for(let j=0;j<2;j++)poly(c,[[j?75:-62,123],[j?83:-54,131],[j?75:-62,139],[j?67:-70,131]],gold);rect(c,-60+p*133,109,2,41,light)}
     else if(k==='entregar'){for(let n=0;n<3;n++)rect(c,-86+n*59,113,53,27,n===Math.min(2,Math.floor(p*3))?gold:'#637c70',3)}
     else{ellipse(c,0,130,20,20,light);ellipse(c,0,130,15,15,red)}
   }
 }
}
const phoneNotes={
 pix:['Decisão do personagem','O dedo para antes de confirmar.','O contato vem do cartaz do clube.'],
 gravar:['Celular gratuito','Apoie nos livros.','Vire o papel perto da janela.'],
 cortar:['Editor no celular','Corte o começo em que a mão procura.','Dois pontos de escala aproximam o nome.'],
 celia:['Celular com IA paga','Uma frase, duas intenções.','Escolha ouvindo junto da imagem.'],
 falha:['Teste de leitura','O dedo esconde o 2.','A mão sai. O valor aparece.'],
 entregar:['Três planos de até 5 s','Objeto. Tentativa. Detalhe.','Uma frase liga os três.']};
const trilhaDe={pix:'',gravar:'TRILHA 1 · CELULAR GRATUITO',cortar:'TRILHA 1 · CELULAR GRATUITO',celia:'TRILHA 3 · CELULAR + IA PAGA',falha:'SKILL · TESTE NO CELULAR',entregar:'PRIMEIRA ATIVIDADE'};
function telaCelular(c,k,u,t){
  moldura(c,k==='pix'?'Cena · a decisão':'Celular',trilhaDe[k]);
  const n=phoneNotes[k];
  tx(c,n[0],60,214,46,cream,'Georgia',true);
  paragraph(c,n[1],62,290,560,30,40,'#d9e3d6','Bahnschrift');
  fade(c,seg(u,.38,.5),()=>paragraph(c,n[2],62,390,560,30,40,orange,'Bahnschrift',true));
  if(k==='gravar'){for(let j=0;j<3;j++)rect(c,770-j*8,604-j*24,330,22,['#bf7853','#d1bd90','#8e9e80'][j],5)}
  phone(c,930,350,1.42,()=>screenText(c,k,u),mix(-.04,.01,at(u,.1,.58)));
  if(k==='cortar'||k==='celia')pointer(c,1040-110*at(u,.19,.7),526-70*at(u,.3,.59),at(u,.4,.44));
}

// ───────────────────────── prompts e agente ─────────────────────────
function arquivo(c,nome,x,y,w,h){cartao(c,x,y,w,h,panel);rect(c,x,y,w,38,panel2,14);rect(c,x,y+24,w,14,panel2);tx(c,nome,x+18,y+26,16,mint,'Consolas',true)}
function telaPrompt02(c,u,t){
  moldura(c,'Biblioteca de prompts','prompt 02 · ganchos');
  arquivo(c,'02_ganchos_que_criam_perguntas.md',44,150,600,500);
  const troca=seg(u,.18,.34);
  tx(c,'Meu tema é',70,226,26,'#dfe8dc','Bahnschrift');
  if(troca<1){fade(c,1-troca,()=>chip(c,'{TEMA}',196,228,'#55706b',cream,24))}
  fade(c,troca,()=>{c.font='bold 26px "Barlow Semi Condensed", sans-serif';tx(c,type(troca,'teste de futebol.'),198,226,26,orange,'Bahnschrift',true)});
  paragraph(c,'Quero aprender a escrever ganchos narrativos para vídeos curtos, em vez de só pedir frases impactantes.',70,276,540,22,32,'#b9c8bd','Bahnschrift');
  paragraph(c,'Proponha cinco aberturas realmente diferentes: tensão imediata, surpresa, contradição, emoção e informação incompleta.',70,380,540,22,32,'#b9c8bd','Bahnschrift');
  paragraph(c,'Para cada uma: a pergunta que nasce na cabeça do espectador e o que precisa acontecer logo depois.',70,484,540,22,32,'#b9c8bd','Bahnschrift');
  // resposta da IA
  const r=seg(u,.42,.56);
  fade(c,r,()=>{arquivo(c,'Chat · cinco começos',680,150,556,500);
    const itens=['Tensão imediata','Surpresa','Contradição','Emoção','Informação incompleta'];
    itens.forEach((s,i)=>fade(c,seg(u,.46+i*.05,.5+i*.05),()=>{const y=230+i*66;tx(c,String(i+1),708,y,26,orange,'Georgia',true);tx(c,s,748,y,26,'#e7efe4','Bahnschrift')}));
    const comp=seg(u,.8,.9);
    fade(c,comp,()=>{chip(c,'A',1150,230,'#c96a52',light,18);chip(c,'B',1150,494,mint,'#16302c',18);tx(c,'compara estes dois',1210,600,17,orange,'Consolas',true,'right')});
  });
}
function telaPastas(c,u,t){
  moldura(c,'Trilha 2 · computador gratuito','organização');
  const pastas=[['imagem','gravações e quadros'],['voz','falas e áudio'],['projeto','o arquivo do editor']];
  pastas.forEach(([n,d],i)=>fade(c,seg(u,.06+i*.08,.14+i*.08),()=>{const x=60+i*300,y=170;
    rect(c,x,y+14,250,150,'#c99a52',12);rect(c,x,y,110,34,'#c99a52',10);rect(c,x,y+34,250,130,'#ddb067',12);
    tx(c,n+'/',x+20,y+102,36,'#3a2a14','Bahnschrift',true);tx(c,d,x+20,y+138,17,'#5a4322','Bahnschrift')}));
  const bagunca=seg(u,.38,.48),arruma=at(u,.72,.9);
  const arqs=['audio final.wav','audio final 2.wav','AGORA VAI.wav'];
  fade(c,bagunca,()=>{
    tx(c,'Área de trabalho, sem pastas:',60,420,22,mint,'Consolas',true);
    arqs.forEach((s,i)=>{const x0=60+i*270,y0=470,x1=410+i*14,y1=290+i*30;const x=mix(x0,x1,arruma),y=mix(y0,y1,arruma),sc=mix(1,.55,arruma);
      local(c,x,y,sc,0,()=>{rect(c,0,0,240,70,panel2,10);tx(c,'♪',18,46,30,orange,'Bahnschrift',true);tx(c,s,56,44,21,'#e7efe4','Bahnschrift',true)})});
    fade(c,seg(u,.5,.58)*(1-arruma),()=>tx(c,'qual é o certo?',1000,520,30,orange,'Segoe Print',true));
  });
  fade(c,seg(u,.86,.95),()=>tx(c,'cada coisa no seu lugar',1220,396,22,orange,'Consolas',true,'right'));
}
function quarto(c,x,y,w,h,quente){rect(c,x,y,w,h,'#5a8179',8);rect(c,x+w*.08,y+h*.12,w*.38,h*.42,quente?'#f3c27c':'#c9d4c0',4);rect(c,x,y+h*.66,w,h*.34,'#9f7757',4);rect(c,x+w*.55,y+h*.3,w*.32,h*.3,'#263332',3);rect(c,x+w*(quente?.16:.08),y+h*.6,w*.07,h*.1,'#e4d9b9',2);rect(c,x+w*.2,y+h*.4,w*.18,h*.3,'#9a6240',4)}
function telaAgente(c,u,t){
  moldura(c,'Trilha 4 · computador + IA paga','agente de código');
  arquivo(c,'Conversa com o agente',44,150,620,500);
  rect(c,70,200,560,96,'#2f4c49',12);paragraph(c,type(seg(u,.12,.3),'Deixa a luz da janela mais quente e afasta a caneca da borda da mesa.'),88,236,520,22,30,'#e7efe4','Bahnschrift',true);
  fade(c,seg(u,.34,.42),()=>{tx(c,'room.js',72,340,18,mint,'Consolas',true);
    const ls=[['-','janela: #ffdfad',red],['+','janela: #ffc98a','#7fbf8a'],['-','caneca x: −1.03',red],['+','caneca x: −0.95','#7fbf8a']];
    ls.forEach(([s,l,cor],i)=>fade(c,seg(u,.38+i*.04,.42+i*.04),()=>{rect(c,70,358+i*50,560,42,s==='+'?'rgba(127,191,138,.12)':'rgba(208,101,74,.12)',6);tx(c,s+'  '+l,86,386+i*50,20,cor,'Consolas',true)}))});
  fade(c,seg(u,.6,.7),()=>{tx(c,'COMPARAR ANTES DE ACEITAR',700,190,18,orange,'Consolas',true);
    quarto(c,700,212,250,170,false);tx(c,'tomada 07',825,410,17,mint,'Consolas',true,'center');
    quarto(c,986,212,250,170,true);tx(c,'tomada 08',1111,410,17,mint,'Consolas',true,'center');
    fade(c,seg(u,.78,.88),()=>paragraph(c,'A mudança ajudou a cena? Quem decide é quem dirige.',704,480,520,26,36,cream,'Bahnschrift',true))});
}
function telaPrompt09(c,u,t){
  moldura(c,'Biblioteca de prompts','prompt 09 · crítica e clareza');
  arquivo(c,'09_critica_de_retencao_e_clareza.md',44,150,1192,500);
  tx(c,'RASCUNHO',72,228,17,mint,'Consolas',true);
  const s='Rogério era suspeito. Matuto desconfiou. Ele resolveu ligar.';
  tx(c,s,72,276,34,cream,'Georgia',true);
  const mark=seg(u,.7,.84);if(mark>0){c.font='bold 34px "Source Serif 4", serif';const x0=72+c.measureText('Rogério era suspeito. ').width,w=c.measureText('Matuto desconfiou.').width;stroke(c,[[x0,290],[x0+w*mark,290]],red,5)}
  tx(c,'PEÇO À IA',72,350,17,mint,'Consolas',true);
  const qs=['Aponta a frase exata em que a história para.','O que posso tirar?','Que ação visível prova a mudança?'];
  qs.forEach((q,i)=>{const v=seg(u,.22+i*.14,.34+i*.14);if(v>0){tx(c,'›',72,406+i*62,30,orange,'Georgia',true);tx(c,type(v,q),104,404+i*62,30,'#e7efe4','Bahnschrift',true)}});
}
function telaSkill(c,u,t){
  moldura(c,'Skill · procedimento reutilizável','SKILL.md');
  arquivo(c,'skills/revisar-leitura/SKILL.md',44,150,1192,500);
  const linhas=[
    ['---',mint],['name: revisar-leitura-no-celular',mint],['description: confere se valor e favorecido ficam legíveis',mint],['---',mint],
    ['1. Abra o corte no tamanho de um telefone.','#e7efe4'],['2. Pare no recibo.','#e7efe4'],['3. Dá pra ler valor e favorecido?','#e7efe4'],
    ['4. Se a mão cobrir a palavra, marque o segundo','#e7efe4'],['   e proponha mudar a mão ou a câmera.','#e7efe4']];
  let y=222;linhas.forEach(([l,cor],i)=>{const v=seg(u,.04+i*.075,.1+i*.075);if(v>0)tx(c,type(v,l),76,y,i<4?20:27,cor,'Consolas',i>=4);y+=i<4?34:52});
}
function telaMedida(c,u,t,imgs){
  moldura(c,'Revisar com dados reais','um Reel · 1min56s');
  // recorte real da curva de retenção do Instagram (print fornecido pelo criador)
  const im=imgs.retencao;cartao(c,44,150,820,420,'#0e0f12');
  if(im)c.drawImage(im,20,540,689,220,60,190,788,252);
  const x53=60+(106+(681-106)*53/116-20)*788/689;
  const v=seg(u,.1,.24);
  fade(c,v,()=>{stroke(c,[[x53,182],[x53,470]],orange,3);chip(c,'tempo médio: 53 s',x53-90,512,orange,'#1b2b2a',20)});
  tx(c,'print real do Instagram · curva ilustrativa da plataforma, sem valores por segundo',60,548,15,'#8aa79a','Consolas',false);
  fade(c,seg(u,.32,.44),()=>{tx(c,'Uns saem cedo…',900,240,30,cream,'Georgia',true)});
  fade(c,seg(u,.46,.58),()=>{tx(c,'…outros ficam',900,300,30,cream,'Georgia',true);tx(c,'até o fim.',900,340,30,cream,'Georgia',true)});
  fade(c,seg(u,.66,.78),()=>{rect(c,890,410,350,150,'#2f4c49',12);paragraph(c,'A média sozinha não diz qual cena mexer.',912,452,310,26,36,orange,'Bahnschrift',true)});
}

// ───────────────────────── ilha de edição ─────────────────────────
function trilha(c,y,nome){tx(c,nome,52,y+34,17,mint,'Consolas',true);rect(c,110,y,1126,52,'#132325',8)}
function clipe(c,x,y,w,txt,cor,alpha=1){fade(c,alpha,()=>{rect(c,x,y+4,Math.max(2,w),44,cor,7);if(w>60){c.save();c.beginPath();c.rect(x,y,w,52);c.clip();tx(c,txt,x+12,y+33,17,'#14231f','Bahnschrift',true);c.restore()}})}
function visor(c,x,y,w,h,fn){rect(c,x,y,w,h,'#0c1415',10);c.save();c.beginPath();c.roundRect(x,y,w,h,10);c.clip();fn();c.restore()}
function telaEdicao(c,k,u,t){
  moldura(c,'Ilha de edição',k==='camadas'||k==='camadas3d'?'faixas':k==='hipotese'?'duas versões':'a ligação');
  if(k==='sobra'||k==='corta'||k==='respira'){
    const parts=[['recibo',1.8],['desbloqueia',1.6],['procura o contato',2.6],['erra o dedo',1.2],['volta',1.0],['acha o nome',1.4],['chamada',2.4],['resposta',2.8]];
    const morto=i=>i>=1&&i<=5;
    const total=parts.reduce((s,p)=>s+p[1],0);
    const colapsa=k==='corta'?at(u,.18,.42):k==='respira'?1:0;
    const ws=parts.map(([n,d],i)=>d*(morto(i)?1-colapsa:1));const W=ws.reduce((a,b)=>a+b,0);
    visor(c,560,140,280,190,()=>{local(c,700,235,.42,0,()=>phone(c,0,0,1,()=>screenText(c,u<.55?'pix':'chamada',u),0))});
    trilha(c,380,'V1');trilha(c,452,'A1');
    let x=110;const sc=1126/(k==='sobra'?total:W);
    parts.forEach(([n,d],i)=>{const w=ws[i]*sc;clipe(c,x+2,380,w-4,n,i===0?'#b9a77e':morto(i)?(k==='sobra'&&u>.55?'#c97a63':'#8d8a74'):'#9fc2a9');x+=w});
    // fala do Matuto sobre a voz
    x=110+ws.slice(0,6).reduce((a,b)=>a+b,0)*sc;
    if(k==='corta'){const j=at(u,.55,.75)*120;clipe(c,x-j,452,150,'toque',orange);fade(c,seg(u,.72,.82),()=>tx(c,'o som chega antes da imagem',x-j,540,20,orange,'Consolas',true))}
    else clipe(c,x,452,1236-x-4,'voz',mint);
    if(k==='sobra'){const ph=110+1126*u;rect(c,ph,370,3,140,cream);fade(c,seg(u,.55,.65),()=>{const a0=110+ws[0]*sc,dead=parts.slice(1,6).reduce((s,p)=>s+p[1],0)*sc;stroke(c,[[a0,532],[a0+dead,532]],red,4);tx(c,'7,8 s até a primeira novidade',a0,566,22,red,'Consolas',true)})}
    if(k==='corta'){fade(c,seg(u,.05,.15)*(1-colapsa),()=>{const xs=110+ws.slice(0,6).reduce((a,b)=>a+b,0)*sc;rect(c,xs,364,4,150,orange);tx(c,'entrada',xs+8,356,16,orange,'Consolas',true)})}
    if(k==='respira'){const xr=110+ws.slice(0,7).reduce((a,b)=>a+b,0)*sc;
      fade(c,seg(u,.08,.2),()=>{rect(c,xr-6,370,86,140,'rgba(159,194,169,.22)',6);tx(c,'pausa · o menino entende',xr-6,356,18,mint,'Consolas',true)});
      for(let i=0;i<60;i++){const xx=xr+90+i*7;if(xx>1230)break;const h=6+22*Math.abs(Math.sin(i*1.7)*Math.sin(i*.4));rect(c,xx,476-h/2,3,h,'#1f3a34',1)}
      fade(c,seg(u,.62,.74),()=>{tx(c,'procura do contato: cortada',112,566,22,red,'Consolas',true);stroke(c,[[112,576],[440,576]],red,3)});
    }
    return;
  }
  if(k==='camadas'){
    visor(c,500,136,340,200,()=>{local(c,670,236,.5,-.03,()=>ticket(c,0,0,1,0))});
    trilha(c,380,'V1');trilha(c,452,'A1');trilha(c,524,'A2');
    clipe(c,112,380,520,'recibo','#b9a77e');clipe(c,636,380,598,'telefone','#9fc2a9');
    clipe(c,112,452,1120,'voz do Matuto',mint);
    const mv=at(u,.34,.56);clipe(c,mix(640,520,mv),524,260,'toque da ligação',orange);
    fade(c,seg(u,.5,.6),()=>tx(c,'o papel ainda está na tela quando toca',520,612,20,orange,'Consolas',true));
    fade(c,seg(u,.78,.9),()=>tx(c,'dá pra mexer só nesse corte',870,250,20,mint,'Consolas',true));
    return;
  }
  if(k==='camadas3d'){
    const cam=[['Three.js','monta os objetos e a câmera',mint],['Remotion','organiza o vídeo em quadros',gold],['ElevenLabs','interpreta as falas do Matuto','#c9a3d9'],['Direção','decide quando cada coisa entra',orange]];
    cam.forEach(([n,d,cor],i)=>{const v=at(u,.04+i*.2,.14+i*.2);if(v<=0)return;const y=170+i*118;local(c,mix(80,0,v),0,1,0,()=>fade(c,v,()=>{rect(c,60,y,1160,96,i===3?'#3a4a3b':panel,14);rect(c,60,y,12,96,cor,6);tx(c,n,100,y+60,40,cor,'Georgia',true);tx(c,d,440,y+58,28,'#e7efe4','Bahnschrift',i===3)}))});
    return;
  }
  if(k==='hipotese'){
    const v2=at(u,.38,.6);
    tx(c,'VERSÃO 1',52,210,18,mint,'Consolas',true);
    const linha=(y,px)=>{rect(c,110,y,1126,52,'#132325',8);clipe(c,112,y,300,'abertura','#b9a77e');clipe(c,112+px,y,170,'pista','#c97a63');clipe(c,700,y,532,'resto igual','#5f7d74')};
    linha(230,400);
    fade(c,seg(u,.3,.38),()=>{tx(c,'VERSÃO 2',52,340,18,mint,'Consolas',true);linha(360,mix(400,120,v2));
      fade(c,seg(u,.6,.7),()=>{seta(c,620,330,320,330,orange,3);tx(c,'a pista vem antes',330,320,18,orange,'Consolas',true)})});
    fade(c,seg(u,.72,.84),()=>{rect(c,110,470,1126,120,'#2f4c49',12);tx(c,'Uma mudança por vez. O resto fica igual',140,540,32,cream,'Georgia',true);tx(c,'pra comparação fazer sentido.',140,578,24,mint,'Bahnschrift',true)});
  }
}

// ───────────────────────── quadro de formatos ─────────────────────────
function ficha(c,x,y,w,h,titulo,corpo,cor,ativo,extra){
  rect(c,x,y,w,h,ativo?'#f4e8c9':'#c9bf9f',12);rect(c,x,y,w,10,cor,5);
  tx(c,titulo,x+22,y+52,22,cor===gold?'#8a5b17':cor,'Consolas',true);
  paragraph(c,corpo,x+22,y+96,w-44,25,32,ink,'Georgia',true);extra&&extra();
}
function telaQuadro(c,k,u,t){
  if(k==='ordem'){moldura(c,'Progressão','a ordem muda a pergunta');
    const cs=[['1 · LÊ O NOME','Rogério, no favorecido.'],['2 · LIGA','pra secretaria do clube.'],['3 · INFORMAÇÃO NOVA','muda o que ele faz.']];
    cs.forEach(([a,b],i)=>{const v=at(u,.06+i*.22,.16+i*.22);if(v<=0)return;fade(c,v,()=>{ficha(c,60+i*400,200+(1-v)*40,340,240,a,b,[teal,blue,red][i],true);if(i<2)seta(c,404+i*400,320,452+i*400,320,orange,5)})});
    fade(c,seg(u,.82,.92),()=>tx(c,'Cada passo causa o próximo: isso é progressão.',640,560,30,cream,'Georgia',true,'center'));
    return;}
  if(k==='chave'){moldura(c,'Primeira atividade','exemplo com uma chave');
    const cs=[['QUEM PRECISA','Minha irmã, pra abrir a padaria antes do primeiro ônibus.'],['O QUE ACONTECE','A chave gira e a porta não abre.'],['O DETALHE','No chaveiro: é a chave de casa.']];
    cs.forEach(([a,b],i)=>{const v=at(u,.08+i*.22,.18+i*.22);if(v<=0)return;fade(c,v,()=>ficha(c,60+i*400,170+(1-v)*40,350,300,a,b,[teal,blue,red][i],true,()=>{if(i===2)keyArt(c,60+i*400+290,170+250,.7,-.6)}))});
    fade(c,seg(u,.82,.92),()=>{chip(c,'→ uma decisão pra próxima cena',420,560,orange,'#1b2b2a',26)});
    return;}
  // matuto / dias / curioso: o quadro acumula os três formatos
  moldura(c,'Uma técnica, três formatos','o que move cada um');
  const ordem=['matuto','dias','curioso'],idx=ordem.indexOf(k);
  const fichas=[
    ['MATUTO','Vendi a passagem pra fazer o teste. Como volto pra casa?','motor: a decisão de alguém',teal,()=>{}],
    ['DESAFIO · 30 DIAS','Dia 1: erro todos os passes de esquerda. Dia 30: quantos acertam?','motor: comparação conferível',gold,()=>{}],
    ['CURIOSIDADE','A bola bateu na trave e voltou. De que lado chutei?','motor: uma prova visual',blue,()=>{}]];
  fichas.forEach(([a,b,m,cor],i)=>{if(i>idx)return;const ativo=i===idx;const v=ativo?at(u,.02,.14):1;
    fade(c,v,()=>{const x=50+i*400,y=150;ficha(c,x,y+(1-v)*40,370,330,a,b,cor,ativo);tx(c,m,x+22,y+300,18,'#6a4a2a','Consolas',true);
      if(i===1&&ativo){for(let n=0;n<10;n++){const xx=x+40+n*30,yy=y+400;tx(c,u<.55?'×':'?',xx,yy,30,u<.55?red:orange,'Bahnschrift',true)}tx(c,u<.55?'dia 1':'dia 30',x+22,y+440,18,mint,'Consolas',true)}
      if(i===2&&ativo){const b=seg(u,.25,.6);rect(c,x+250,y+360,10,110,light);const bx=mix(x+40,x+246,Math.min(1,b*2)),by=mix(y+460,y+400,Math.min(1,b*2));const back=Math.max(0,b*2-1);ball(c,mix(bx,x+90,back),mix(by,y+452,back),.45,b*5);if(u>.62)seta(c,x+230,y+380,x+120,y+440,orange,3)}
      if(i===0&&ativo){local(c,x+300,y+400,.5,-.1,()=>ticket(c,0,0,.7,0))}
    })});
  if(idx===2)fade(c,seg(u,.8,.9),()=>tx(c,'Cada formato pede uma prova diferente.',60,560,28,cream,'Georgia',true));
}

// ───────────────────────── o mini-filme no visor ─────────────────────────
function cinema(c,titulo,fn){
  rect(c,0,0,1280,700,'#0b1213');
  c.save();c.beginPath();c.rect(40,70,1200,560);c.clip();fn();c.restore();
  rect(c,40,70,1200,560,'rgba(0,0,0,0)');
  tx(c,titulo,44,48,16,mint,'Consolas',true);tx(c,'● REC',1236,48,16,'#d0654a','Consolas',true,'right');
  rect(c,40,660,1200,6,'#203436',3);
}
function telaFilme(c,k,u,t){
  if(k==='recibo'){cinema(c,'CENA MONTADA · PLANO 1',()=>{rect(c,40,70,1200,560,'#7a5a40');for(let i=0;i<9;i++)rect(c,40,70+i*64,1200,2,'rgba(0,0,0,.08)');
      local(c,560,350,1.85,mix(-.08,-.04,u),()=>ticket(c,0,0,1,0));
      local(c,mix(980,900,at(u,.3,.6)),390,1.4,.2,()=>{shaded(c,()=>rect(c,-90,-60,180,120,'#e8e2c8',6));tx(c,'PASSAGEM',0,-12,22,ink,'Consolas',true,'center');tx(c,'ida e volta',0,22,17,muted,'Consolas',false,'center')})});return}
  if(k==='chamada'||k==='resposta'){cinema(c,'CENA MONTADA · PLANO '+(k==='chamada'?2:3),()=>{rect(c,40,70,1200,560,'#5d4a3a');
      phone(c,640,360,1.38,()=>screenText(c,k,u),mix(-.03,.02,u));
      if(k==='resposta')fade(c,seg(u,.28,.4),()=>{rect(c,830,240,330,140,'rgba(244,232,201,.95)',14);tx(c,'inscrição gratuita',852,290,24,ink,'Bahnschrift',true);tx(c,'7h · portão azul',852,340,30,blue,'Georgia',true)})});return}
  if(k==='chegada'||k==='colete'){cinema(c,k==='chegada'?'CENA MONTADA · PLANO 4':'O FIM DA HISTÓRIA',()=>{
      field(c,40,70,1200,560,k==='chegada'?at(u,.15,.5):1,true);
      const j=seg(u,k==='chegada'?.62:.05,k==='chegada'?.74:.2);
      fade(c,j,()=>{shaded(c,()=>rect(c,880,170,300,360,'rgba(244,232,201,.96)',16));jersey(c,1030,330,1.5,'43',-.04);tx(c,'colete 43',1030,500,22,ink,'Consolas',true,'center')});
      if(k==='colete')fade(c,seg(u,.45,.6),()=>{local(c,330,360,1.2,-.06,()=>ticket(c,0,0,1,0));stroke(c,[[230,500],[420,494]],red,5);tx(c,'a última linha',240,560,24,light,'Consolas',true)});
    });return}
  if(k==='cartaz'||k==='plantio'){cinema(c,k==='cartaz'?'CENA · O CARTAZ DA PENEIRA':'A VIRADA PLANTADA',()=>{
      const z=k==='plantio'?at(u,.25,.6):0;
      field(c,40,70,1200,560,0,true);
      // cartaz pregado no muro
      const cx=mix(330,640,z),cy=mix(380,370,z),sc=mix(.95,2.3,z);
      local(c,cx,cy,sc,-.03,()=>{shaded(c,()=>rect(c,-110,-130,220,260,'#f1e4c0',6));rect(c,-110,-130,220,46,'#3f756b',6);tx(c,'PENEIRA',0,-98,26,light,'Bahnschrift',true,'center');
        tx(c,'Teste amanhã · 7h',0,-48,18,ink,'Bahnschrift',true,'center');tx(c,'Secretaria do clube',0,-14,15,muted,'Bahnschrift',false,'center');tx(c,'(83) 0000-0000',0,10,15,muted,'Consolas',false,'center');
        stroke(c,[[-90,32],[90,32]],'#b8a985',1);tx(c,'Atletas: entrada',0,62,14,ink,'Consolas',true,'center');rect(c,-70,72,140,30,'#477581',5);tx(c,'PORTÃO AZUL',0,93,15,light,'Consolas',true,'center')});
      if(k==='cartaz')fade(c,seg(u,.35,.48),()=>{c.save();c.strokeStyle=orange;c.lineWidth=5;c.beginPath();c.ellipse(330,448,92,30,0,0,7);c.stroke();c.restore();tx(c,'guarda essa cor',440,470,26,orange,'Segoe Print',true)});
      if(k==='plantio')fade(c,seg(u,.62,.74),()=>{rect(c,880,140,330,140,'rgba(18,30,31,.88)',12);paragraph(c,'Pagar não garantia nada: dava pra ir pro portão errado.',900,184,290,22,30,cream,'Bahnschrift',true)});
    });return}
}

// ───────────────────────── despacho do monitor ─────────────────────────
const celularK=['pix','gravar','cortar','celia','falha','entregar'];
const edicaoK=['sobra','corta','respira','camadas','camadas3d','hipotese'];
const quadroK=['ordem','matuto','dias','curioso','chave'];
const filmeK=['recibo','chamada','resposta','chegada','colete','cartaz','plantio'];
export function tela(c,k,u,t,imgs){
  c.save();c.scale(c.canvas.width/1280,c.canvas.height/700);
  if(celularK.includes(k))telaCelular(c,k,u,t);
  else if(edicaoK.includes(k))telaEdicao(c,k,u,t);
  else if(quadroK.includes(k))telaQuadro(c,k,u,t);
  else if(filmeK.includes(k))telaFilme(c,k,u,t);
  else if(k==='prompt02')telaPrompt02(c,u,t);
  else if(k==='pastas')telaPastas(c,u,t);
  else if(k==='pcia')telaAgente(c,u,t);
  else if(k==='prompt09')telaPrompt09(c,u,t);
  else if(k==='procedimento')telaSkill(c,u,t);
  else if(k==='medida')telaMedida(c,u,t,imgs);
  else moldura(c,'Ilha de edição');
  c.restore();
}
export const usaMonitor=k=>celularK.includes(k)||edicaoK.includes(k)||quadroK.includes(k)||filmeK.includes(k)||['prompt02','pastas','pcia','prompt09','procedimento','medida'].includes(k);

// ───────────────────────── caderno (textos do Codex + novos) ─────────────────────────
const notes={
 tema:{title:'Futebol',lines:['A bola?','A torcida?','O dedão do pé?'],art:'ball'},
 premissa:{title:'Quem quer o quê?',lines:['Um menino quer fazer o teste.','O teste é amanhã.'],art:'clock'},
 impede:{title:'E se ele pagar?',lines:['O dinheiro é o da passagem.','Sem passagem, como chegar?'],art:'ticket'},
 fichas:{title:'Onde o roteiro travou?',lines:['Assunto solto → premissa','Nada aperta → conflito','Fala dura → diálogo'],art:'pencil'},
 pedido:{title:'O pedido que cabe na mesa',lines:['20 segundos. Uma mesa. Um celular.','Descobrir quem fez a cobrança.','Duas ações filmáveis hoje.'],art:'ticket'},
 escrever:{title:'Teu primeiro rascunho',lines:['Quem precisa do objeto hoje?','O que perde se não conseguir?','Que detalhe muda a leitura?'],art:'key'},
 uma:{title:'Segunda versão',lines:['O que a pessoa entendeu?','Qual corte eu vou mudar?','Comparar com a primeira.'],art:'pencil'}};
const copy={
 grito:['Abertura A','Você não vai acreditar no que aconteceu comigo.','Que pergunta ficou?','A frase pede atenção e esconde o assunto.'],
 bolso:['Abertura B','Botei a passagem de volta em cima do balcão.','Como ele vai voltar?','A próxima cena precisa responder.'],
 verbo:['Primeiro rascunho','Rogério era suspeito. Matuto desconfiou. Ele resolveu ligar.','O que a câmera vê?','“Desconfiou” ainda precisa virar ação.'],
 risca:['Reescrita','Matuto desconfiou.','O polegar parou sobre pagar.','Ele virou o cartaz e discou o número do clube.'],
 alternativas:['Duas respostas','Mostrar o estádio lotado.','Virar o recibo na mesa.','Esta cabe na produção de hoje.']};
function folha(c){
  rect(c,0,0,1280,720,'#efe2bf');
  rect(c,632,0,16,720,'#dccfa9');
  const g=c.createLinearGradient(600,0,680,0);g.addColorStop(0,'rgba(80,60,30,0)');g.addColorStop(.5,'rgba(80,60,30,.16)');g.addColorStop(1,'rgba(80,60,30,0)');c.fillStyle=g;c.fillRect(600,0,80,720);
  for(let i=0;i<13;i++){stroke(c,[[60,150+i*44],[600,150+i*44]],'#d6c9a8',1.2);stroke(c,[[680,150+i*44],[1220,150+i*44]],'#d6c9a8',1.2)}
}
function caderno(c,k,u,imgs){
  folha(c);
  if(k==='dados'){
    label(c,'CENAVIVA   /   RESULTADO DE UM REEL',64,70);
    tx(c,'Um Reel do Matuto',64,150,52,ink,'Georgia',true);
    const ls=[['Duração','1min56s'],['Tempo médio','53 s'],['Visualizações','239.513']];
    ls.forEach(([a,b],i)=>{const v=seg(u,.12+i*.16,.24+i*.16);if(v>0){tx(c,a,70,250+i*92,26,teal,'Bahnschrift',true);tx(c,type(v,b),300,252+i*92,46,red,'Segoe Print',true)}});
    fade(c,seg(u,.62,.74),()=>tx(c,'um vídeo, não uma promessa',70,560,30,muted,'Segoe Print',true));
    const im=imgs.insights;if(im){local(c,940,340,1,.035,()=>{shaded(c,()=>rect(c,-210,-270,420,540,'#fff',4));c.drawImage(im,24,250,662,330,-196,-250,392,196);c.drawImage(im,24,1300,662,90,-196,-40,392,54);
      tx(c,'print real · Instagram',0,60,18,'#4d4d4d','Consolas',true,'center');rect(c,-60,-292,120,36,'rgba(220,200,140,.7)',3)})}
    return;
  }
  const d=copy[k];
  if(d){
    label(c,'MESA DE ROTEIRO   /   '+d[0].toUpperCase(),64,70);
    const mark=k==='risca'||k==='alternativas'||k==='verbo';
    paragraph(c,d[1],64,160,1150,46,58,ink,'Georgia',true);
    if(mark&&u>.24){c.font='bold 46px '+familia('Georgia');const alvo=k==='verbo'?'Matuto desconfiou.':d[1];const antes=k==='verbo'?'Rogério era suspeito. ':'';
      const x0=64+c.measureText(antes).width,w=c.measureText(alvo).width,y=160-15;stroke(c,[[x0,y+3],[x0+w*at(u,.24,.41),y-2]],red,6)}
    if(k==='grito'||k==='bolso'){const q=seg(u,.3,.42);fade(c,q,()=>{tx(c,d[2],70,340,38,teal,'Bahnschrift',true)});fade(c,seg(u,.5,.62),()=>paragraph(c,d[3],70,420,1100,36,48,muted,'Segoe Print',true))}
    else{fade(c,seg(u,.32,.46),()=>{tx(c,d[2],70,350,40,teal,k==='risca'?'Segoe Print':'Bahnschrift',true);paragraph(c,type(seg(u,.47,.78),d[3]),70,440,1100,36,48,k==='risca'?ink:muted,k==='risca'?'Segoe Print':'Bahnschrift',k==='risca')})}
    return;
  }
  const n=notes[k]||notes.fichas;
  label(c,'CENAVIVA   /   OFICINA',64,70);
  paragraph(c,n.title,64,150,540,44,52,ink,'Georgia',true);
  if(n.art==='ball'){ellipse(c,330,430,104,104,ink);ball(c,330,430,2.6,u*.43)}else if(n.art==='ticket')ticket(c,330,430,.95,mix(-.18,-.06,u));else if(n.art==='key')keyArt(c,320,360,1.6,-.66);
  else if(n.art==='clock'){ellipse(c,330,430,92,92,teal);ellipse(c,330,430,80,80,light);stroke(c,[[330,368],[330,430],[380,430]],ink,7);tx(c,'amanhã · 07h',330,560,22,teal,'Consolas',true,'center')}
  else{local(c,350,480,1.9,-.12,()=>pen(c,0,0))}
  let last=[700,150];
  for(let i=0;i<n.lines.length;i++){const v=seg(u,.035+i*(.68/n.lines.length),.21+i*(.68/n.lines.length));const y=180+i*110;
    if(v>0){tx(c,String(i+1).padStart(2,'0'),690,y,20,teal,'Consolas',true);paragraph(c,type(v,n.lines[i]),740,y,480,40,46,ink,'Segoe Print',true);last=[746+Math.min(n.lines[i].length*v*17,440),y+12]}}
  if(u<.9)pen(c,last[0],last[1],-.64);
}
export function pagina(c,k,u,imgs){c.save();c.scale(c.canvas.width/1280,c.canvas.height/720);caderno(c,k,u,imgs);c.restore()}
