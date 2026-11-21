import {T,V,group,box,orb,cyl,rod,plane,mesh,shadow,canvasTex} from './form.js';
const teal='#27484b', pine='#594334', cream='#ead9b6', metal='#293c3b';
export function room(scene,tex){
  scene.background=new T.Color('#90a4a1');
  const wood=new T.MeshStandardMaterial({map:tex.madeira,roughness:.88});
  const ao=canvasTex(128,128,c=>{let g=c.createRadialGradient(64,64,0,64,64,63);g.addColorStop(0,'rgba(36,21,14,.85)');g.addColorStop(.50,'rgba(38,25,21,.40)');g.addColorStop(1,'rgba(38,25,21,0)');c.fillStyle=g;c.fillRect(0,0,128,128)});
  box(scene,0,1.78,-1.57,8,3.6,.15,'#5a8179',0);box(scene,-2.46,1.78,0,.18,3.6,4,'#b87757',0);box(scene,0,-.05,0,8,.10,6,'#9f7757',0);
  box(scene,0,.09,-1.44,7,.16,.05,'#45675e',.008);
  // Janela com guarnições, paisagem do sertão e luz baixa.
  const win=group(scene,-1.42,1.81,-1.46);
  box(win,0,0,0,1.62,1.19,.10,'#433c32',.023);plane(win,0,0,.058,1.50,1.065,tex.janela);
  box(win,0,-.58,.09,1.70,.078,.18,'#a97650',.018);
  for(const x of [-.77,.0,.77])box(win,x,0,.085,.038,1.14,.048,'#ddbe90',.006);
  box(win,0,.21,.09,1.55,.032,.042,'#ddbe90',.006);
  // Sombra suave em faixas de madeira no encontro das paredes.
  for(let i=0;i<16;i++)box(scene,1.22+i*.105,1.8,-1.46,.042,3.6,.07,'#39635d',.008);
  const poster=group(scene,.39,1.90,-1.44);poster.rotation.z=-.015;
  box(poster,0,0,0,.78,1.0,.065,pine,.012);plane(poster,0,0,.035,.725,.948,tex.cartaz,true);
  box(scene,1.54,1.59,-1.28,.94,.055,.34,wood);
  for(let i=0;i<5;i++){const b=box(scene,1.25+i*.063,1.76,-1.28,.052,.28+.033*Math.sin(i*2),.14,['#cd875e','#dfc291','#476861','#b7b69b','#a3664f'][i]);b.rotation.z=(i-2)*.03}
  function cactus(p,x,y,z,sc){
    const g=group(p,x,y,z);g.scale.setScalar(sc);cyl(g,0,.084,0,.108,.077,.17,'#ae6646');
    cyl(g,0,.17,0,.097,.097,.012,'#584a36');orb(g,0,.29,0,.05,.16,.052,'#5c7a54');
    rod(g,[-.02,.25,0],[-.09,.29,0],.03,'#617f58');orb(g,-.087,.32,0,.031,.056,.032,'#617f58');
    rod(g,[.015,.30,0],[.069,.34,0],.025,'#4c7656');orb(g,.071,.366,0,.029,.052,.027,'#4c7656')
  }
  cactus(scene,1.75,1.62,-1.27,.8);cactus(scene,-1.80,1.29,-1.27,.8);
  // Banco de trabalho em L, equipamentos e objetos do professor.
  box(scene,0,.81,.515,3.64,.102,1.05,wood,.036);
  box(scene,.99,.81,-.36,1.65,.102,.77,wood,.02);
  for(const x of [-1.51,1.54]){box(scene,x,.39,.70,.095,.79,.095,metal);box(scene,x,.39,.02,.095,.79,.095,metal)}
  box(scene,.045,.866,.62,1.12,.012,.58,'#466f69',.045);
  for(let i=0;i<18;i++)box(scene,-.465+i*.058,.8727,.86,.002,.001,.018+(i%5===0?.014:0),'#a4a68c',0)
  const mon=group(scene,.78,1.41,-.058);mon.rotation.y=-.17;
  box(mon,0,-.52,.01,.42,.032,.24,metal,.015);box(mon,0,-.35,0,.064,.36,.062,metal);
  box(mon,0,0,0,1.23,.702,.06,'#263332',.031);
  plane(mon,0,.005,.032,1.19,.650,tex.monitor);
  const film=plane(mon,.025,.027,.035,.330,.587,tex.campo[0]);film.material.map=tex.campo[0];
  const bar=box(mon,-.553,-.275,.036,1.075,.004,.002,'#dd9e75',0);bar.geometry=bar.geometry.clone().translate(.5375,0,0);
  orb(mon,.555,-.335,.031,.004,.004,.002,'#a4dcb9');
  shadow(scene,.78,.864,-.016,.56,.29,ao,.58);
  const keys=group(scene,.76,.876,.33);keys.rotation.y=-.13;
  box(keys,0,0,0,.59,.035,.18,'#3c4947');for(let row=0;row<4;row++){for(let i=0;i<14;i++)box(keys,(i-6.5)*.039,.023,(row-1.5)*.039,.031,.016,.028,row===0?'#7f8c82':'#b4b5a6',.004)}
  orb(scene,1.17,.895,.37,.052,.033,.075,'#c9ccbb');
  const speaker=group(scene,1.52,1.08,-.16);box(speaker,0,0,0,.22,.42,.19,metal,.018);
  for(const [y,r] of [[-.061,.075],[.10,.033]]){orb(speaker,0,y,.105,r,r,.012,'#59645b');orb(speaker,0,y,.117,r*.45,r*.45,.009,'#293737')}
  // Caneca esmaltada e café com elipse escura, no mesmo lugar em todos os planos.
  const mug=group(scene,-1.03,.867,.51);
  cyl(mug,0,.084,0,.093,.079,.16,'#e4d9b9');cyl(mug,0,.166,0,.095,.095,.013,'#48685f');
  cyl(mug,0,.173,0,.083,.083,.003,'#51392d');
  mesh(mug,new T.TorusGeometry(.055,.013,12,32),'#d7cbaa',.097,.083,0);
  shadow(scene,-1.03,.864,.51,.30,.26,ao,.48);
  // Lampadaire articulé et petit enregistreur de table.
  const lamp=group(scene,-1.49,.861,.09);cyl(lamp,0,.018,0,.15,.16,.035,'#385953');
  rod(lamp,[0,.02,0],[.035,.41,0],.019,'#3c5c53');rod(lamp,[.035,.41,0],[.246,.57,0],.017,'#3c5c53');
  const shade=cyl(lamp,.256,.532,.005,.055,.119,.105,'#d09056');shade.rotation.z=.25;
  cyl(lamp,.265,.478,.006,.105,.105,.006,new T.MeshBasicMaterial({color:'#ffe9b5'}));
  const mic=group(scene,-1.22,.87,.85);mic.rotation.y=.25;cyl(mic,0,.012,0,.079,.087,.024,metal);rod(mic,[0,.022,0],[.015,.17,0],.013,metal);
  const head=box(mic,.03,.22,0,.067,.13,.058,'#38423e',.026);head.rotation.z=-.18;
  for(let i=0;i<5;i++)box(mic,.031,.19+i*.014,.029,.049,.003,.002,'#89918a',0);
  const receipt=group(scene),rw=.325,rh=.45;
  box(receipt,0,0,0,rw,rh,.008,'#e8d8b9',.003);plane(receipt,0,0,.0044,rw-.003,rh-.003,tex.recibo,true);
  const back=plane(receipt,0,0,-.0044,rw-.003,rh-.003,tex.verso,true);back.rotation.y=Math.PI;
  const tab=group(receipt,0,-.156,.009);box(tab,0,0,0,rw+.006,.13,.007,'#54766a',.003);plane(tab,0,0,.004,rw,.126,tex.tira,true);
  const book=group(scene);box(book,0,0,0,.352,.475,.017,'#c08663',.008);plane(book,0,0,.009,.346,.466,tex.caderno,true);
  const receiptShadow=shadow(scene,-.012,.875,.615,.51,.59,ao,.30);
  return {mon,film,bar,receipt,tab,book,receiptShadow,mug};
}
