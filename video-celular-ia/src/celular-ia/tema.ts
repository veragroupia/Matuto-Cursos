// Paleta e tempos do vídeo "Celular + IA grátis".
// Mesma identidade da abertura feita no projeto-exemplo (fundo laranja,
// cartela escura, letra branca pesada) + o verde da marca CenaViva.

export const COR = {
  laranja: '#e3a86a',
  chao: '#b4754a',
  escuro: '#181a1f',
  noite: '#10131a',
  branco: '#ffffff',
  sombra: '#4b2d1f',
  verde: '#b4f57e',
  teal: '#356b71',
  pele: '#dba36b',
  vermelho: '#e2574c',
  cinza: '#8a94a3',
};

export const FONTE = 'Inter, Arial, Helvetica, sans-serif';

export const FPS = 30;

// [início, fim) em frames. 30 fps.
export const CENAS = {
  gancho: [0, 240], // 0:00 — abertura original do Codex
  revela: [240, 420], // 0:08 — "esse vídeo tem uma receita"
  problema: [420, 630], // 0:14 — por que vídeos morrem em 3 s
  passo1: [630, 960], // 0:21 — PASSO 1: gancho
  passo2: [960, 1350], // 0:32 — PASSO 2: roteiro com IA grátis
  passo3: [1350, 1740], // 0:45 — PASSO 3: retenção
  passo4: [1740, 2040], // 0:58 — PASSO 4: montagem no celular
  pago: [2040, 2430], // 1:08 — grátis x pago
  cta: [2430, 2640], // 1:21 — chamada para o kit
  loop: [2640, 2790], // 1:28 — final que volta ao começo
} as const;

export const DURACAO = 2790; // 93 s
