"""Junta o piloto (quadros 0–4249, render do Codex) aos segmentos da aula e coloca a faixa completa.

Uso:  python tools/finalizar.py <piloto.mp4> <saida.mp4> seg1.mp4 seg2.mp4 ...
Os segmentos são gerados por `node tools/render.mjs segmento <ini> <fim> <arquivo>` e precisam cobrir,
em ordem e sem buraco, os quadros 4250 até o último da aula (src/aula.json).
Depois roda uma verificação: total de quadros, passo de 60 fps, quadros repetidos e quadros pretos.
"""
from pathlib import Path
import sys,json,subprocess,shutil,tempfile,hashlib
root=Path(__file__).resolve().parents[1]
ff=shutil.which('ffmpeg') or 'ffmpeg';fp=shutil.which('ffprobe') or 'ffprobe'
aula=json.loads((root/'src/aula.json').read_text('utf8'))
piloto,saida,segs=Path(sys.argv[1]),Path(sys.argv[2]),[Path(s) for s in sys.argv[3:]]
def quadros(p):return int(subprocess.check_output([fp,'-v','error','-count_packets','-select_streams','v:0','-show_entries','stream=nb_read_packets','-of','csv=p=0',str(p)]).decode().strip())
total=aula['introFrames']+sum(quadros(s) for s in segs)
assert total==aula['frames'],f'segmentos cobrem {total} quadros; a aula tem {aula["frames"]}'
tmp=Path(tempfile.mkdtemp())
# O MP4 do piloto saiu em faixa completa (yuvj420p); converte para yuv420p como o resto da aula.
intro=tmp/'intro.mp4'
subprocess.run([ff,'-v','error','-y','-i',str(piloto),'-an','-frames:v',str(aula['introFrames']),'-vf','scale=in_range=full:out_range=tv,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','16','-r','60',str(intro)],check=True)
lista=tmp/'lista.txt';lista.write_text(''.join(f"file '{p.resolve()}'\n" for p in [intro,*segs]),encoding='utf8')
video=tmp/'video.mp4'
subprocess.run([ff,'-v','error','-y','-f','concat','-safe','0','-i',str(lista),'-c','copy',str(video)],check=True)
subprocess.run([ff,'-v','error','-y','-i',str(video),'-i',str(root/'public/aula.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',str(saida)],check=True)
# Verificação
n=quadros(saida)
pts=subprocess.check_output([fp,'-v','error','-select_streams','v:0','-show_entries','packet=pts_time','-of','csv=p=0',str(saida)]).decode().split()
ts=sorted(float(x) for x in pts if x and x!='N/A');fora=sum(1 for i,t in enumerate(ts) if abs(t-ts[0]-i/60)>.002)
md5=subprocess.check_output([ff,'-v','error','-i',str(saida),'-map','0:v','-vf','scale=144:81,format=gray','-f','framemd5','-']).decode().splitlines()
hs=[l.split(',')[-1].strip() for l in md5 if l and not l.startswith('#')]
iguais=sum(1 for a,b in zip(hs,hs[1:]) if a==b)
dur=float(subprocess.check_output([fp,'-v','error','-show_entries','format=duration','-of','csv=p=0',str(saida)]).decode())
res=dict(arquivo=saida.name,quadros=n,previstos=aula['frames'],pts_fora_do_passo_60fps=fora,pares_iguais_144x81=iguais,duracao_s=round(dur,3))
print(json.dumps(res,ensure_ascii=False,indent=2))
(root/'revisao/medicoes-aula.json').write_text(json.dumps(res,ensure_ascii=False,indent=2),encoding='utf8')
shutil.rmtree(tmp,ignore_errors=True)
