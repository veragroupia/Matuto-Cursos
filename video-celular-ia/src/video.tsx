import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';

// Exemplo ORIGINAL e SIMPLES: substitua a cena e o texto por sua própria história.
// A animação é determinística: o frame determina completamente a imagem.
const Protagonista: React.FC<{frame: number}> = ({frame}) => {
  const y = Math.sin(frame * 0.13) * 0.10;
  const turn = Math.sin(frame / 22) * 0.14;
  return (
    <group position={[0, y - 0.3, 0]} rotation={[0, turn, 0]}>
      <mesh position={[0, 0.55, 0]}><boxGeometry args={[1.45, 1.5, 0.9]} /><meshStandardMaterial color="#dba36b" /></mesh>
      <mesh position={[-0.28, 0.73, 0.48]}><boxGeometry args={[0.17, 0.18, 0.06]} /><meshStandardMaterial color="#161616" /></mesh>
      <mesh position={[0.28, 0.73, 0.48]}><boxGeometry args={[0.17, 0.18, 0.06]} /><meshStandardMaterial color="#161616" /></mesh>
      <mesh position={[0, -0.85, 0]}><boxGeometry args={[1.15, 1.2, 0.75]} /><meshStandardMaterial color="#356b71" /></mesh>
    </group>
  );
};

export const CenaVivaDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const appearing = spring({frame, fps, config: {damping: 16, stiffness: 100}});
  const secondLine = interpolate(frame, [70, 88, 180, 205], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#e3a86a', fontFamily: 'Arial, sans-serif'}}>
      <ThreeCanvas width={width} height={height} camera={{position: [0, 1, 6.7], fov: 43}} style={{width, height}}>
        <ambientLight intensity={1.8}/>
        <directionalLight position={[3, 6, 5]} intensity={3.0}/>
        <mesh position={[0, -2.35, -0.6]}><boxGeometry args={[12, 0.25, 12]}/><meshStandardMaterial color="#b4754a" /></mesh>
        <Protagonista frame={frame}/>
      </ThreeCanvas>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 265, pointerEvents: 'none'}}>
        <div style={{maxWidth: 930, textAlign: 'center', background: '#181a1f', borderRadius: 30, padding: '24px 44px', color: '#fff', fontSize: 78, fontWeight: 900, transform: `scale(${0.85 + appearing * 0.15})`}}>
          UMA ESCOLHA MUDA TUDO.
        </div>
        <div style={{fontSize: 49, fontWeight: 800, color: '#fff', textShadow: '2px 4px 8px #4b2d1f', opacity: secondLine, marginTop: 26}}>
          O QUE VOCÊ FARIA?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
