from pathlib import Path
import argparse, json
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--takes',type=Path,default=root/'audio')
parser.add_argument('--force',action='store_true')
args=parser.parse_args()
model=WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=6)
for i in range(1,5):
    filename=next((args.takes/f'v4-{i}.{ext}' for ext in ['wav','mp3'] if (args.takes/f'v4-{i}.{ext}').is_file()),None)
    if not filename:raise FileNotFoundError(f'Bloco {i} ausente em {args.takes}')
    out=filename.with_suffix('.words.json')
    if out.exists() and not args.force:continue
    segs,_=model.transcribe(str(filename),language='pt',word_timestamps=True,beam_size=4,vad_filter=False)
    words=[{'w':w.word.strip(),'s':round(w.start,3),'e':round(w.end,3)} for s in segs for w in s.words]
    out.write_text(json.dumps(words,ensure_ascii=False),encoding='utf8')
    print(filename.stem,' '.join(x['w'] for x in words),flush=True)
