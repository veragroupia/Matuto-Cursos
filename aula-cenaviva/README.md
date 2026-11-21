# CenaViva · Aula de boas-vindas (completa)

Continuação do trabalho do Codex: o piloto **"O recibo"** (0:00–1:10) vira a abertura da aula, e os
16 capítulos que ele já tinha roteirizado e gravado com a voz do Matuto (ElevenLabs) agora estão
montados, dirigidos e renderizados no mesmo quarto 3D.

- **Formato:** 1920 × 1080, 60 quadros por segundo calculados um a um, H.264 + AAC, legendas na imagem e em SRT.
- **Duração:** 11min17s (40.651 quadros).
- **Capítulos:** `entrega/Capitulos.txt` · **Roteiro final:** `entrega/Roteiro-da-aula.md` · **Legendas:** `entrega/CenaViva-Legendas.srt`.

## Como a aula foi construída

| Parte | Arquivo | O que faz |
|---|---|---|
| Montagem do som | `tools/montar_aula.py` | Junta o áudio do piloto + 16 tomadas, alinha cada palavra (Whisper já medido em `audio/continuacao/*.words.json`), corta repetições, gera `public/aula.wav`, `src/aula.json`, SRT, roteiro e capítulos. |
| Decupagem e atuação | `src/aula/direcao.js` | Divide cada fala em planos (sempre cortando em início de frase), dirige olhar, boca, sobrancelha, acenos, piscadas e gestos do Matuto a partir da voz real, e posiciona a câmera. |
| Telas e caderno | `src/aula/telas.js` | O monitor do quarto mostra prompts, celular, ilha de edição, quadro de formatos e o mini-filme; o caderno aberto na mesa mostra as anotações. Reaproveita os desenhos e textos do Codex. |
| Palco | `src/aula/palco.js` | O mesmo quarto, luz e boneco do piloto. Quadros 0–4249 usam a direção original do Codex; do 4250 em diante, a direção da aula. |
| Exportação | `tools/render.mjs` | Desenha cada quadro com a mesma função do Remotion e envia ao FFmpeg (sem relógio, sem interpolação). |
| Finalização | `tools/finalizar.py` | Junta o piloto já renderizado aos segmentos da aula, coloca a faixa completa e verifica quadros, passo de 60 fps e repetições. |

## Rodar

```bash
npm ci
python tools/montar_aula.py                 # só se mudar falas/cortes (precisa de Python + NumPy + FFmpeg)
npm run studio                              # composição "AulaCenaViva" no Remotion Studio
node tools/render.mjs quadros 5000,9000 revisao/quadros      # conferir quadros soltos
node tools/render.mjs segmento 4250 13349 seg1.mp4            # renderizar um trecho (sem áudio)
python tools/finalizar.py <piloto.mp4> entrega/CenaViva-Aula-de-Boas-Vindas.mp4 seg1.mp4 seg2.mp4 ...
```

No Windows, o exportador usa a GPU (`--use-angle=d3d11`) e fica bem mais rápido. Em servidor sem GPU usa
SwiftShader (`CENAVIVA_ANGLE=swiftshader`). Variáveis opcionais: `CENAVIVA_CHROME`, `CENAVIVA_FFMPEG`, `CENAVIVA_LARGURA`.

As fontes do Windows usadas no piloto (Georgia, Bahnschrift, Consolas, Segoe) têm equivalentes livres
embutidos em `public/fonts` (Source Serif 4, Barlow Semi Condensed, JetBrains Mono, Caveat, Inter, todas OFL).

## Onde mexer

- **Falas e cortes:** `audio/capitulos.json` (texto) e o dicionário `omit` em `tools/montar_aula.py` (beats que ficam fora da edição).
- **Que plano usar em cada fala:** campo `shot`/`action` em `audio/capitulos.json`; regras em `src/aula/direcao.js`.
- **O que aparece no monitor/caderno:** uma função por `action` em `src/aula/telas.js`.
- **Enquadramentos:** objeto `CAMS` em `src/aula/direcao.js`.
