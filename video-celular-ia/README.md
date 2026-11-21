# Vídeo "Celular + IA grátis" (continuação do CenaVivaDemo)

Continuação da abertura de 8 s do `projeto-exemplo` do CenaViva Kit, agora um vídeo completo de **1min33s**:
gancho → revelação → problema dos 3 segundos → 4 passos (gancho, roteiro com IA grátis, retenção, montagem no celular)
→ grátis x pago → chamada para o kit → final igual ao começo (loop).

## Rodar

```bash
npm install
npm run studio          # abre o Remotion Studio (escolha "VideoCelularIA")
npm run render          # gera out/video-celular-ia-gratis.mp4
npm run render:abertura # só a abertura original de 8 s
```

## Onde mexer

- `src/celular-ia/tema.ts`: cores e **tempo de cada cena** (em frames, 30 fps).
- `src/celular-ia/cenas.tsx`: textos e animações de cada cena.
- `src/celular-ia/Personagem.tsx`: o personagem 3D (posição por cena, celular na mão, boca, piscadas).
- `src/video.tsx`: a abertura original, intocada.

Locução, legenda do post e comentário fixado: `ROTEIRO_LOCUCAO.md`.
