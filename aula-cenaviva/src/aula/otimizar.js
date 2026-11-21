// Junta malhas que nunca se movem umas em relação às outras e compartilham material.
// Menos chamadas de desenho = render mais rápido, imagem idêntica.
import {T} from '../form.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function normalizar(g){
  // mergeGeometries exige os mesmos atributos e o mesmo tipo (indexado ou não) em todas.
  let x=g.index?g:g.clone();
  if(!x.index){const n=x.attributes.position.count;x.setIndex([...Array(n).keys()])}
  if(!x.attributes.uv){x.setAttribute('uv',new T.BufferAttribute(new Float32Array(x.attributes.position.count*2),2))}
  for(const k of Object.keys(x.attributes))if(!['position','normal','uv'].includes(k))x.deleteAttribute(k);
  return x;
}
/** Funde, dentro de `pai`, os filhos diretos que são Mesh simples e não estão em `manter`. */
export function fundir(pai,manter=new Set()){
  pai.updateMatrixWorld(true);
  const grupos=new Map();
  for(const o of [...pai.children]){
    if(!o.isMesh||manter.has(o)||o.children.length||Array.isArray(o.material)||!o.geometry.attributes.normal)continue;
    if(o.material.transparent||o.material.map)continue;
    const k=o.material.uuid+':'+o.castShadow+':'+o.receiveShadow;
    if(!grupos.has(k))grupos.set(k,[]);grupos.get(k).push(o);
  }
  let antes=0,depois=0;
  for(const lista of grupos.values()){
    antes+=lista.length;if(lista.length<2){depois+=lista.length;continue}
    const geos=lista.map(o=>{o.updateMatrix();const g=normalizar(o.geometry).clone();g.applyMatrix4(o.matrix);return g});
    const g=mergeGeometries(geos,false);if(!g){depois+=lista.length;continue}
    const m=new T.Mesh(g,lista[0].material);m.castShadow=lista[0].castShadow;m.receiveShadow=lista[0].receiveShadow;
    pai.add(m);for(const o of lista)pai.remove(o);depois++;
  }
  return [antes,depois];
}
/** Percorre grupos rígidos (que não deformam) fundindo seus filhos. */
export function fundirCena(raiz,manter){
  let a=0,d=0;const grupos=[];raiz.traverse(o=>{if(o.isGroup||o.isScene)grupos.push(o)});
  for(const g of grupos){const [x,y]=fundir(g,manter);a+=x;d+=y}
  return [a,d];
}
