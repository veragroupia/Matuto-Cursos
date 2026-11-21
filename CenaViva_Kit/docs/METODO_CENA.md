# O método CENA

O método CENA é um framework editorial original de quatro etapas, não uma receita garantida de algoritmo.

## C — Conceito com tensão

Defina o protagonista, o desejo, o obstáculo e **por que o público deveria se importar agora**. O gancho cria pergunta, não apenas barulho.

**Exercício**: escreva uma frase com `[pessoa] quer [objetivo], mas [risco]`. Se só houver descrição e não houver consequência, reformule.

## E — Estrutura de consequência

Desenhe as mudanças do episódio como **causa → ação → consequência → nova pergunta**. Evite cenas que só repetem a mesma informação emocional.

**Exercício**: para cada cena, responda «O que mudou?». Se a resposta for «nada», corte, condense ou reescreva.

## N — Narrativa em movimento

Mostre reações e ações concretas. Escolha a câmera conforme a atenção do personagem; vozes, efeitos e movimento devem fazer parte do mesmo acontecimento. Preserve pausas que criam significado, não silêncios vazios.

**Exercício**: assista à prévia sem som. O público ainda entende o que mudou? Depois apenas com som: as vozes fazem sentido?

## A — Auditoria e ajuste

Produza uma prévia leve, assista em velocidade normal e em telefone, verifique movimentos, colisões, texto, áudio, clareza da escolha. Só então renderize final.

**Exercício**: marque os segundos em que sua atenção diminui e pergunte qual informação falta, em vez de adicionar zoom automaticamente.

## Pipeline prático

1. Briefing no `ESTUDIO_CENAVIVA.html`.
2. Criar ou abrir um projeto Remotion/Three com skills instaladas.
3. Pedir ao Claude três abordagens realmente distintas e uma recomendação crítica.
4. Aprovar a direção macro e deixar a IA executar uma pequena **prova audiovisual**.
5. Revisar narrativa, atuação e câmera juntos — não em prompts contraditórios.
6. Gerar áudios com permissões/custos confirmados e alinhar as falas reais.
7. Renderizar prévia completa e fazer checklist QA.
8. Exportar versão final 1080×1920, 30 fps se for o formato desejado; verificar os requisitos da plataforma de destino.

## Três testes antes de gastar com render

- **Interesse**: por que eu ficaria mais cinco segundos?
- **Consequência**: o que muda neste acontecimento?
- **Coerência**: isso parece fazer parte do mesmo universo audiovisual?

## Exemplo original (não pertencente ao Matuto)

Uma jovem encontra uma carta antiga que parece ter sido escrita por ela mesma — mas a data é de 30 anos atrás. Uma câmera que muda de foco ao ritmo das descobertas vale mais do que dez zooms sobre a carta. A cena termina quando a personagem percebe a assinatura diferente. Isso abre uma pergunta sem explicar a resposta.

## Ferramentas por responsabilidade

- Claude Code: interpretação do briefing, programação e revisão criativa.
- Remotion + Three: animação e exportação por código.
- FFmpeg/FFprobe: medições e cortes/mux sem prometer avaliação artística.
- ElevenLabs ou outro serviço: vozes opcionais, quando autorizadas e viáveis.

**Importante:** não confunda automatização com talento artístico: o comprador continua sendo quem aprova o resultado.
