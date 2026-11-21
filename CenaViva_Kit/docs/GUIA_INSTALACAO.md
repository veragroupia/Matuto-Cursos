# Instalação — iniciante (Windows, macOS, Linux)

## Antes de começar

Instale Node.js atual e Claude Code pelas páginas oficiais. É necessário ter acesso ao Claude Code, que pode depender de plano ou créditos. Os apps e serviços externos **não fazem parte** desta compra.

- Claude Code: https://code.claude.com/docs/en/overview
- Skills: https://code.claude.com/docs/en/skills
- Remotion: https://www.remotion.dev/docs/
- Template 3D oficial: https://www.remotion.dev/templates/three

## Opção A — usar nosso projeto-exemplo

1. Extraia o ZIP.
2. Abra terminal dentro de `projeto-exemplo`.
3. Execute `npm install` e `npm run studio`.
4. Abra `projeto-exemplo` no Claude Code; inicie com o prompt de `docs/PROMPTS_PRONTOS.md`.
5. As skills **não estão embutidas automaticamente** dentro do `projeto-exemplo`; para usá-las lá, copie o diretório `.claude/skills` da raiz do ZIP para dentro dele.

## Opção B — novo projeto 3D oficial

No terminal:

```bash
npx create-video@latest --three
```

Siga os passos da ferramenta, entre na nova pasta, copie o diretório `.claude/skills/` e execute o comando de Studio informado pelo template. Os comandos exatos podem variar com as versões.

## Instalar as skills manualmente (recomendado)

Para cada skill, o caminho precisa ficar assim:

```
SEU_PROJETO/
  .claude/
    skills/
      ideia-conflito/SKILL.md
      roteiro-retencao/SKILL.md
      ...
```

Copie o diretório inteiro `.claude/skills/` do kit para o projeto. **Não substitua outros arquivos do projeto** e não apague skills já existentes. Se houver nomes iguais, compare e faça backup antes.

Para instruções gerais, você pode **mesclar com cuidado** o conteúdo de `CLAUDE_EXEMPLO.md` ao arquivo `CLAUDE.md` já existente; não sobrescreva regras prévias sem revisão.

No Claude Code, abra a pasta do projeto e digite `/ideia-conflito` ou peça «use a skill de roteiro-retencao». O reconhecimento automático depende do contexto e versão.

## Instalador opcional

`instaladores/instalar_windows.ps1` e `instaladores/instalar_unix.sh` copiam as skills de forma conservadora. **Não executam npm nem enviam dados à internet.** Se um diretório já existir, ele será pulado para proteger seu projeto. Leia o script antes de executar. A instalação manual é a melhor opção para iniciantes.

## Fluxo da ferramenta de briefing

Abra `ferramenta/ESTUDIO_CENAVIVA.html` em qualquer navegador recente. Preencha e clique «Gerar briefing». Copie o prompt e cole na conversa do Claude Code aberta **na pasta certa**.

**Atenção:** esta ferramenta não gera mídia, não chama o Claude e não cria conta. Ela apenas organiza o pedido e evita prompts confusos. O Claude Code realiza a programação dentro de seu ambiente, se configurado.

## Solução de problemas

- **Claude não vê skills**: confira nome exato `.claude/skills/<nome>/SKILL.md` e abra a pasta raiz correta.
- **Erro de áudio**: FFprobe/FFmpeg podem analisar localmente; não envie blobs de áudio para um modelo incompatível.
- **Remotion não abre**: confira `npm install`, Node, dependências, GPU/WebGL e mensagens do terminal.
- **Vídeo lento**: não peça «mais zoom». Identifique onde o conflito parou de avançar.
- **Voz robótica**: compare com gravação autorizada; ajuste direção, pausas e escolha de voz, não apenas a velocidade.
