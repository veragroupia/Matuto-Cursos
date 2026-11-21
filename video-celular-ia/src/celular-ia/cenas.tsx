import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, FONTE} from './tema';
import {Cartela, Celular, Digitando, Etiqueta, Linha, V, useEntrada, useFade} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Topo: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 210, gap: 26, pointerEvents: 'none'}}>{children}</AbsoluteFill>
);

const Base: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 26}) => (
  <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 265, gap, pointerEvents: 'none'}}>
    {children}
  </AbsoluteFill>
);

const Meio: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 0:00 — GANCHO (exatamente a abertura que o Codex deixou pronta)
// ─────────────────────────────────────────────────────────────
export const CenaGancho: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appearing = spring({frame, fps, config: {damping: 16, stiffness: 100}});
  const secondLine = interpolate(frame, [70, 88, 180, 205], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 265, pointerEvents: 'none', fontFamily: FONTE}}>
      <div style={{maxWidth: 930, textAlign: 'center', background: COR.escuro, borderRadius: 30, padding: '24px 44px', color: '#fff', fontSize: 78, fontWeight: 900, transform: `scale(${0.85 + appearing * 0.15})`}}>
        UMA ESCOLHA MUDA TUDO.
      </div>
      <div style={{fontSize: 49, fontWeight: 800, color: '#fff', textShadow: `2px 4px 8px ${COR.sombra}`, opacity: secondLine, marginTop: 26}}>
        O QUE VOCÊ FARIA?
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// 0:08 — REVELAÇÃO: o vídeo é a prova. Abre um "loop" de curiosidade.
// ─────────────────────────────────────────────────────────────
export const CenaRevela: React.FC = () => (
  <>
    <Topo>
      <Cartela tamanho={70}>
        ESSE VÍDEO TEM UMA <V>RECEITA</V>.
      </Cartela>
      <Linha inicio={40}>E dá pra fazer ela inteira só com:</Linha>
      <Cartela inicio={80} tamanho={84} fundo={COR.verde} cor="#0c1510">
        CELULAR + IA GRÁTIS
      </Cartela>
    </Topo>
    <Base>
      <Linha inicio={120} tamanho={42}>
        …e no final eu te mostro o atalho
        <br />
        que deixa tudo <V>muito melhor</V>.
      </Linha>
    </Base>
  </>
);

// ─────────────────────────────────────────────────────────────
// 0:14 — PROBLEMA: os 3 segundos
// ─────────────────────────────────────────────────────────────
export const CenaProblema: React.FC = () => {
  const frame = useCurrentFrame();
  const restante = interpolate(frame, [20, 110], [3, 0], clamp);
  const numero = Math.ceil(restante);
  const anel = interpolate(frame, [20, 110], [1, 0], clamp);
  const sumiu = interpolate(frame, [110, 118], [0, 1], clamp);
  const relogio = interpolate(frame, [125, 135], [1, 0], clamp);
  const dedo = interpolate(frame, [104, 122], [0, 1], clamp);
  const R = 150;
  const circ = 2 * Math.PI * R;
  return (
    <>
      <Topo>
        <Cartela tamanho={64}>
          POR QUE A MAIORIA DOS VÍDEOS <V cor={COR.vermelho}>MORRE</V> NOS 3 PRIMEIROS SEGUNDOS?
        </Cartela>
      </Topo>

      {/* contagem regressiva = o tempo que você tem antes do dedo arrastar */}
      <Meio top={640} style={{opacity: relogio}}>
        <div style={{position: 'relative', width: 360, height: 360}}>
          <svg width={360} height={360} style={{position: 'absolute', inset: 0}}>
            <circle cx={180} cy={180} r={R} stroke="rgba(24,26,31,.25)" strokeWidth={26} fill="none" />
            <circle
              cx={180}
              cy={180}
              r={R}
              stroke={numero <= 1 ? COR.vermelho : COR.escuro}
              strokeWidth={26}
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - anel)}
              strokeLinecap="round"
              transform="rotate(-90 180 180)"
            />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE, fontWeight: 900, fontSize: 170, color: COR.escuro, opacity: 1 - sumiu}}>
            {numero}s
          </div>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE, fontWeight: 900, fontSize: 64, color: COR.vermelho, opacity: sumiu, transform: `translateY(${-dedo * 60}px)`}}>
            ARRASTOU ↑
          </div>
        </div>
      </Meio>

      <Meio top={700}>
        <Linha inicio={130} tamanho={54}>
          Porque começa <b>EXPLICANDO</b>…
        </Linha>
        <div style={{height: 30}} />
        <Cartela inicio={158} tamanho={72}>
          …em vez de <V>PERGUNTAR</V>.
        </Cartela>
      </Meio>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// 0:21 — PASSO 1: GANCHO (fórmula do método CENA)
