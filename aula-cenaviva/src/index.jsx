import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, staticFile, Audio, delayRender, continueRender, cancelRender} from 'remotion';
import {makeFilm} from './stage.js';
import {montarPalco} from './aula/palco.js';
import cut from './cut.json';
import aula from './aula.json';

// Um componente para os dois filmes: recebe a função que monta o palco WebGL.
function Palco({montar,audio}){
  const canvas=React.useRef(null), stage=React.useRef(null), frame=useCurrentFrame();
  const latest=React.useRef(frame); latest.current=frame;
  const [handle]=React.useState(()=>delayRender('Preparando o quarto, as fontes e as texturas'));
  React.useLayoutEffect(()=>{
    let active=true;
    montar(canvas.current, staticFile).then(film=>{
      if(!active){film.dispose();return;}
      stage.current=film; film.draw(latest.current); continueRender(handle);
    }).catch(cancelRender);
    return ()=>{active=false;stage.current?.dispose();stage.current=null;};
  },[handle]);
  React.useLayoutEffect(()=>{stage.current?.draw(frame)},[frame]);
  return <AbsoluteFill style={{background:'#202a2c'}}><canvas ref={canvas} width={1920} height={1080} style={{width:'100%',height:'100%'}}/><Audio src={staticFile(audio)}/></AbsoluteFill>
}
const Piloto=()=> <Palco montar={makeFilm} audio="mix.wav"/>;
const Aula=()=> <Palco montar={montarPalco} audio="aula.wav"/>;
function Root(){return <>
  <Composition id="ORecibo" component={Piloto} width={1920} height={1080} fps={60} durationInFrames={cut.frames}/>
  <Composition id="AulaCenaViva" component={Aula} width={1920} height={1080} fps={60} durationInFrames={aula.frames}/>
</>}
registerRoot(Root);
