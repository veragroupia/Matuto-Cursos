---
name: direcao-3d
description: "Direção de atuação e composição para personagens 3D animados em Remotion React Three Fiber; usar ao planejar poses, gestos, cenário e iluminação."
---

# Direção 3D

## Conduta
- Leia os modelos e rigs reais antes de supor quais articulações existem.
- Defina intenção de cada personagem no plano, o que ele vê e como reage.
- Movimentos devem ter antecipação, peso, contato e consequência; não use gesto decorativo em toda sílaba.
- Inspecione relações de câmera, escala, chão, objetos e mãos em movimento.
- Para Remotion/Three, use `useCurrentFrame()` e funções determinísticas; não dependa de `useFrame()` como fonte única da animação final.

## Verificação
- Planos abertos para contexto e closes somente quando há informação nova.
- Procure clipping, interpenetração, personagens congelados e movimentos que reiniciam em emendas.
- Compare um render curto com referências visuais aprovadas; preserve original.