// ─────────────────────────────────────────────────────────────
const Ficha: React.FC<{cor: string; antes: string; depois: string; troca: number; atraso: number}> = ({
  cor,
  antes,
  depois,
  troca,
  atraso,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [troca + atraso, troca + atraso + 10], [0, 1], clamp);
  const pulo = Math.sin(t * Math.PI) * 14;
  return (
    <span
      style={{
        display: 'inline-block',
        background: cor,
        color: cor === COR.verde ? '#0c1510' : '#fff',
        borderRadius: 16,
        padding: '6px 18px',
        margin: '6px 4px',
        transform: `translateY(${-pulo}px)`,
      }}
    >
      {t < 0.5 ? antes : depois}
    </span>
  );
};

export const CenaPasso1: React.FC = () => {
  const card = useEntrada(60);
  const troca = 150;
  const exemplo = useFade(troca - 4, 8);
  return (
    <>
      <Topo>
        <Etiqueta>PASSO 1 · GANCHO</Etiqueta>
        <Cartela inicio={8} tamanho={62}>
          Gancho não é barulho.
          <br />É uma <V>PERGUNTA</V>.
        </Cartela>
      </Topo>
      <Meio top={620}>
        <div
          style={{
            width: 940,
            background: '#fff8ef',
            borderRadius: 34,
            padding: '34px 30px',
            fontFamily: FONTE,
            fontWeight: 900,
            fontSize: 50,
            color: COR.escuro,
            textAlign: 'center',
            lineHeight: 1.35,
            boxShadow: '0 22px 50px rgba(40,20,10,.3)',
            transform: `scale(${0.8 + card * 0.2})`,
            opacity: Math.min(1, card * 2),
          }}
        >
          <div style={{fontSize: 26, letterSpacing: 4, color: COR.chao, marginBottom: 8, height: 34}}>
            {exemplo < 0.5 ? 'A FÓRMULA' : 'NA PRÁTICA'}
          </div>
          <Ficha cor={COR.teal} antes="[QUEM]" depois="Um entregador" troca={troca} atraso={0} /> quer{' '}
          <Ficha cor={COR.verde} antes="[O QUÊ]" depois="chegar a tempo" troca={troca} atraso={14} />, mas{' '}
          <Ficha cor={COR.vermelho} antes="[RISCO]" depois="a ponte caiu" troca={troca} atraso={28} />.
        </div>
      </Meio>
      <Meio top={1030}>
        <Linha inicio={235} tamanho={50}>
          Se nada está em jogo, <V>ninguém fica</V>.
        </Linha>
      </Meio>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// 0:32 — PASSO 2: ROTEIRO COM IA GRÁTIS (prompt na tela)
// ─────────────────────────────────────────────────────────────
const PROMPT =
  'Crie um roteiro de 30 s para vídeo vertical.\n' +
  '1) Gancho com uma pergunta nos 3 primeiros segundos.\n' +
  '2) Cada cena muda alguma coisa.\n' +
  '3) O final volta pro começo.';

const RESPOSTA = [
  ['CENA 1', 'Ela acha uma carta… com a letra dela.'],
  ['CENA 2', 'A data é de 30 anos atrás.'],
  ['CENA 3', 'E a assinatura… não é a dela.'],
  ['FINAL', 'Volta pra carta. O público assiste de novo.'],
];

const Chip: React.FC<{inicio: number; children: React.ReactNode}> = ({inicio, children}) => {
  const e = useEntrada(inicio, {damping: 11, stiffness: 170});
  return (
    <div
      style={{
        background: COR.escuro,
        color: '#fff',
        fontFamily: FONTE,
        fontWeight: 900,
        fontSize: 36,
        borderRadius: 18,
        padding: '14px 22px',
        transform: `scale(${e})`,
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
};

export const CenaPasso2: React.FC = () => {
  const frame = useCurrentFrame();
  const fimDigitar = 175;
  const bolhaIA = useEntrada(fimDigitar + 12);
  return (
    <>
      <Topo>
        <Etiqueta>PASSO 2 · ROTEIRO</Etiqueta>
        <Cartela inicio={8} tamanho={56}>
          Não peça “faz um vídeo”.
          <br />
          Dê a <V>RECEITA</V> pra IA.
        </Cartela>
      </Topo>

      {/* coluna da esquerda: qualquer IA de chat grátis serve */}
      <div style={{position: 'absolute', left: 40, top: 640, width: 330, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'stretch'}}>
        <Linha inicio={40} tamanho={34}>
          Vale qualquer IA grátis:
        </Linha>
        <Chip inicio={60}>ChatGPT</Chip>
        <Chip inicio={72}>Gemini</Chip>
        <Chip inicio={84}>Claude</Chip>
      </div>

      <div style={{position: 'absolute', left: 400, top: 590}}>
        <Celular inicio={14} largura={620} altura={1080} titulo="Chat com IA" subtitulo="versão GRÁTIS">
          <div
            style={{
              alignSelf: 'flex-end',
              maxWidth: '92%',
              background: COR.verde,
              color: '#0c1510',
              borderRadius: '26px 26px 6px 26px',
              padding: '16px 20px',
              fontSize: 25,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            <Digitando texto={PROMPT} inicio={30} fim={fimDigitar} />
          </div>
          <div
            style={{
              alignSelf: 'flex-start',
              maxWidth: '96%',
              background: '#1e2735',
              color: '#fff',
              borderRadius: '26px 26px 26px 6px',
              padding: '16px 20px',
              fontSize: 25,
              lineHeight: 1.35,
              opacity: Math.min(1, bolhaIA * 2),
              transform: `translateY(${(1 - bolhaIA) * 30}px)`,
            }}
          >
            {RESPOSTA.map(([t, l], i) => {
              const o = interpolate(frame, [fimDigitar + 25 + i * 28, fimDigitar + 35 + i * 28], [0, 1], clamp);
              return (
                <div key={t} style={{opacity: o, marginBottom: 10}}>
                  <b style={{color: COR.verde}}>{t}</b> · {l}
                </div>
              );
            })}
          </div>
        </Celular>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// 0:45 — PASSO 3: RETENÇÃO (as 3 regras) + quebra da 4ª parede
// ─────────────────────────────────────────────────────────────
const Regra: React.FC<{n: number; inicio: number; children: React.ReactNode}> = ({n, inicio, children}) => {
  const e = useEntrada(inicio, {damping: 14, stiffness: 130});
  return (
    <div
      style={{
        width: 940,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        background: '#fff8ef',
        borderRadius: 28,
        padding: '22px 28px',
        fontFamily: FONTE,
        color: COR.escuro,
        fontSize: 38,
        fontWeight: 800,
        lineHeight: 1.22,
        transform: `translateX(${(1 - e) * 1100}px)`,
        boxShadow: '0 14px 30px rgba(40,20,10,.22)',
      }}
    >
      <div
        style={{
          flex: '0 0 84px',
          height: 84,
          borderRadius: 42,
          background: COR.escuro,
          color: COR.verde,
          fontSize: 50,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {n}
      </div>
      <div>{children}</div>
    </div>
  );
};

export const CenaPasso3: React.FC = () => {
  const frame = useCurrentFrame();
  const sai = interpolate(frame, [272, 286], [1, 0], clamp);
  return (
    <>
      <Topo>
        <Etiqueta>PASSO 3 · RETENÇÃO</Etiqueta>
        <div style={{opacity: sai}}>
          <Cartela inicio={8} tamanho={58}>
            Como segurar a pessoa <V>até o fim</V>:
          </Cartela>
        </div>
      </Topo>
      <Meio top={610} style={{gap: 22, opacity: sai}}>
        <Regra n={1} inicio={40}>
          Cada cena <b style={{color: COR.teal}}>MUDA</b> algo. Se nada mudou, <b>corta</b>.
        </Regra>
        <Regra n={2} inicio={120}>
          Abra a próxima pergunta <b style={{color: COR.teal}}>ANTES</b> de responder a anterior.
        </Regra>
        <Regra n={3} inicio={200}>
          Termine onde começou: o vídeo vira <b style={{color: COR.teal}}>LOOP</b>.
        </Regra>
      </Meio>
      <Meio top={560}>
        <Cartela inicio={290} tamanho={74} fundo={COR.verde} cor="#0c1510">
          Repara: este vídeo está fazendo isso com você <u>agora</u>.
        </Cartela>
      </Meio>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// 0:58 — PASSO 4: MONTAGEM NO CELULAR
// ─────────────────────────────────────────────────────────────
const TAREFAS = [
  'Cole o roteiro',
  'Grave sua voz (ou use voz de IA)',
  'Legenda automática',
  'Corte os silêncios',
  'Exporte em 1080 × 1920',
];

export const CenaPasso4: React.FC = () => {
  const frame = useCurrentFrame();
  const progresso = interpolate(frame, [215, 275], [0, 100], clamp);
  return (
    <>
      <Topo>
        <Etiqueta>PASSO 4 · MONTAGEM</Etiqueta>
        <Cartela inicio={8} tamanho={56}>
          Monta tudo num <V>editor grátis</V>
          <br />
          do próprio celular.
        </Cartela>
      </Topo>

      <div style={{position: 'absolute', left: 40, top: 660, width: 330, display: 'flex', flexDirection: 'column', gap: 18}}>
        <Linha inicio={150} tamanho={34}>
          Dica: legenda <V>GRANDE</V> segura quem assiste sem som.
        </Linha>
      </div>

      <div style={{position: 'absolute', left: 400, top: 590}}>
        <Celular inicio={14} largura={620} altura={1080} titulo="Editor de vídeo" subtitulo="ex.: CapCut · grátis">
          {TAREFAS.map((t, i) => {
            const ini = 30 + i * 38;
            const aparece = interpolate(frame, [ini, ini + 8], [0, 1], clamp);
            const marcado = interpolate(frame, [ini + 18, ini + 24], [0, 1], clamp);
            return (
              <div
                key={t}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  background: '#1a2230',
                  borderRadius: 20,
                  padding: '20px 20px',
                  opacity: aparece,
                  transform: `translateX(${(1 - aparece) * 60}px)`,
                }}
              >
                <div
                  style={{
                    flex: '0 0 46px',
                    height: 46,
                    borderRadius: 12,
                    border: `4px solid ${COR.verde}`,
                    background: marcado > 0.5 ? COR.verde : 'transparent',
                    color: '#0c1510',
                    fontWeight: 900,
                    fontSize: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${1 + Math.sin(marcado * Math.PI) * 0.3})`,
                  }}
                >
                  {marcado > 0.5 ? '✓' : ''}
                </div>
                <div style={{color: '#fff', fontSize: 30, fontWeight: 800}}>{t}</div>
              </div>
            );
          })}
          <div style={{marginTop: 'auto', opacity: interpolate(frame, [205, 215], [0, 1], clamp)}}>
            <div style={{color: '#cfd8e3', fontSize: 24, fontWeight: 700, marginBottom: 10}}>
              {progresso < 100 ? `Exportando… ${Math.round(progresso)}%` : 'Pronto pra postar!'}
            </div>
            <div style={{height: 18, borderRadius: 9, background: '#253042', overflow: 'hidden'}}>
              <div style={{width: `${progresso}%`, height: '100%', background: COR.verde}} />
            </div>
          </div>
        </Celular>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// 1:08 — GRÁTIS x PAGO (paga a promessa aberta na revelação)
// ─────────────────────────────────────────────────────────────
const LINHAS_COMPARA: Array<[string, string]> = [
  ['Limite curto de uso', 'Muito mais uso por dia'],
  ['Modelo mais simples', 'Modelo mais inteligente'],
  ['Perde o fio da história', 'Lembra o roteiro inteiro'],
  ['Poucas imagens e vídeos', 'Imagem, vídeo e voz'],
];

export const CenaPago: React.FC = () => {
  const frame = useCurrentFrame();
  const tabela = useEntrada(40);
  const saiTabela = interpolate(frame, [238, 252], [1, 0], clamp);
  const celula: React.CSSProperties = {
    flex: 1,
    borderRadius: 20,
    padding: '20px 18px',
    fontFamily: FONTE,
    fontSize: 32,
    fontWeight: 800,
    lineHeight: 1.2,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 92,
  };
  return (
    <>
      <Topo>
        <Etiqueta fundo={COR.vermelho} cor="#fff">
          O ATALHO QUE EU PROMETI
        </Etiqueta>
        <div style={{opacity: saiTabela}}>
          <Cartela inicio={8} tamanho={58}>
            Grátis funciona.
            <br />
            Mas olha a <V>diferença</V>:
          </Cartela>
        </div>
      </Topo>

      <Meio top={590} style={{opacity: saiTabela}}>
        <div style={{width: 960, display: 'flex', flexDirection: 'column', gap: 14, opacity: Math.min(1, tabela * 2), transform: `scale(${0.9 + tabela * 0.1})`}}>
          <div style={{display: 'flex', gap: 14}}>
            <div style={{...celula, background: '#2a303b', color: COR.cinza, fontSize: 40, fontWeight: 900, minHeight: 70}}>GRÁTIS</div>
            <div style={{...celula, background: COR.verde, color: '#0c1510', fontSize: 40, fontWeight: 900, minHeight: 70}}>PAGO</div>
          </div>
          {LINHAS_COMPARA.map(([g, p], i) => {
            const ini = 70 + i * 36;
            const a = interpolate(frame, [ini, ini + 10], [0, 1], clamp);
            const b = interpolate(frame, [ini + 12, ini + 22], [0, 1], clamp);
            return (
              <div key={g} style={{display: 'flex', gap: 14}}>
                <div style={{...celula, background: '#1c212b', color: '#9aa4b2', opacity: a}}>{g}</div>
                <div style={{...celula, background: '#1f2f1a', color: COR.verde, border: `3px solid ${COR.verde}`, opacity: b, transform: `scale(${0.9 + b * 0.1})`}}>
                  {p}
                </div>
              </div>
            );
          })}
        </div>
      </Meio>

      <Meio top={560}>
        <Cartela inicio={256} tamanho={76}>
          Grátis te faz <span style={{color: COR.cinza}}>COMEÇAR</span>.
          <br />
          Pago te faz <V>ESCALAR</V>.
        </Cartela>
        <div style={{height: 34}} />
        <Linha inicio={300} tamanho={50}>
          E é no <V>MESMO</V> celular.
        </Linha>
      </Meio>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// 1:21 — CHAMADA (kit CenaViva)
// ─────────────────────────────────────────────────────────────
const Item: React.FC<{inicio: number; children: React.ReactNode}> = ({inicio, children}) => {
  const o = useFade(inicio, 8);
  const frame = useCurrentFrame();
  const x = interpolate(frame, [inicio, inicio + 8], [40, 0], clamp);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: o, transform: `translateX(${x}px)`}}>
      <div style={{flex: '0 0 38px', height: 38, borderRadius: 19, background: COR.verde, color: '#0c1510', fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        ✓
      </div>
      <div>{children}</div>
    </div>
  );
};

export const CenaCTA: React.FC = () => {
  const card = useEntrada(26);
  const frame = useCurrentFrame();
  const pulso = 1 + Math.max(0, Math.sin((frame - 130) * 0.25)) * 0.04 * (frame > 130 ? 1 : 0);
  return (
    <>
      <Topo>
        <Cartela tamanho={64}>
          Quer o meu <V>método completo</V>?
        </Cartela>
      </Topo>
      <Meio top={440}>
        <div
          style={{
            width: 920,
            background: COR.noite,
            border: `3px solid ${COR.verde}`,
            borderRadius: 34,
            padding: '34px 40px',
            fontFamily: FONTE,
            color: '#fff',
            transform: `scale(${0.85 + card * 0.15})`,
            opacity: Math.min(1, card * 2),
            boxShadow: '0 30px 60px rgba(40,20,10,.35)',
          }}
        >
          <div style={{fontSize: 70, fontWeight: 900, letterSpacing: -2}}>
            CENA<span style={{color: COR.verde}}>VIVA</span> <span style={{fontSize: 34, color: COR.cinza, letterSpacing: 4}}>KIT</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20, fontSize: 34, fontWeight: 800}}>
            <Item inicio={50}>Gerador de briefing pronto</Item>
            <Item inicio={66}>9 skills: roteiro, câmera e retenção</Item>
            <Item inicio={82}>Método CENA: do gancho ao vídeo final</Item>
          </div>
          <div style={{marginTop: 22, fontSize: 24, color: COR.cinza, fontWeight: 600, opacity: useFade(98, 10)}}>
            O próximo nível: produção no computador com Claude Code.
          </div>
        </div>
      </Meio>
      <Meio top={910}>
        <div style={{transform: `scale(${pulso})`}}>
          <Cartela inicio={122} tamanho={70} fundo={COR.verde} cor="#0c1510">
            COMENTA “CENA”
          </Cartela>
        </div>
        <div style={{height: 14}} />
        <Linha inicio={140} tamanho={38}>
          que eu te mando o link (ou toca na bio)
        </Linha>
      </Meio>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// 1:28 — LOOP: termina exatamente como começou
// ─────────────────────────────────────────────────────────────
export const CenaLoop: React.FC = () => {
  const frame = useCurrentFrame();
  // As duas frases dividem o MESMO lugar da 2ª linha da abertura,
  // então o último frame fica igual ao primeiro: o vídeo emenda em loop.
  const l1 = interpolate(frame, [34, 46, 82, 90], [0, 1, 1, 0], clamp);
  const l2 = interpolate(frame, [90, 100, 122, 138], [0, 1, 1, 0], clamp);
  const caixa = useEntrada(14, {damping: 16, stiffness: 100});
  const linha: React.CSSProperties = {position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center'};
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 265, pointerEvents: 'none', fontFamily: FONTE}}>
      <div style={{maxWidth: 930, textAlign: 'center', background: COR.escuro, borderRadius: 30, padding: '24px 44px', color: '#fff', fontSize: 78, fontWeight: 900, transform: `scale(${0.85 + caixa * 0.15})`, opacity: Math.min(1, caixa * 1.6)}}>
        UMA ESCOLHA MUDA TUDO.
      </div>
      <div style={{position: 'relative', width: 1000, fontSize: 49, fontWeight: 800, color: '#fff', textShadow: `2px 4px 8px ${COR.sombra}`, marginTop: 26}}>
        <div style={{visibility: 'hidden'}}>O QUE VOCÊ FARIA?</div>
        <div style={{...linha, opacity: l1}}>
          GRÁTIS OU <V>PAGO</V>?
        </div>
        <div style={{...linha, opacity: l2}}>O QUE VOCÊ FARIA?</div>
      </div>
    </AbsoluteFill>
  );
};
