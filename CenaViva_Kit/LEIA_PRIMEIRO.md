# CENAVIVA — Kit de vídeos narrativos com IA · v1.0

**Kit independente para uso com Claude Code + Remotion.** Material autoral de treinamento e templates. Não é produto oficial, afiliado ou endossado por Anthropic, Claude ou Remotion.

## O que veio na compra

- `ferramenta/ESTUDIO_CENAVIVA.html`: ferramenta local para montar o briefing e gerar um prompt de produção a partir de suas ideias. Abra com dois cliques no navegador. **Ela não gera MP4 automaticamente e não usa IA sozinha.**
- `.claude/skills/`: **9 skills originais** de planejamento, direção, 3D, voz, continuidade, revisão e render.
- `projeto-exemplo/`: um pequeno projeto original de Remotion/React Three Fiber para estudar e modificar (não é o projeto Matuto).
- `docs/METODO_CENA.md`: método de trabalho, do conceito ao MP4.
- `docs/GUIA_INSTALACAO.md`: manual de instalação, mesmo para iniciantes.
- `docs/PROMPTS_PRONTOS.md`: prompts de primeira execução e revisão crítica.
- `aulas/ROTEIRO_AULA.md` e `aulas/ROTEIRO_VIDEO_VENDAS.md`: roteiros de gravação.
- `vendas/`: página editável e textos de anúncio para o produtor do kit.

## Início em 3 passos

1. Abra `ferramenta/ESTUDIO_CENAVIVA.html`. Preencha personagem, tema, conflito e objetivo do vídeo.
2. Clique em **Gerar briefing** e copie o prompt para a conversa do Claude Code no projeto onde vai criar o vídeo.
3. Instale as skills copiando `.claude/skills/` para a pasta do projeto. Faça a prévia e a revisão conforme o método CENA.

### Para testar um projeto 3D de demonstração

Pré-requisitos: Node.js, npm, Claude Code (se quiser usar a IA) e navegador compatível com WebGL.

```bash
cd projeto-exemplo
npm install
npm run studio
```

Veja `projeto-exemplo/README.md` para renderização. Esta demonstração é de código autoral, simples, não um episódio cinematográfico pronto.

## Expectativas honestas

- O kit ensina a **orientar o fluxo de produção**. O comprador precisará de computador e poderá precisar de conhecimentos básicos de instalação, edição e ferramentas de IA.
- Assinaturas, planos, créditos de voz (por exemplo, ElevenLabs), serviços externos, plugins pagos e licenças de terceiros **não estão incluídos**.
- Skills guiam um modelo; não garantem qualidade profissional, vídeo viral ou geração em um clique.
- Direitos de voz, imagem, marcas e músicas devem ser respeitados. Use apenas conteúdo próprio ou licenciado.
- O vídeo demonstrativo de código **não foi executado dentro deste pacote**; siga os comandos e confira o render no seu computador antes de anunciar compatibilidade garantida.

## Uso e licença

Leia `LICENCA.md`. A compra concede licença individual de uso do material autoral para criar vídeos próprios/de clientes, **não** para revenda do próprio kit ou redistribuição das skills. Dependências externas seguem seus próprios termos.
