# Aula de boas-vindas · relatório curto de validação

## O que foi entregue
- `CenaViva-Aula-de-Boas-Vindas.mp4`: aula completa, piloto “O recibo” mais 16 capítulos, 1920 × 1080, 60 fps, H.264 + AAC, legendas na imagem.
- `CenaViva-Aula-de-Boas-Vindas-720p.mp4`: a mesma aula em 1280 × 720, mais leve, para conferir no celular. Não é o master.
- `CenaViva-Legendas.srt` · `Roteiro-da-aula.md` · `Capitulos.txt` · projeto reproduzível em `aula-cenaviva/`.

## Continuação do trabalho do Codex
- **Ponto de parada:** os 16 capítulos já estavam roteirizados e gravados com a voz Matuto (ElevenLabs v4), mas a montagem da aula nunca tinha rodado. `oficina.js` estava incompleto (3 dos ~12 tipos de plano, sem export), `cut.json` e `performance.json` da aula estavam vazios e `entrega/` estava vazia.
- **Nenhuma voz nova foi gerada.** Só foram usadas as tomadas já pagas pelo criador, sem custo extra de ElevenLabs.
- **Edição revista:** voltaram à montagem cinco falas que já estavam gravadas e tinham sido tiradas: o teste da premissa (“Faz essa pergunta com teu tema…”), o desfecho do colete, a avaliação das duas respostas da IA, o aviso “promessa de viralizar eu deixo pro vendedor de milagre” e o fecho “ler o papel até a última linha”. Continuam fora a frase duplicada da trilha do celular e três trechos redundantes.
- **Piloto preservado:** os quadros 0–4249 são o MP4 que o Codex renderizou e revisou, sem alteração de imagem; só foi convertido de faixa completa (yuvj420p) para yuv420p, como o resto da aula.

## Testes feitos (fatos medidos)
Medições no MP4 final (`tools/finalizar.py`, ffprobe/ffmpeg), em 21/11/2026:
- **Quadros:** 40.651 de 40.651 previstos. Duração de 677,517 s (11min17s). Vídeo e áudio com a mesma duração (677,517 s × 677,516 s).
- **Passo de 60 fps:** 0 timestamps fora do passo de 1/60 s, em todos os quadros.
- **Formato:** H.264 High, 1920 × 1080, yuv420p, 60/1 · AAC LC, 48 kHz, estéreo, cerca de 190 kbit/s. Arquivo de 237 MB.
- **Loudness:** −16,6 LUFS integrados no arquivo final, o mesmo valor da faixa montada.
- **Quadros pretos:** nenhum (blackdetect, limiar de 8 %, mínimo de 0,05 s).
- **Quadros repetidos:** 3 pares iguais na comparação reduzida (144 × 81, cinza), nos quadros 27212, 31744 e 34894. Em resolução cheia, os três são planos de tela ou caderno parados logo antes de um corte (diferença média abaixo de 0,01 nos quadros vizinhos também). Não houve quadro duplicado pelo render.
- **Emendas:** foram medidas as 8 junções entre piloto e segmentos e as 18 bordas dos remendos. Nas emendas sem corte de plano, a diferença média entre quadros vai de cerca de 0,07 para 0,4 (troca de quadro-chave do codificador), sem salto visível. Os saltos grandes caem só nos cortes de plano do início dos capítulos.
- **Revisão visual:** um quadro a cada 2,5 s da aula inteira (cerca de 240 quadros em folhas de contato), mais checagens em tamanho real. Um defeito apareceu e foi corrigido: o fundo do marcador de capítulo deixava o cabeçalho do monitor transparecer. Ele ficou opaco, e os 4 s do marcador dos capítulos 1 a 9, renderizados antes da correção, foram refeitos e encaixados quadro a quadro.
- **Tempo de render:** cerca de 4h20 de relógio (SwiftShader na CPU, 2 processos em 4 núcleos), em 8 segmentos de 4.550 quadros e 9 remendos de 240 quadros.

## O que NÃO foi testado
- Escuta crítica do timbre e da mixagem em alto-falante real: o ambiente de produção não tem saída de som. Foram medidos loudness (−16,6 LUFS integrados na faixa montada) e sincronismo, não a percepção.
- Nenhum teste com alunos. Nada aqui mede retenção ou interesse do público.
- Render com GPU no Windows não foi executado nesta máquina. O exportador detecta o sistema e usa `d3d11` no Windows, mas a validação foi feita com SwiftShader (CPU).

## Limitações materiais
- A boca do Matuto segue o envelope e as vogais da voz real (mesma técnica do piloto). Não é sincronização fonética completa.
- Os gestos são procedurais, gerados a partir das frases e das palavras de ênfase. Variam, mas não foram atuados à mão plano a plano.
- Fontes: as do Windows usadas no piloto foram substituídas por equivalentes livres embutidas. Pode haver pequena diferença de desenho de letra entre o piloto (0:00–1:10) e a aula.
- O trecho do Rogério continua com os 15 fps nativos do clipe original, dentro do monitor, como no piloto.
