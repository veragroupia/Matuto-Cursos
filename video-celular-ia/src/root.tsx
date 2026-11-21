import React from 'react';
import {Composition} from 'remotion';
import {CenaVivaDemo} from './video';
import {VideoCelularIA} from './celular-ia/VideoCelularIA';
import {DURACAO, FPS} from './celular-ia/tema';

export const Root: React.FC = () => (
  <>
    {/* Abertura original de 8 s (onde o Codex parou) */}
    <Composition id="CenaVivaDemo" component={CenaVivaDemo} width={1080} height={1920} fps={30} durationInFrames={240} />
    {/* Vídeo completo: celular + IA grátis, grátis x pago, final em loop */}
    <Composition id="VideoCelularIA" component={VideoCelularIA} width={1080} height={1920} fps={FPS} durationInFrames={DURACAO} />
  </>
);
