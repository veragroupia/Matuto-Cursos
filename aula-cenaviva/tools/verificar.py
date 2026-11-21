"""Decodifica todos os quadros e compara o áudio AAC com a mixagem anterior à compressão."""
from pathlib import Path
import json, subprocess, shutil
import av, numpy as np
root=Path(__file__).resolve().parents[1]
video=root/'entrega/CenaViva-O-Recibo-v4.mp4'
cut=json.loads((root/'src/cut.json').read_text('utf8'))
prev=None;last=-1;duplicates=0;count=0;bad_pts=0;native=[];dark=0
with av.open(str(video)) as con:
    stream=con.streams.video[0];stream.thread_type='AUTO'
    for frame in con.decode(stream):
        t=float(frame.pts*frame.time_base)
        if abs(t-count/60)>.001:bad_pts+=1
        img=frame.reformat(width=144,height=81,format='gray').to_ndarray().astype('int16')
        if img.mean()<8:dark+=1
        if prev is not None:
            delta=np.abs(img-prev).mean()
            if delta==0:duplicates+=1
            if not cut['clip']<=t<cut['clip']+cut['cliplen']:native.append(delta)
        prev=img;count+=1
def mono(path):
    cmd=[shutil.which('ffmpeg') or 'ffmpeg','-v','error','-i',str(path),'-map','0:a','-ar','4000','-ac','1','-f','f32le','pipe:1']
    return np.frombuffer(subprocess.check_output(cmd),np.float32)
master,source=mono(video),mono(root/'public/mix.wav');n=min(len(master),len(source))
result=dict(quadros_decodificados=count,previstos=cut['frames'],pts_fora_do_passo_60fps=bad_pts,quadros_escuros=dark,pares_iguais_na_amostra_144x81=duplicates,mediana_diferenca_luma_fora_do_arquivo_15fps=round(float(np.median(native)),3),correlacao_AAC_mixagem=round(float(np.corrcoef(master[:n],source[:n])[0,1]),6))
(root/'revisao/medicoes.json').write_text(json.dumps(result,indent=2),encoding='utf8');print(result)
assert count==cut['frames'] and bad_pts==0 and dark==0 and result['correlacao_AAC_mixagem']>.98
