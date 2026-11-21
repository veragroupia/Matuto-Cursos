# Aula de boas-vindas · relatório curto de validação

## O que foi entregue
- `CenaViva-Aula-de-Boas-Vindas.mp4`: aula completa, piloto “O recibo” mais 16 capítulos, 1920 × 1080, 60 fps, H.264 + AAC, legendas na imagem.
- `CenaViva-Legendas.srt` · `Roteiro-da-aula.md` · `Capitulos.txt` · projeto reproduzível em `aula-cenaviva/`.

## Continuação do trabalho do Codex
- **Ponto de parada:** os 16 capítulos já estavam roteirizados e gravados com a voz Matuto (ElevenLabs v4), mas a montagem da aula nunca tinha rodado. `oficina.js` estava incompleto (3 dos ~12 tipos de plano, sem export), `cut.json` e `performance.json` da aula estavam vazios e `entrega/` estava vazia.
- **Nenhuma voz nova foi gerada.** Só foram usadas as tomadas já pagas pelo criador, sem custo extra de ElevenLabs.
- **Edição revista:** voltaram à montagem cinco falas que já estavam gravadas e tinham sido tiradas: o teste da premissa (“Faz essa pergunta com teu tema…”), o desfecho do colete, a avaliação das duas respostas da IA, o aviso “promessa de viralizar eu deixo pro vendedor de milagre” e o fecho “ler o papel até a última linha”. Continuam fora a frase duplicada da trilha do celular e três trechos redundantes.
- **Piloto preservado:** os quadros 0–4249 são o MP4 que o Codex renderizou e revisou, sem alteração de imagem; só foi convertido de faixa completa (yuvj420p) para yuv420p, como o resto da aula.

## Testes feitos (fatos medidos)
<!-- preenchido após o render final -->

## O que NÃO foi testado
- Escuta crítica do timbre e da mixagem em alto-falante real: o ambiente de produção não tem saída de som. Foram medidos loudness (−16,6 LUFS integrados na faixa montada) e sincronismo, não a percepção.
- Nenhum teste com alunos. Nada aqui mede retenção ou interesse do público.
- Render com GPU no Windows não foi executado nesta máquina. O exportador detecta o sistema e usa `d3d11` no Windows, mas a validação foi feita com SwiftShader (CPU).

## Limitações materiais
- A boca do Matuto segue o envelope e as vogais da voz real (mesma técnica do piloto). Não é sincronização fonética completa.
- Os gestos são procedurais, gerados a partir das frases e das palavras de ênfase. Variam, mas não foram atuados à mão plano a plano.
- Fontes: as do Windows usadas no piloto foram substituídas por equivalentes livres embutidas. Pode haver pequena diferença de desenho de letra entre o piloto (0:00–1:10) e a aula.
- O trecho do Rogério continua com os 15 fps nativos do clipe original, dentro do monitor, como no piloto.
