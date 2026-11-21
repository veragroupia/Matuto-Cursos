"""Texturas originais impressas e telão do ateliê. Requer Pillow e NumPy."""
from PIL import Image, ImageDraw as ID, ImageFont as IF
from pathlib import Path
import numpy as np, math, random
root=Path(__file__).resolve().parents[1]/'public'
rng=random.Random(16)
def f(size,face='bahnschrift'):
    return IF.truetype(str(Path('C:/Windows/Fonts')/(face+'.ttf')),size)
def sheet(name,img,grain=2):
    a=np.asarray(img.convert('RGB')).astype(int)
    noise=np.random.default_rng(42).normal(0,grain,(a.shape[0],a.shape[1],1))
    Image.fromarray(np.uint8(np.clip(a+noise,0,255))).save(root/(name+'.jpg'),quality=94,subsampling=0)
def text(d,xy,s,size,color,face='bahnschrift'):d.text(xy,s,font=f(size,face),fill=color,stroke_width=0)
def line(d,xy,col,w=3):d.line(xy,fill=col,width=w)
cream='#f9eacc';ink='#273c39';red='#ad412b';green='#356a60'
im=Image.new('RGB',(680,940),cream); d=ID.Draw(im)
d.rectangle((0,0,22,940),fill='#d35b3d')
text(d,(60,34),'CAMPO   /   FUTEBOL',31,green,'consolab')
line(d,(60,90,620,90),ink,4)
text(d,(56,109),'Teste no clube',69,ink,'georgiab')
text(d,(60,217),'INSCRIÇÃO   •   VIA DO ATLETA',26,green,'consolab')
d.rounded_rectangle((60,292,617,395),radius=6,fill='#e8cf9e')
text(d,(81,302),'AMANHÃ',54,ink)
text(d,(361,329),'07h00',37,ink,'consolab')
text(d,(60,450),'TAXA DE AVALIAÇÃO',32,green,'consolab')
text(d,(53,485),'R$ 200,00',86,red,'georgiab')
text(d,(61,611),'Vencimento hoje',33,ink)
for x in range(29,662,21):line(d,(x,696,x+10,696),'#847b65',2)
text(d,(61,727),'FAVORECIDO DO PIX',29,green,'consolab')
text(d,(54,781),'ROGÉRIO',75,ink,'georgiab')
text(d,(60,901),'ADEREÇO FICTÍCIO   /   CENAVIVA',20,green,'consola')
sheet('recibo',im)
im=Image.new('RGB',(680,940),'#eee0be');d=ID.Draw(im)
d.rectangle((0,0,22,940),fill='#c56b4d')
text(d,(64,75),'ARQUIVO DO MATUTO',28,green,'consolab')
line(d,(61,130,612,130),'#a69c83',2)
for y in range(270,724,67):line(d,(65,y,612,y),'#c9bfa7',2)
text(d,(65,300),'Guarda',101,ink,'segoepr')
text(d,(104,451),'pra mim.',91,ink,'segoepr')
text(d,(64,807),'01   /   CAMPO',29,red,'consolab');sheet('verso',im)
im=Image.new('RGB',(680,270),'#527a6f');d=ID.Draw(im)
for y in (12,255):line(d,(15,y,665,y),'#b5b697',2)
text(d,(34,52),'Campo de terra',58,cream,'georgiai');text(d,(40,160),'CADERNO DO MATUTO',25,'#d0d6b6','consolab');sheet('tira',im)
im=Image.new('RGB',(680,920),'#cc734d');d=ID.Draw(im)
d.rectangle((29,28,650,892),outline='#653d32',width=3)
text(d,(65,66),'CADERNO   /   01',32,ink,'consolab')
d.ellipse((144,232,544,632),outline=cream,width=8)
line(d,(144,433,544,433),cream,4);d.ellipse((300,389,388,477),outline=cream,width=5)
text(d,(62,739),'Rascunhos',65,cream,'georgiai');sheet('caderno',im)
im=Image.new('RGB',(670,880),'#f0ddb6');d=ID.Draw(im)
text(d,(34,23),'OFICINA DE HISTÓRIAS',27,ink,'consolab')
text(d,(31,70),'CENA',143,ink,'bahnschrift');text(d,(27,202),'VIVA',145,ink,'bahnschrift')
d.ellipse((280,364,569,653),fill='#d26b48')
for i,col in enumerate(['#98aaa0','#547d72','#34594e','#223e39']):
    y=595+i*55
    pts=[(x,y+int(41*math.sin(x/114+i*.85)+13*math.cos(x/69))) for x in range(0,681,8)]
    d.polygon(pts+[(680,880),(0,880)],fill=col)
text(d,(35,816),'SERTÃO  •  BRASIL',23,cream,'consolab');sheet('cartaz',im,3.2)
im=Image.new('RGB',(1344,736),'#162d32');d=ID.Draw(im)
for i in range(0,1344,38):line(d,(i,0,i,736),'#1c3538',1)
for i in range(0,736,38):line(d,(0,i,1344,i),'#1c3538',1)
text(d,(50,38),'CENAVIVA',45,'#ffdfac','bahnschrift')
text(d,(54,113),'ILHA DE EDIÇÃO',21,'#91b9ab','consolab')
line(d,(48,161,314,161),'#547870',2)
text(d,(51,306),'Fita de',54,cream,'georgiai');text(d,(51,372),'campo',66,cream,'georgiab')
text(d,(52,518),'ROGÉRIO',26,'#e5996d','consolab')
text(d,(54,561),'No campinho',31,'#c3cec0')
text(d,(1053,51),'ARQUIVO  01',24,'#8bae9f','consolab')
for i in range(17):
    h=15+rng.randrange(5,70); d.rectangle((1080+i*8,424-h,1084+i*8,424),fill='#a0c5a6')
text(d,(1055,463),'SOM DIRETO',22,'#a0c5a6','consolab')
line(d,(50,671,1288,671),'#557773',2)
sheet('monitor',im)
im=Image.new('RGB',(1536,664));d=ID.Draw(im)
for y in range(664):
    v=y/664; d.line((0,y,1536,y),fill=tuple(int((1-v)*a+v*b) for a,b in zip((114,163,169),(255,208,151))))
d.ellipse((930,148,1053,271),fill='#f6d59f')
for i,col in enumerate(['#b69e85','#ab8f7a','#7f8c7b','#536f64']):
    pts=[(x,412+i*49+int(45*math.sin(x/174+i*1.4)+29*math.cos(x/96+i)+6*math.sin(x/23))) for x in range(0,1540,8)]
    d.polygon(pts+[(1540,664),(0,664)],fill=col)
sheet('janela',im,1.3)
im=Image.new('RGB',(1024,512),'#b97d51');d=ID.Draw(im)
for i in range(430):
    y=rng.random()*512;x=rng.random()*1024;L=rng.random()*180+18
    v=rng.choice(['#b47a50','#ae764e','#c78b5c','#c18556'])
    d.line([(x+t,y+2*math.sin(t/76+x)) for t in range(0,int(L),4)],fill=v,width=rng.choice([1,1,2]))
sheet('madeira',im,2)
