"""Conforma as cenas às falas e produz a faixa contínua, SRT e capítulos."""
from pathlib import Path
import sys,re,math,json,wave,unicodedata,difflib,subprocess,shutil
import numpy as np
root=Path(__file__).resolve().parents[1]
takes=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'audio/continuacao'
src=root/'src'; out=root/'entrega'; sr=48000; fps=60; step=sr//fps
chapters=json.loads((root/'audio/capitulos.json').read_text('utf8'))
intro=json.loads((src/'cut.json').read_text('utf8'));start_frame=int(intro['frames'])
def fmt(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
def clean(s):return re.sub(r'\[[^\]]+\]\s*','',s).strip()
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s.lower()))
def read(p):
    return np.frombuffer(subprocess.check_output([shutil.which('ffmpeg') or 'ffmpeg','-v','error','-i',str(p),'-ac','1','-ar',str(sr),'-f','f32le','pipe:1']),np.float32).copy()
def measured(tokens,raw,dur):
    exact=[norm(w) for w in tokens];heard=[norm(w['w']) for w in raw]
    matcher=difflib.SequenceMatcher(None,exact,heard,autojunk=False)
    centers=[];pos=[];direct={}
    for a,b,n in matcher.get_matching_blocks():
        for k in range(n):
            w=raw[b+k];i=a+k;v=(w['s']+w['e'])/2
            if centers and v<=centers[-1]:continue
            direct[i]=(w['s'],w['e']);centers.append(v);pos.append(i)
    if len(pos)<len(tokens)*.52:raise ValueError(f'Alinhamento insuficiente: {len(pos)}/{len(tokens)}')
    timeline=np.interp(np.arange(len(tokens)),[-1,*pos,len(tokens)],[0,*centers,dur])
    words=[]
    for i,w in enumerate(tokens):
        s,e=direct.get(i,(max(0,(timeline[i]+(timeline[i-1] if i else 0))/2),min(dur,(timeline[i]+(timeline[i+1] if i+1<len(tokens) else dur))/2)))
        s=min(dur-.002,max(words[-1]['s']+.001 if words else 0,s));e=min(dur,max(s+.001,e))
        words.append(dict(w=w,s=float(s),e=float(e)))
    return words,round(len(pos)/len(tokens),3)
def captions(words):
    parts=[];line=[]
    def flush():
        if line:parts.append(dict(t=' '.join(w['w'] for w in line),s=line[0]['s'],e=line[-1]['e']));line.clear()
    for w in words:
        if line and (len(' '.join(x['w'] for x in line))+len(w['w'])>49 or w['s']-line[-1]['e']>.48):flush()
        line.append(w)
        if w['w'].endswith(('.','!','?',';')):flush()
    flush()
    for i,c in enumerate(parts):
        next_s=parts[i+1]['s'] if i+1<len(parts) else c['e']+.14
        c['e']=max(c['s']+.015,min(next_s-.018,c['e']+.14))
    return parts
def note(freq,d,volume):
    t=np.arange(round(d*sr))/sr
    return (volume*(np.sin(2*np.pi*freq*t)+.24*np.sin(2*np.pi*freq*2*t))*np.exp(-4*t/d)*np.minimum(t/.011,1)*np.minimum((d-t)/.03,1)).astype(np.float32)
def add(arr,t,a):
    i=max(0,round(sr*t));l=min(len(a),len(arr)-i)
    if l>0:arr[i:i+l]+=a[:l]
def paper(d,seed):
    t=np.arange(round(sr*d))/sr;noise=np.random.default_rng(seed).normal(size=len(t))
    return (.032*np.convolve(noise,[.18,.32,.32,.18],mode='same')*np.sin(t*np.pi/d)**2).astype(np.float32)
