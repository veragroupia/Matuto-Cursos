"""Build the mix, measured cue sheet, mouth envelope and editable subtitles.
For new voice takes run transcribe.py first and review caption wording/times."""
import argparse, difflib, json, math, re, shutil, subprocess, unicodedata, wave
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--takes',type=Path,default=root/'audio')
args=parser.parse_args()
reference=json.loads((root/'src/performance.json').read_text('utf8'))
sr=48000
def read(name):
    p=subprocess.run([shutil.which('ffmpeg') or 'ffmpeg','-v','error','-i',str(name),'-ar',str(sr),'-ac','1','-f','f32le','pipe:1'],capture_output=True,check=True)
    return np.frombuffer(p.stdout,np.float32).copy()
def write(path,what):
    with wave.open(str(path),'wb') as w:
        w.setparams((what.shape[1],2,sr,0,'NONE','not compressed'));w.writeframes((np.clip(what,-1,1)*32767).astype('<i2').tobytes())
def loadwords(name):
    return json.loads((args.takes/(name+'.words.json')).read_text('utf8'))
def timefmt(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
texts=[
['Segura esse recibo pra mim.','Não espia o nome lá embaixo ainda, viu?','Chega mais. Puxa a cadeira.','Eu sou o Matuto.','Bem-vindo ao CenaViva.','Ó, escuta o que esse homem','foi me dizer no campinho.'],
['Clube grande!','Eu já tava escolhendo o número da camisa.','Dez, claro.','Reserva também escolhe número, né?','Vem cá. Imagina que a minha história','abre assim: um menino quer jogar bola.','Tu pode até ir passar um café.','Na volta, o menino ainda quer jogar bola.'],
['Agora bota esse papel na cena.','O teste é amanhã.','E pra entrar…','eu tenho que pagar R$ 200 hoje.','Oxe. Com que dinheiro?','Experimenta comigo.','Tapa o recibo.','Que é que o menino quer? Jogar.','Destapa.','Que é que tá no caminho? A cobrança.','Agora já dá pra filmar a escolha dele,','até com o celular.'],
['E o nome que eu pedi pra tu guardar?','Repara aqui.','Se a taxa é do clube…','por que o dinheiro vai pra conta','de Rogério?']]
anchors=[[0,2.16,4.76,6.78,8.06,9.84,11.28],[0,1.52,3.68,4.84,7.58,9.50,12.60,14.36],[0,2.2,3.66,4.94,7.52,9.54,10.96,12.22,14.48,15.46,18.06,20.24],[0,2.22,3.52,5.32,6.64]]
takes=[read(next(p for ext in ['wav','mp3'] if (p:=args.takes/f'v4-{i}.{ext}').is_file())) for i in range(1,5)]
# Adapt the block boundaries to real files. Captions are snapped to the reviewed ASR words.
lengths=[len(s)/sr for s in takes]
cliplen=9.35
clip=.23+lengths[0]+.15
starts=[.23,clip+cliplen+.29]
starts+=[starts[-1]+lengths[1]+.32]
starts+=[starts[-1]+lengths[2]+.42]
end=starts[-1]+lengths[-1]+1.03
frames=math.ceil(end*60)
n=round(frames/60*sr); mix=np.zeros((n,2)); voice=np.zeros(n); words=[]; cues=[]
def plain(w):
    return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',w.lower()))
maps=[]
for i in range(4):
    old=reference['words'][i];new=loadwords(f'v4-{i+1}');pairs=[(0.,0.)]
    matcher=difflib.SequenceMatcher(None,[plain(w['w']) for w in old],[plain(w['w']) for w in new],autojunk=False)
    for a,b,count in matcher.get_matching_blocks():
        for j in range(count):
            for key in ['s','e']:
                u,v=old[a+j][key],new[b+j][key]
                if u>pairs[-1][0] and v>pairs[-1][1] and v<lengths[i]:pairs.append((u,v))
    pairs.append((reference['ends'][i]-reference['starts'][i],lengths[i]))
    maps.append(np.array(pairs))
def retime(i,x):
    m=maps[i];return float(np.interp(x,m[:,0],m[:,1]))
def add(t,a,l=1,r=1):
    off=round(t*sr);arr=a[:n-off];mix[off:off+len(arr)]+=arr[:,None]*[l,r]
def level(a,target):
    voiced=a[np.abs(a)>.017]
    gain=10**(target/20)/max(.015,np.sqrt(np.mean(voiced**2)))
    return np.tanh(a*gain*1.1)/1.1
for i,(t,a) in enumerate(zip(starts,takes)):
    a=level(a,-16.8);a[:480]*=np.linspace(0,1,480);a[-480:]*=np.linspace(1,0,480)
    add(t,a);off=round(t*sr);voice[off:off+len(a)]+=a
    ws=loadwords(f'v4-{i+1}')
    for w in ws:words.append(dict(w=w['w'],s=round(t+w['s'],3),e=round(t+w['e'],3)))
    for j,(anchor,caption) in enumerate(zip(anchors[i],texts[i])):
        stop=retime(i,anchors[i][j+1]) if j+1<len(anchors[i]) else lengths[i]
        cues.append(dict(t=caption,s=round(t+retime(i,anchor),3),e=round(t+stop-.035,3)))
arc=level(read(root/'public/rogerio.mp4')[:round(sr*cliplen)],-19)
arc[:720]*=np.linspace(0,1,720);arc[-5760:]*=np.linspace(1,0,5760);add(clip,arc,.96,1)
rng=np.random.default_rng(41)
def foley(t,d=.22,vol=.025):
    x=np.arange(int(d*sr))/sr
    noise=rng.normal(0,1,len(x)); rasp=np.convolve(noise,[.20,.3,.30,.20],mode='same')
    a=vol*rasp*np.sin(np.pi*x/d)**2*(.5+.5*np.sin(x*57+.3)**2);add(t,a,.84,1)
def note(t,f,d,v):
    x=np.arange(round(sr*d))/sr
    a=(np.sin(2*np.pi*f*x)+.30*np.sin(2*np.pi*f*2*x)+.12*np.sin(2*np.pi*f*3.005*x))*np.exp(-x*4/d)*np.minimum(1,x/.008)*np.minimum(1,(d-x)/.08)*v
    add(t,a,.95,.77)
for t in [.12,*[starts[2]+retime(2,v) for v in [.35,10.88,14.47]],starts[3]+retime(3,6.01)]:foley(t)
for t,f in [(1.77,196),(1.98,293.66),(starts[1]-.25,392),(end-1.23,220),(end-.92,233.08)]:note(t,f,.76,.034)
note(starts[1]+retime(1,16.06),1210,.090,.047)
note(starts[1]+retime(1,16.07),1731,.070,.019)
t=np.arange(n)/sr
hum=.00076*np.sin(t*2*np.pi*74)+.0005*np.sin(t*2*np.pi*148)
mix+=hum[:,None];mix[-int(.5*sr):]*=np.linspace(1,0,int(.5*sr))[:,None]
write(root/'public/mix.wav',mix)
step=sr//60; env=[]
for i in range(frames):
    x=voice[max(0,i*step-240):min(n,(i+1)*step+240)]
    env.append(round(float(np.clip((np.sqrt(np.mean(x*x))-.009)*5.8,0,1)),3))
for i in range(1,len(env)-1):
    env[i]=round(.23*env[i-1]+.58*env[i]+.19*env[i+1],3)
cut=dict(frames=frames,starts=starts,ends=[s+d for s,d in zip(starts,lengths)],clip=clip,cliplen=cliplen,cues=cues,words=words,env=env)
sync=[[0,0]]
for i in range(4):
    for original,actual in maps[i]:
        point=[round(starts[i]+actual,6),round(reference['starts'][i]+original,6)]
        if point[0]>sync[-1][0] and point[1]>sync[-1][1]:sync.append(point)
sync.append([frames/60,reference['frames']/60])
cut['sync']=sync
(root/'src/cut.json').write_text(json.dumps(cut,ensure_ascii=False,separators=(',',':')),encoding='utf8')
allcues=sorted(cues+[dict(s=clip+a,e=clip+b,t=s) for a,b,s in [(0,1.89,'Ô, moleque! Vem cá!'),(3.94,6.49,'Moleque, tu é diferenciado, viu?'),(6.68,9.05,'Tem clube grande em São Paulo te esperando!')]], key=lambda c:c['s'])
(root/'entrega/O-Recibo.srt').write_text('\n\n'.join(f"{i+1}\n{timefmt(c['s'])} --> {timefmt(c['e'])}\n{c['t']}" for i,c in enumerate(allcues))+'\n',encoding='utf-8-sig')
print(frames, starts, end)
