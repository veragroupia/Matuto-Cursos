---
name: entrega-remotion
description: "Configurar preview, renders e entrega com Remotion/React Three Fiber e FFmpeg sem alterar fontes aprovadas. Use ao preparar projeto ou exportar vídeo."
---

# Render e entrega

## Método
- Leia `package.json` e scripts existentes antes de comandar render.
- Valide versão do Node, dependências e os IDs reais de composição.
- Faça prova de 3–8 s com áudio para medir problemas técnicos antes do render longo.
- Para 3D, use `ThreeCanvas` e movimento determinístico dependente de frame.
- Renderize versão leve para revisão, então versão final com resolução e codec requeridos pela plataforma.
- Use FFprobe para verificar número de frames, timebase, áudio, FPS e duração; não confunda cauda de AAC com frame de vídeo.
- Guarde versão anterior com nome distinto e hash quando útil.

## Entrega
Listar arquivos, comandos, resolução, duração, pendências e custos externos. Não chamar a revisão de «final aprovado» sem aprovação explícita.
