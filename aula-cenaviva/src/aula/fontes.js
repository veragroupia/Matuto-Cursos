// Carrega as fontes livres embutidas antes do primeiro quadro (render determinístico).
const LISTA=[
  ['Source Serif 4','SourceSerif4-600.woff2','normal','600 700'],
  ['Source Serif 4','SourceSerif4-600i.woff2','italic','600'],
  ['Barlow Semi Condensed','BarlowSemiCondensed-500.woff2','normal','500'],
  ['Barlow Semi Condensed','BarlowSemiCondensed-700.woff2','normal','700'],
  ['JetBrains Mono','JetBrainsMono-500.woff2','normal','500 700'],
  ['Caveat','Caveat-600.woff2','normal','600 700'],
  ['Inter','Inter-500.woff2','normal','500 800'],
];
export async function carregarFontes(asset){
  await Promise.all(LISTA.map(async([nome,arquivo,style,weight])=>{
    const f=new FontFace(nome,`url(${asset('fonts/'+arquivo)})`,{style,weight});
    document.fonts.add(await f.load());
  }));
}
