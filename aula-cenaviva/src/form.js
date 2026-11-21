import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
export {T};
export const V=(x,y,z)=>new T.Vector3(x,y,z);
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
export const mix=(a,b,t)=>a+(b-a)*t;
export const ramp=(t,a,b)=>ease((t-a)/(b-a));
export const pulse=(t,a,b,c,d)=>ramp(t,a,b)*(1-ramp(t,c,d));
export function track(t,keys){let i=1;while(i<keys.length && t>keys[i][0])i++;if(i===keys.length)return keys.at(-1)[1];let [a,x]=keys[i-1],[b,y]=keys[i];return mix(x,y,ramp(t,a,b))}
const geometry=new Map(), materials=new Map();
export function mat(c){if(typeof c!=='string')return c;if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.84}));return materials.get(c)}
export function group(parent,x=0,y=0,z=0){const g=new T.Group();parent.add(g);g.position.set(x,y,z);return g}
export function mesh(parent,g,m,x,y,z){const o=new T.Mesh(g,mat(m));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o}
export function box(p,x,y,z,w,h,d,c,r=.015){const k=[w,h,d,r].join(':');if(!geometry.has(k))geometry.set(k,r?new RoundedBoxGeometry(w,h,d,2,Math.min(r,w*.48,h*.48,d*.48)):new T.BoxGeometry(w,h,d));return mesh(p,geometry.get(k),c,x,y,z)}
const sphere=new T.SphereGeometry(1,20,14);
export function orb(p,x,y,z,w,h,d,c){const o=mesh(p,sphere,c,x,y,z);o.scale.set(w,h,d);return o}
export function cyl(p,x,y,z,a,b,h,c,n=24){return mesh(p,new T.CylinderGeometry(a,b,h,n),c,x,y,z)}
export function rod(p,a,b,w,c){const start=V(...a),end=V(...b);const o=cyl(p,0,0,0,w,w,end.distanceTo(start),c,12);o.position.copy(start).lerp(end,.5);o.quaternion.setFromUnitVectors(V(0,1,0),end.sub(start).normalize());return o}
export function plane(p,x,y,z,w,h,texture,lit=false){let m=lit?new T.MeshStandardMaterial({map:texture,roughness:.94}):new T.MeshBasicMaterial({map:texture,toneMapped:false});let o=mesh(p,new T.PlaneGeometry(w,h),m,x,y,z);o.castShadow=false;return o}
export function shadow(p,x,y,z,w,d,tex,opacity=.35){const o=mesh(p,new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity,toneMapped:false}),x,y,z);o.rotation.x=-Math.PI/2;o.castShadow=o.receiveShadow=false;return o}
export function canvasTex(w,h,fn){let c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'));let tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex}