def audio_file(k):return next(takes/(k+e) for e in ['.wav','.mp3'] if (takes/(k+e)).is_file())
# O corte editorial dispensa repetições captadas em tomadas completas.
# Revisão: voltam o teste da premissa, o desfecho do colete, a avaliação das duas
# respostas da IA, o aviso honesto sobre viralizar e o fecho do papel.
omit={'escolha':{3},'progressao':{0},'celular':{3},'pc':{2}}
def edit_take(a,ws,lines,beats,removed):
    if not removed:return a,ws,lines,beats
    offsets=np.cumsum([0,*[len(v) for v in lines]])
    boundaries=[0]+[round(sr*(ws[i-1]['e']+ws[i]['s'])/2) for i in offsets[1:-1]]+[len(a)]
    samples=[];kept=[];script=[];shots=[];cursor=0
    for i,b in enumerate(beats):
        if i in removed:continue
        lo=max(0,min(len(a),boundaries[i]));hi=min(len(a),boundaries[i+1])
        segment=a[lo:hi].copy();n=min(180,len(segment)//2)
        if n:segment[:n]*=np.linspace(0,1,n);segment[-n:]*=np.linspace(1,0,n)
        samples.append(segment)
        for w in ws[offsets[i]:offsets[i+1]]:
            kept.append(dict(w=w['w'],s=max(cursor/sr,w['s']+(cursor-lo)/sr),e=min((cursor+hi-lo)/sr,w['e']+(cursor-lo)/sr)))
        cursor+=hi-lo;script.append(lines[i]);shots.append(b)
    return np.concatenate(samples),kept,script,shots
chap_data=[];beats=[];cues=[];words=[];env=[];checks=[];frame=start_frame
script=(root/'audio/abertura/Roteiro-do-piloto.md').read_text('utf8').replace('# O recibo','# Aula de boas-vindas · CenaViva',1)
with wave.open(str(root/'public/aula.wav'),'wb') as master:
    master.setparams((2,2,sr,0,'NONE',''))
    with wave.open(str(root/'public/mix.wav'),'rb') as base:master.writeframes(base.readframes(base.getnframes()))
    for num,c in enumerate(chapters):
        key=c['id'];a=read(audio_file(key));dur=len(a)/sr
        raw=json.loads((takes/(key+'.words.json')).read_text('utf8'))
        lines=[clean(b['line']).split() for b in c['beats']];tokens=sum(lines,[])
        ws,match=measured(tokens,raw,dur)
        a,ws,lines,selected=edit_take(a,ws,lines,c['beats'],omit.get(key,set()))
        c={**c,'beats':selected};dur=len(a)/sr;ix=0;bounds=[]
        for line in lines:bounds.append(ix);ix+=len(line)
        # Silêncios de ação: o telefone toca, o portão abre, o aluno escolhe o objeto.
        inserts={}
        if key=='filme':inserts={1:1.45,2:1.0,3:1.35}
        if key=='exercicio':inserts={1:3.45}
        lead=.24;tail=1.5 if key=='saida' else .3
        pauses=[(max(0,(ws[bounds[i]-1]['e']+ws[bounds[i]]['s'])/2),d) for i,d in inserts.items()]
        def local(t):return lead+t+sum(d for p,d in pauses if p<=t)
        onset=frame/fps;numframes=math.ceil((lead+dur+sum(inserts.values())+tail)*fps)
        mono=np.zeros(numframes*step,np.float32);foley=np.zeros_like(mono)
        voiced=a[np.abs(a)>.017];gain=10**(-16.8/20)/max(.012,np.sqrt(np.mean(voiced**2)))
        a=np.tanh(a*gain*1.1)/1.1
        prev=0;offset=round(lead*sr)
        for p,d in pauses+[(dur,0)]:
            end=round(p*sr);seg=a[prev:end].copy();n=min(240,len(seg)//2)
            if n:seg[:n]*=np.linspace(0,1,n);seg[-n:]*=np.linspace(1,0,n)
            mono[offset:offset+len(seg)]=seg;offset+=len(seg)+round(d*sr);prev=end
        for w in ws:w.update(s=round(onset+local(w['s']),3),e=round(onset+local(w['e']),3))
        times=[round(onset+local(rawtime),3) for rawtime in [0]]
        groups=[];chrome=[]
        for i,b in enumerate(c['beats']):
            wgroup=ws[bounds[i]:bounds[i]+len(lines[i])];groups.append(wgroup)
            t0=onset if i==0 else wgroup[0]['s']-.085
            chrome.append(t0)
            cue=captions(wgroup);cues.extend(cue)
            if b['action'] in ['chamada','cartaz','corta','risca','falha','colete','fichas','escrever','tres','entregar','chave','rever']:
                add(foley,max(0,t0-onset+.045),paper(.19,num*4+i))
        for i,b in enumerate(c['beats']):
            beats.append(dict(ch=key,shot=b['shot'],action=b['action'],s=round(chrome[i],3),e=round(chrome[i+1] if i+1<len(chrome) else (frame+numframes)/fps,3),i=i))
        if key=='filme':
            ring=chrome[1]-onset-1.23
            for j in [0,.38]:add(foley,ring+j,note(435,.27,.065)+note(482,.27,.032))
            add(foley,chrome[3]-onset-.67,paper(.46,362));add(foley,chrome[3]-onset-.33,note(174,.28,.034))
        # Assinatura sonora curtinha na abertura de cada capítulo (sintetizada aqui, sem direitos de terceiros).
        for delay,f in [(.0,293.66),(.11,392.0)]:add(foley,delay,note(f,.5,.024))
        if key=='saida':
            for delay,f in [(.0,196),(.18,246.94),(.36,293.66),(.64,392)]:add(foley,numframes/fps-1.36+delay,note(f,.64,.038))
        shape=mono.reshape(-1,step);vals=np.clip((np.sqrt(np.mean(shape*shape,axis=1))-.008)*5.9,0,1)
        env.extend(np.convolve(vals,[.18,.59,.23],mode='same').round(3).tolist());words.extend(ws)
        stereo=np.stack((mono+foley*.88,mono+foley),axis=-1);master.writeframes((np.clip(stereo,-.99,.99)*32767).astype('<i2').tobytes())
        chap_data.append(dict(id=key,title=c['title'],fromFrame=frame,frames=numframes));frame+=numframes
        checks.append(dict(id=key,duration=round(dur,3),matched=match))
        script+='\n\n## '+c['title']+'\n\n'+'\n\n'.join(clean(b['line']) for b in c['beats'])
timeline=dict(frames=frame,introFrames=start_frame,chapters=chap_data,beats=beats,cues=cues,words=words,env=env)
(src/'aula.json').write_text(json.dumps(timeline,ensure_ascii=False,separators=(',',':')),encoding='utf8')
(root/'revisao/alinhamento.json').write_text(json.dumps(checks,indent=2),encoding='utf8')
intro_srt=(root/'audio/abertura/O-Recibo.srt').read_text('utf-8-sig').strip()
first=len(intro_srt.split('\n\n'))+1
(out/'CenaViva-Legendas.srt').write_text(intro_srt+'\n\n'+'\n\n'.join(f"{i+first}\n{fmt(c['s'])} --> {fmt(c['e'])}\n{c['t']}" for i,c in enumerate(cues))+'\n',encoding='utf-8-sig')
(out/'Roteiro-da-aula.md').write_text(script+'\n',encoding='utf8')
(out/'Capitulos.txt').write_text('00:00  O recibo\n'+'\n'.join(f"{int(c['fromFrame']/fps)//60:02}:{int(c['fromFrame']/fps)%60:02}  {c['title']}" for c in chap_data)+'\n',encoding='utf8')
print(frame,'quadros;',round(frame/fps,3),'segundos;',len(cues),'legendas novas')
