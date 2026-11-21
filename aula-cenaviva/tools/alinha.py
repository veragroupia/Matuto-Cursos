"""Transcreve as tomadas e mede a posição de cada palavra. Uso: python tools/alinha.py [pasta]."""
import sys, json
from pathlib import Path
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parents[1]
takes=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'audio/continuacao'
chapters=json.loads((root/'audio/capitulos.json').read_text('utf8'))
model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=5)
for chapter in chapters:
    key=chapter['id'];dest=takes/(key+'.words.json')
    src=next((takes/(key+ext) for ext in ['.wav','.mp3'] if (takes/(key+ext)).is_file()),None)
    if src is None:raise FileNotFoundError(key)
    if dest.exists() and dest.stat().st_mtime>=src.stat().st_mtime:continue
    segments,_=model.transcribe(str(src),language='pt',word_timestamps=True,beam_size=4,vad_filter=False,condition_on_previous_text=False)
    words=[{'w':w.word.strip(),'s':round(w.start,3),'e':round(w.end,3)} for seg in segments for w in seg.words]
    if not words:raise RuntimeError('Tomada vazia '+key)
    dest.write_text(json.dumps(words,ensure_ascii=False),encoding='utf8')
    print(key,len(words),words[-1]['e'],flush=True)
