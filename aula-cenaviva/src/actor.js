import {T,V,group,box,orb,cyl,mesh,rod,clamp,mix} from './form.js';
/* Rig em blocos com a paleta, cicatriz e proporções do elenco fornecido.
   Os tornozelos e o quadril são fixos. Ombros e pulsos resolvem a pose no espaço da mesa. */
const skin='#9a6240', shirt='#c89a3a',hair='#211916',dark='#251c19';
export function actor(scene){
  const root=group(scene,-.53,0,.025);
  for(const side of [-1,1]){
    const x=side*.145;
    box(root,x,.38,0,.185,.51,.20,skin,.045);box(root,x,.64,0,.237,.27,.265,'#56739a',.038);
    box(root,x,.095,.065,.209,.12,.324,skin,.045)
  }
  const body=group(root,0,.69,0);
  box(body,0,.30,0,.51,.57,.30,shirt,.054);box(body,0,.018,0,.50,.16,.29,'#56739a',.04);
  box(body,0,.54,.153,.20,.031,.016,'#946c32',.011);orb(body,.075,.496,.154,.012,.016,.005,'#493c2c');
  box(body,0,.59,0,.169,.135,.148,skin,.03);
  const neck=group(body,0,.608,.003),head=group(neck,0,.244,.008);
  const face=box(head,0,.004,0,.55,.526,.488,skin,.074);face.receiveShadow=false;
  for(const side of [-1,1]){
    box(head,side*.282,-.015,-.018,.07,.119,.10,skin,.032);
    box(head,side*.306,-.017,.024,.026,.062,.019,'#8a5135',.009);
  }
  box(head,0,.24,-.025,.565,.119,.49,hair,.042);box(head,0,.118,-.208,.56,.29,.10,hair,.038);
  let seed=72;const rnd=()=>((seed=(seed*16807)%2147483647)/2147483647);
  for(let j=0;j<4;j++)for(let i=0;i<5;i++){
    let w=.131+rnd()*.028;
    let tuft=box(head,(i-2)*.108+(rnd()-.5)*.026,.258+rnd()*.034+(1-Math.abs(i-2)/2)*.024,(j-1.5)*.119,w,.107+rnd()*.052,.136,['#261d19','#211a18','#2d221c','#251e1b'][Math.floor(rnd()*4)],.045);
    tuft.rotation.set(rnd()*.13,rnd()*.38-.19,rnd()*.24-.12)
  }
  for(const s of [-1,1])box(head,s*.258,.137,-.072,.05,.145,.24,hair,.022);
  const eyes=[],brows=[];
  for(const s of [-1,1]){
    const eye=group(head,s*.119,.022,.245);
    box(eye,0,0,.002,.123,.128,.022,'#7a4834',.026);
    box(eye,0,.003,.012,.119,.119,.021,'#fff1da',.021);
    const iris=group(eye,0,0,.032);
    box(iris,0,0,0,.065,.084,.015,'#5b3b26',.021);
    box(iris,0,0,.006,.046,.068,.014,'#201a17',.018);
    orb(iris,-.012,.021,.016,.010,.010,.006,'#fffbed');
    const eyelid=group(eye,0,.064,.052);
    box(eyelid,0,-.061,0,.127,.127,.014,skin,.006);
    box(eyelid,0,-.122,.006,.112,.007,.005,'#724630',.002);
    eyes.push({eye,iris,eyelid,s});
    const brow=group(head,s*.117,.124,.259);
    if(s<0)box(brow,0,0,0,.148,.040,.039,hair,.013);
    else {box(brow,-.039,0,0,.074,.040,.039,hair,.009);box(brow,.048,0,0,.054,.040,.039,hair,.009);
      box(brow,.011,.001,.003,.010,.062,.018,'#e6c7a0',.004).rotation.z=-.24}
    brows.push(brow);
    for(let i=0;i<4;i++)orb(head,s*(.144+i*.016),-.063+Math.sin(i*2)*.012,.244,.006,.004,.004,'#8e5638');
  }
  box(head,0,-.044,.271,.075,.083,.067,'#a46a46',.021);
  const mouth=group(head,0,-.148,.252);
  // Silhuetas contínuas: a mandíbula abre, os cantos sorriem e a vogal muda a largura.
  const mGeo=new T.BufferGeometry(),mouthPos=new Float32Array(42*3);
  mGeo.setAttribute('position',new T.BufferAttribute(mouthPos,3));const index=[];
  for(let i=0;i<20;i++)index.push(i*2,i*2+1,i*2+2,i*2+2,i*2+1,i*2+3);
  mGeo.setIndex(index);const cavity=mesh(mouth,mGeo,new T.MeshBasicMaterial({color:'#49271f',side:T.DoubleSide}),0,0,0);cavity.frustumCulled=false;cavity.castShadow=false;
  const teeth=box(mouth,0,0,.002,.086,.014,.006,'#f1d8b9',.003);
  const arms=[-1,1].map(s=>{
    const upper=group(scene),lower=group(scene),hand=group(scene);
    box(upper,0,-.143,0,.144,.311,.15,skin,.034);
    box(upper,0,-.060,0,.196,.165,.19,shirt,.035);
    box(lower,0,-.143,0,.131,.31,.139,skin,.035);
    box(hand,0,-.010,.008,.135,.107,.101,skin,.030);
    box(hand,-s*.065,-.010,.050,.050,.080,.056,'#a16a46',.018).rotation.z=-s*.3;
    const fingers=[];
    for(let j=0;j<4;j++){
      const knuckle=group(hand,s*(j-1.5)*.030,-.048,.005);
      const length=[.085,.093,.083,.067][j];
      box(knuckle,0,-length*.39,.009,.032,length,.063,skin,.014);fingers.push(knuckle);
    }
    return {s,upper,lower,hand,fingers}
  });
  const down=V(0,-1,0);
  function place(arm,target,turn,point){
    const {s,upper,lower,hand}=arm;
    const shoulder=body.localToWorld(V(s*.297,.509,.005));
    let delta=target.clone().sub(shoulder),d=clamp(delta.length(),.08,.59),axis=delta.normalize();
    const wrist=shoulder.clone().addScaledVector(axis,d);
    const pole=V(s*.66,-.85,-.22);pole.addScaledVector(axis,-pole.dot(axis)).normalize();
    const elbow=shoulder.clone().addScaledVector(axis,d/2).addScaledVector(pole,Math.sqrt(Math.max(0,.30**2-(d/2)**2)));
    upper.position.copy(shoulder);upper.quaternion.setFromUnitVectors(down,elbow.clone().sub(shoulder).normalize());
    lower.position.copy(elbow);lower.quaternion.setFromUnitVectors(down,wrist.clone().sub(elbow).normalize());
    hand.position.copy(wrist);hand.rotation.set(-.75+turn*.65,s*turn*.42,-s*.14+turn*.14);
    arm.fingers.forEach((f,j)=>{f.rotation.x=-.15-.80*turn+(j===0?point*.63:0);f.rotation.z=s*(j-1.5)*(.037+.055*(1-turn))});
    return wrist;
  }
  return function pose(p){
    body.rotation.set(p.lean,p.turn*.28,p.tilt*.22);body.position.y=.69+p.breathe;
    root.position.set(-.53+p.reach*.11,0,.025+p.reach*.15);
    neck.rotation.set(p.pitch,p.turn,p.tilt);
    eyes.forEach(({iris,eyelid,s})=>{
      eyelid.visible=p.blink>.035;
      eyelid.scale.y=Math.min(1.08,p.blink*1.075);
      iris.position.x=clamp(p.gazeX*.025-s*.004,-.03,.03);iris.position.y=p.gazeY*.018;
    });
    brows.forEach((b,i)=>{const s=i?1:-1;b.position.y=.125+p.brow*.023+(i?p.asym*.032:0);b.rotation.z=s*(p.concern*.25-p.smile*.09)+p.asym*.1});
    const open=p.open,wide=.054+p.smile*.023+p.wide*.017-open*.004;
    for(let i=0;i<=20;i++){
      let x=i/10-1,shape=Math.pow(Math.max(0,1-x*x),.69),lift=p.smile*.018*x*x;
      let xx=x*wide;mouthPos.set([xx,lift+(.002+open*.015)*shape,.001,xx,lift-(.004+open*.051)*shape,.001],i*6);
    }
    mGeo.attributes.position.needsUpdate=true;
    teeth.visible=open>.21 && p.wide>-.40;teeth.position.y=.002+open*.009;teeth.scale.x=clamp(wide/.09,.48,.9);teeth.scale.y=clamp(open*.85,.18,.8);
    return arms.map((a,i)=>place(a,p.hands[i],p.handTurns[i],i?p.reach:0))
  }
}
