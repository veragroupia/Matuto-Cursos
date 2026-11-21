import React from 'react';
import {interpolate} from 'remotion';
import {COR, CENAS} from './tema';

// O MESMO protagonista geométrico da abertura, agora com boca (narra o vídeo),
// piscadas, braço e um celular na mão. Tudo determinístico: só depende do frame.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Onde o personagem fica em cada cena: [frame, x, y, escala]
// Grande e centralizado no gancho/revelação/loop (igual à abertura);
// "apresentador" pequeno embaixo nas cenas de conteúdo;
// no canto inferior esquerdo quando o celular gigante ocupa a tela.
const C = CENAS;
const T = 24; // frames de transição de posição
const centro = [0, 0, 1];
const apresentador = [0, -0.58, 0.55];
const canto = [-0.98, -0.62, 0.45];

const chaves: Array<[number, number[]]> = [
  [0, centro],
  [C.revela[1], centro],
  [C.revela[1] + T, apresentador],
  [C.passo2[0], apresentador],
  [C.passo2[0] + T, canto],
  [C.passo2[1], canto],
  [C.passo2[1] + T, apresentador],
  [C.passo4[0], apresentador],
  [C.passo4[0] + T, canto],
  [C.passo4[1], canto],
  [C.passo4[1] + T, apresentador],
  [C.loop[0], apresentador],
  [C.loop[0] + T, centro],
  [C.loop[1], centro],
];

const posicao = (frame: number) => {
  const fs = chaves.map((k) => k[0]);
  return [0, 1, 2].map((i) =>
    interpolate(
      frame,
      fs,
      chaves.map((k) => k[1][i]),
      {...clamp, easing: (t) => t * t * (3 - 2 * t)},
    ),
  );
};

export const Personagem: React.FC<{frame: number}> = ({frame}) => {
  const [x, yBase, s] = posicao(frame);

  // Mesmo balanço da abertura
  const y = Math.sin(frame * 0.13) * 0.1;
  const turn = Math.sin(frame / 22) * 0.14;

  // Giro de "revelação" quando o celular aparece
  const giro = interpolate(frame, [C.revela[0] + 40, C.revela[0] + 75], [0, Math.PI * 2], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Celular entra na mão logo depois do giro e sai no loop final
  const celular = interpolate(
    frame,
    [C.revela[0] + 62, C.revela[0] + 80, C.loop[0] + 10, C.loop[0] + 30],
    [0, 1, 1, 0],
    clamp,
  );

  // Susto no "por que seus vídeos morrem?"
  const susto = interpolate(
    frame,
    [C.problema[0], C.problema[0] + 8, C.problema[0] + 70, C.problema[0] + 85],
    [0, 1, 1, 0],
    clamp,
  );

  // Brilho da tela do celular: mais forte quando falamos do plano PAGO
  const brilho = interpolate(frame, [C.pago[0] + 200, C.pago[0] + 230], [0.6, 2.4], clamp);

  // Piscada a cada ~3 s
  const ciclo = frame % 95;
  const piscada = ciclo > 90 ? 0.12 : 1;
  const olho = piscada * (1 + susto * 0.55);

  // Boca: "fala" durante o vídeo, com pausas curtas a cada frase
  const falando = frame < C.loop[1] - 35 && frame % 75 < 62 ? 1 : 0;
  const boca = 0.035 + falando * Math.abs(Math.sin(frame * 0.55)) * 0.07 + susto * 0.12;

  return (
    <group position={[x, yBase, 0]} scale={s}>
      <group position={[0, y - 0.3, 0]} rotation={[0, turn + giro, 0]}>
        {/* cabeça */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.45, 1.5, 0.9]} />
          <meshStandardMaterial color={COR.pele} />
        </mesh>
        {/* olhos */}
        <mesh position={[-0.28, 0.73, 0.48]} scale={[1 + susto * 0.3, olho, 1]}>
          <boxGeometry args={[0.17, 0.18, 0.06]} />
          <meshStandardMaterial color="#161616" />
        </mesh>
        <mesh position={[0.28, 0.73, 0.48]} scale={[1 + susto * 0.3, olho, 1]}>
          <boxGeometry args={[0.17, 0.18, 0.06]} />
          <meshStandardMaterial color="#161616" />
        </mesh>
        {/* boca */}
        <mesh position={[0, 0.33, 0.47]}>
          <boxGeometry args={[0.34 - susto * 0.12, boca, 0.05]} />
          <meshStandardMaterial color="#5a2a1c" />
        </mesh>
        {/* corpo */}
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[1.15, 1.2, 0.75]} />
          <meshStandardMaterial color={COR.teal} />
        </mesh>
        {/* braço + celular */}
        <group position={[0.5, -0.62, 0.42]} scale={celular} rotation={[0.35, -0.25, 0]}>
          <mesh position={[0.05, -0.05, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.18, 0.55, 0.18]} />
            <meshStandardMaterial color={COR.teal} />
          </mesh>
          <mesh position={[-0.12, 0.28, 0.12]}>
            <boxGeometry args={[0.34, 0.6, 0.05]} />
            <meshStandardMaterial color="#14161b" />
          </mesh>
          <mesh position={[-0.12, 0.28, 0.15]}>
            <boxGeometry args={[0.29, 0.52, 0.01]} />
            <meshStandardMaterial color={COR.verde} emissive={COR.verde} emissiveIntensity={brilho} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
