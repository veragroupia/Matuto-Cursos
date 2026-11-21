// Desenhos vetoriais originais da oficina, em coordenadas do quadro de 1280 × 720.
export const pal={ink:'#263d39',muted:'#536c61',paper:'#f4e8c9',light:'#fff4d9',red:'#ac4c35',gold:'#dfa958',teal:'#45776d',dark:'#1c3032',pale:'#aec2a5',blue:'#42798b'};
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
export const at=(v,a,b)=>smooth((v-a)/(b-a));
export const mix=(a,b,t)=>a+(b-a)*t;
export function rect(c,x,y,w,h,color,r=0){c.fillStyle=color;c.beginPath();c.roundRect(x,y,Math.max(.001,w),Math.max(.001,h),r);c.fill()}
export function stroke(c,pts,color,width=3,closed=false){c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);if(closed)c.closePath();c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.stroke()}
export function poly(c,pts,color){c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);c.closePath();c.fillStyle=color;c.fill()}
export function ellipse(c,x,y,a,b,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,a,b,0,0,7);c.fill()}
// Fontes do Windows usadas no piloto, com equivalentes livres embutidos em public/fonts.
const FAMILIA={Georgia:'Georgia, "Source Serif 4", serif',Bahnschrift:'Bahnschrift, "Barlow Semi Condensed", sans-serif',Consolas:'Consolas, "JetBrains Mono", monospace','Segoe Print':'"Segoe Print", Caveat, cursive','Segoe UI':'"Segoe UI", Inter, sans-serif'};
export const familia=f=>FAMILIA[f]||('"'+f+'", sans-serif');
export function tx(c,str,x,y,size=30,col=pal.ink,font='Bahnschrift',bold=false,align='left'){c.font=(bold?'bold ':'')+size+'px '+familia(font);c.textAlign=align;c.textBaseline='alphabetic';c.fillStyle=col;c.fillText(str,x,y)}
export function paragraph(c,str,x,y,maxWidth,size=38,line=49,col=pal.ink,font='Georgia',bold=false){
 c.font=(bold?'bold ':'')+size+'px '+familia(font);let row='',n=0;
 for(const w of str.split(/\s+/)){if(row&&c.measureText(row+' '+w).width>maxWidth){tx(c,row,x,y+n*line,size,col,font,bold);row=w;n++}else row+=(row?' ':'')+w}
 if(row)tx(c,row,x,y+n*line,size,col,font,bold);return (n+1)*line;
}
export function local(c,x,y,s,rot,fn){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);fn();c.restore()}
export function shaded(c,fn,blur=18){c.save();c.shadowColor='rgba(31,27,21,.23)';c.shadowOffsetY=7;c.shadowBlur=blur;fn();c.restore()}
export function label(c,s,x,y,col=pal.teal){tx(c,s,x,y,19,col,'Consolas',true)}
export function ball(c,x,y,s=1,angle=0){local(c,x,y,s,angle,()=>{ellipse(c,0,0,39,39,'#f5dfb7');const p=[];for(let i=0;i<5;i++)p.push([Math.sin(i*1.257)*15,-Math.cos(i*1.257)*15]);poly(c,p,pal.ink);for(let i=0;i<5;i++){c.save();c.rotate(i*1.257);stroke(c,[[0,-13],[-5,-29],[1,-36]],pal.ink,3);poly(c,[[-15,-34],[-5,-29],[6,-33],[8,-38],[-7,-38]],pal.ink);c.restore()}})}
export function keyArt(c,x,y,s=1,angle=0){local(c,x,y,s,angle,()=>{for(let i=0;i<2;i++){const color=i?'#dab26b':'#7f6744';c.save();c.translate(0,i?-6:0);rect(c,-7,0,18,89,color,4);rect(c,3,51,23,12,color,2);rect(c,4,72,20,13,color,2);ellipse(c,0,0,25,29,color);ellipse(c,0,-6,10,12,'#eee3c5');c.restore()}})}
export function jersey(c,x,y,s,num='43',rot=0){local(c,x,y,s,rot,()=>{poly(c,[[-34,-55],[-62,-41],[-90,-10],[-59,12],[-43,-7],[-43,77],[43,77],[43,-7],[62,11],[88,-11],[64,-43],[35,-56],[15,-45],[-12,-45]],'#3f756b');stroke(c,[[-18,-48],[0,-32],[20,-48]],'#d0bc85',6);tx(c,num,0,42,57,'#fce8bd','Bahnschrift',true,'center')})}
export function ticket(c,x,y,s=1,rot=0,reveal=1){local(c,x,y,s,rot,()=>{shaded(c,()=>rect(c,-102,-129,204,258,'#f5e8c7',3));rect(c,-102,-129,7,258,'#c37553');tx(c,'CAMPO / FUTEBOL',-82,-104,12,pal.teal,'Consolas',true);stroke(c,[[-80,-93],[82,-93]],'#a8a28b',1);tx(c,'Teste no clube',-82,-63,24,pal.ink,'Georgia',true);rect(c,-82,-45,164,29,'#e4cda1',3);tx(c,'AMANHÃ  ·  07h',-75,-25,14,pal.ink,'Consolas',true);tx(c,'TAXA DE AVALIAÇÃO',-82,8,11,pal.teal,'Consolas');tx(c,'R$ 200,00',-82,40,32,pal.red,'Georgia',true);stroke(c,[[-80,58],[81,58]],'#bcaf91',2);tx(c,'FAVORECIDO DO PIX',-82,80,11,pal.teal,'Consolas');tx(c,'ROGÉRIO',-82,107,25,pal.ink,'Georgia',true);if(reveal<1){rect(c,-99+205*reveal,61,201,62,'#537b70',3)}})}
export function phone(c,x,y,s,draw,rot=0){local(c,x,y,s,rot,()=>{shaded(c,()=>rect(c,-112,-194,224,388,'#223331',23),15);rect(c,-103,-183,206,362,'#edebd4',19);c.save();c.beginPath();c.roundRect(-103,-183,206,362,18);c.clip();draw();c.restore();rect(c,-27,-179,54,9,'#293836',5);rect(c,-26,166,52,3,'#6b7970',2)})}
export function field(c,x,y,w,h,p=.5,gate=true){
 c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.translate(x,y);c.scale(w/384,h/240);
 const grd=c.createLinearGradient(0,0,0,220);grd.addColorStop(0,'#84b4b8');grd.addColorStop(1,'#efd1a2');c.fillStyle=grd;c.fillRect(0,0,384,240);
 ellipse(c,308,59,24,24,'#f6d394');poly(c,[[0,160],[0,98],[61,83],[108,105],[181,78],[234,98],[306,62],[384,106],[384,240],[0,240]],'#94a493');
 poly(c,[[0,126],[81,108],[169,126],[246,96],[339,115],[384,104],[384,240],[0,240]],'#7a907d');
 rect(c,0,151,384,90,'#c78d60');poly(c,[[0,234],[174,151],[217,151],[384,234],[384,240],[0,240]],'#dca77a');
 if(gate){for(const dx of [0,243]){rect(c,dx,111,143,58,'#c5b597');rect(c,dx,105,145,7,'#b99471')}
 rect(c,138,81,10,93,'#486e78');rect(c,236,81,10,93,'#486e78');
 const gw=91*(1-.78*p);rect(c,146,105,gw,67,'#477581');for(let n=0;n<7;n++)rect(c,148+gw*n/7,106,2,64,'#7aa2a4');
 rect(c,135,70,115,22,'#ebe0b8');tx(c,'PORTÃO AZUL',192,86,12,'#365455','Consolas',true,'center')}
 c.restore()
}
export function wipeText(c,str,x,y,w,size,col,progress=1,font='Georgia',bold=false){c.save();c.beginPath();c.rect(x-2,y-size,w*clamp(progress)+2,size*1.35);c.clip();tx(c,str,x,y,size,col,font,bold);c.restore()}
export function pen(c,x,y,rot=-.68){local(c,x,y,1,rot,()=>{rect(c,-5,-101,10,88,'#ba6646',3);poly(c,[[-5,-13],[5,-13],[0,0]],'#d9b781');poly(c,[[-1.8,-4],[1.8,-4],[0,0]],'#303b34')})}
export function pointer(c,x,y,press=0){local(c,x,y,1-press*.15,0,()=>{poly(c,[[0,0],[3,27],[10,19],[19,30],[23,27],[16,16],[26,14]],'#fff1d1');stroke(c,[[0,0],[3,27],[10,19],[19,30],[23,27],[16,16],[26,14],[0,0]],'#29443e',2)})}
