/* Panorama RIUDICC: movilidad en los países de la red (UNESCO UIS), a partir de data/panorama.js */
(function(){
const $=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
const tip=$("tip");
function hover(node,text){ if(!tip) return; node.addEventListener("pointermove",e=>{tip.textContent=text; tip.hidden=false; tip.style.left=Math.min(e.clientX+12,innerWidth-270)+"px"; tip.style.top=(e.clientY+14)+"px";}); node.addEventListener("pointerleave",()=>tip.hidden=true);}
const fmt=n=>n.toFixed(2).replace(".",",")+" %";
function panorama(){
  const P=window.PANORAMA||[]; const C=$("cmp"); if(!C) return; const top=Math.max(...P.map(p=>Math.max(p.out,p.inn)));
  [["lat","Núcleo latinoamericano"],["eu","Socios europeos (destino)"]].forEach(([g,label])=>{
    C.append(el("div","grp",label));
    P.filter(p=>p.g===g).forEach(p=>{
      const row=el("div","c"); row.append(el("span","cn",p.p));
      const bars=el("div","bars");
      [["out",p.out,p.oy],["in",p.inn,p.iy]].forEach(([k,v,y])=>{const br=el("div","br"); const tr=el("div"); const b=el("div","t "+k); b.style.width=(v/top*100)+"%"; tr.append(b); br.append(tr, el("span","v",fmt(v))); bars.append(br); hover(br,`${p.p}: ${k==="out"?"estudian en otro país":"estudiantes internacionales recibidos"} ${fmt(v)} (${y})`);});
      row.append(bars); C.append(row);});
  });
  C.append(el("div","axisnote","Escala común de 0 a "+fmt(top)));
  const Fi=$("fichas");
  P.forEach(p=>{const c=el("article","ficha"+(p.g==="eu"?" eu":""));
    c.append(el("h3",null,p.p), el("div","uni","RIUDICC: "+p.u));
    const dl=el("dl");
    [["Estudian en otro país",fmt(p.out),p.oy],["Internacionales recibidos",fmt(p.inn),p.iy],["Cobertura en ed. superior",p.ger.toFixed(1).replace(".",",")+" %",p.gy]].forEach(([a,b,y])=>{const dd=el("dd",null,b); dd.append(el("small",null,String(y))); dl.append(el("dt",null,a),dd);});
    c.append(dl); Fi.append(c);});
  const S=$("panoSrc"); if(S) (window.PANORAMA_FUENTES||[]).forEach((f,i)=>{ if(i) S.append(" · "); const a=el("a",null,f.nombre); a.href=f.enlace; a.target="_blank"; a.rel="noopener noreferrer"; S.append(a);});
}
panorama();
})();
