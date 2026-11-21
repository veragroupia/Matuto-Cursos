import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENAS, COR, FONTE} from './tema';
import {Personagem} from './Personagem';
import {Cena} from './ui';
import {
  CenaCTA,
  CenaGancho,
  CenaLoop,
  CenaPago,
  CenaPasso1,
  CenaPasso2,
  CenaPasso3,
  CenaPasso4,
  CenaProblema,
  CenaRevela,
} from './cenas';

// "Como fazer vídeos que prendem só com CELULAR + IA GRÁTIS"
// Continuação da abertura de 8 s do projeto-exemplo (CenaVivaDemo):
// o gancho é o mesmo, o personagem é o mesmo, e o final volta ao começo.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ROTEIRO: Array<[keyof typeof CENAS, React.FC]> = [
  ['gancho', CenaGancho],
  ['revela', CenaRevela],
  ['problema', CenaProblema],
  ['passo1', CenaPasso1],
  ['passo2', CenaPasso2],
  ['passo3', CenaPasso3],
  ['passo4', CenaPasso4],
  ['pago', CenaPago],
  ['cta', CenaCTA],
  ['loop', CenaLoop],
];

export const VideoCelularIA: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // Na cena "grátis x pago" o fundo escurece: muda o clima, avisa que é o segredo.
  const noite = interpolate(frame, [CENAS.pago[0], CENAS.pago[0] + 14, CENAS.pago[1] - 12, CENAS.pago[1]], [0, 1, 1, 0], clamp);

  // Barrinha de progresso discreta no topo (sensação de "falta pouco").
  const progresso = frame / CENAS.loop[0];

  return (
    <AbsoluteFill style={{backgroundColor: COR.laranja, fontFamily: FONTE}}>
      <AbsoluteFill style={{backgroundColor: COR.noite, opacity: noite}} />

      <ThreeCanvas width={width} height={height} camera={{position: [0, 1, 6.7], fov: 43}} style={{width, height}}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 6, 5]} intensity={3.0} />
        <mesh position={[0, -2.35, -0.6]}>
          <boxGeometry args={[12, 0.25, 12]} />
          <meshStandardMaterial color={COR.chao} transparent opacity={1 - noite} />
        </mesh>
        <Personagem frame={frame} />
      </ThreeCanvas>

      {ROTEIRO.map(([nome, Componente]) => {
        const [ini, fim] = CENAS[nome];
        return (
          <Sequence key={nome} from={ini} durationInFrames={fim - ini} name={nome}>
            {nome === 'gancho' ? (
              <Componente />
            ) : (
              <Cena duracao={fim - ini} semSaida={nome === 'loop'}>
                <Componente />
              </Cena>
            )}
          </Sequence>
        );
      })}

      {frame > CENAS.gancho[1] && frame < CENAS.loop[0] ? (
        <div style={{position: 'absolute', top: 150, left: 90, right: 90, height: 8, borderRadius: 4, background: 'rgba(24,26,31,.18)'}}>
          <div style={{width: `${Math.min(1, progresso) * 100}%`, height: '100%', borderRadius: 4, background: COR.verde}} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
