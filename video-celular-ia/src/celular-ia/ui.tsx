import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, FONTE} from './tema';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Entrada com mola a partir de `inicio` (frame local da cena). 0 → 1. */
export const useEntrada = (inicio: number, config = {damping: 15, stiffness: 120}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - inicio, fps, config});
};

/** Aparecer suave: opacidade 0 → 1 entre `inicio` e `inicio + dur`. */
export const useFade = (inicio: number, dur = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [inicio, inicio + dur], [0, 1], clamp);
};

/** A cartela escura da abertura (mesmo raio, peso e tamanho). */
export const Cartela: React.FC<{
  inicio?: number;
  tamanho?: number;
  cor?: string;
  fundo?: string;
  largura?: number;
  children: React.ReactNode;
}> = ({inicio = 0, tamanho = 70, cor = COR.branco, fundo = COR.escuro, largura = 940, children}) => {
  const e = useEntrada(inicio);
  return (
    <div
      style={{
        maxWidth: largura,
        textAlign: 'center',
        background: fundo,
        borderRadius: 30,
        padding: '24px 44px',
        color: cor,
        fontSize: tamanho,
        fontWeight: 900,
        lineHeight: 1.12,
        letterSpacing: -1,
        fontFamily: FONTE,
        opacity: Math.min(1, e * 1.6),
        transform: `scale(${0.85 + e * 0.15})`,
        boxShadow: '0 18px 40px rgba(40,20,10,.25)',
      }}
    >
      {children}
    </div>
  );
};

/** A segunda linha da abertura: branca com sombra marrom. */
export const Linha: React.FC<{inicio?: number; tamanho?: number; children: React.ReactNode; cor?: string}> = ({
  inicio = 0,
  tamanho = 49,
  cor = COR.branco,
  children,
}) => {
  const o = useFade(inicio, 14);
  const frame = useCurrentFrame();
  const sobe = interpolate(frame, [inicio, inicio + 14], [24, 0], clamp);
  return (
    <div
      style={{
        fontSize: tamanho,
        fontWeight: 800,
        color: cor,
        textShadow: `2px 4px 8px ${COR.sombra}`,
        opacity: o,
        transform: `translateY(${sobe}px)`,
        textAlign: 'center',
        lineHeight: 1.18,
        fontFamily: FONTE,
        maxWidth: 940,
      }}
    >
      {children}
    </div>
  );
};

/** Destaque em verde CenaViva dentro de uma cartela. */
export const V: React.FC<{children: React.ReactNode; cor?: string}> = ({children, cor = COR.verde}) => (
  <span style={{color: cor}}>{children}</span>
);

/** Etiqueta "PASSO X" no topo. */
export const Etiqueta: React.FC<{inicio?: number; children: React.ReactNode; fundo?: string; cor?: string}> = ({
  inicio = 0,
  children,
  fundo = COR.verde,
  cor = '#0c1510',
}) => {
  const e = useEntrada(inicio, {damping: 12, stiffness: 160});
  return (
    <div
      style={{
        display: 'inline-block',
        background: fundo,
        color: cor,
        fontFamily: FONTE,
        fontWeight: 900,
        fontSize: 38,
        letterSpacing: 3,
        padding: '14px 30px',
        borderRadius: 999,
        transform: `translateY(${(1 - e) * -60}px)`,
        opacity: Math.min(1, e * 2),
      }}
    >
      {children}
    </div>
  );
};

/** Celular desenhado em 2D (para mostrar o passo a passo na tela). */
export const Celular: React.FC<{
  inicio?: number;
  largura?: number;
  altura?: number;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}> = ({inicio = 0, largura = 600, altura = 1060, titulo, subtitulo, children}) => {
  const e = useEntrada(inicio, {damping: 16, stiffness: 90});
  return (
    <div
      style={{
        width: largura,
        height: altura,
        borderRadius: 64,
        background: '#0b0d12',
        padding: 18,
        boxShadow: '0 40px 80px rgba(40,20,10,.45), inset 0 0 0 3px #2a2f38',
        transform: `translateY(${(1 - e) * 500}px) rotate(${(1 - e) * 8}deg)`,
        opacity: Math.min(1, e * 2),
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 48,
          background: '#11161f',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: FONTE,
          position: 'relative',
        }}
      >
        {/* câmera frontal */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            width: 120,
            height: 30,
            marginLeft: -60,
            borderRadius: 20,
            background: '#000',
          }}
        />
        <div style={{padding: '64px 30px 18px', borderBottom: '1px solid #253042'}}>
          <div style={{color: COR.branco, fontWeight: 900, fontSize: 30}}>{titulo}</div>
          {subtitulo ? <div style={{color: COR.verde, fontWeight: 700, fontSize: 22, marginTop: 4}}>{subtitulo}</div> : null}
        </div>
        <div style={{flex: 1, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 16}}>
          {children}
        </div>
      </div>
    </div>
  );
};

/** Texto sendo digitado, com cursor piscando. */
export const Digitando: React.FC<{texto: string; inicio: number; fim: number}> = ({texto, inicio, fim}) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [inicio, fim], [0, texto.length], clamp));
  const cursor = frame < fim + 20 && Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{whiteSpace: 'pre-wrap'}}>
      {texto.slice(0, n)}
      <span style={{opacity: cursor ? 1 : 0, color: COR.verde}}>▍</span>
    </span>
  );
};

/** Wrapper de cena: entra e sai com fade curto (sem cortes secos). */
export const Cena: React.FC<{duracao: number; children: React.ReactNode; semSaida?: boolean}> = ({
  duracao,
  children,
  semSaida,
}) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [0, 6], [0, 1], clamp);
  const saida = semSaida ? 1 : interpolate(frame, [duracao - 8, duracao], [1, 0], clamp);
  return <div style={{position: 'absolute', inset: 0, opacity: Math.min(entrada, saida)}}>{children}</div>;
};
