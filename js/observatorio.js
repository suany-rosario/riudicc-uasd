/* Observatorio de movilidad: panorama UNESCO + micro-observatorio UASD (datos provisionales) */
(function(){

const DATA=window.DEMO;
const SD=[-69.93,18.47];
const $=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const F={sentido:"",dimension:"",perfil:"",facultad:"",anio:""};
const uniq=k=>[...new Set(DATA.rows.map(r=>r[k]))].sort();
uniq("perfil").forEach(v=>$("fPerfil").add(new Option(v,v)));
uniq("facultad").forEach(v=>$("fFac").add(new Option(v,v)));
uniq("anio").forEach(v=>$("fAnio").add(new Option(String(v),String(v))));
document.querySelectorAll(".seg button").forEach(b=>b.addEventListener("click",()=>{
  F[b.dataset.f]=b.dataset.v; b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b))); update();}));
$("fPerfil").addEventListener("input",e=>{F.perfil=e.target.value;update();});
$("fFac").addEventListener("input",e=>{F.facultad=e.target.value;update();});
$("fAnio").addEventListener("input",e=>{F.anio=e.target.value;update();});
$("reset").addEventListener("click",()=>{Object.keys(F).forEach(k=>F[k]=""); ["fPerfil","fFac","fAnio"].forEach(i=>$(i).value="");
  document.querySelectorAll(".seg").forEach(s=>s.querySelectorAll("button").forEach((x,i)=>x.setAttribute("aria-pressed",String(i===0)))); update();});

function filtered(){return DATA.rows.filter(r=>(!F.sentido||r.sentido===F.sentido)&&(!F.dimension||r.dimension===F.dimension)&&(!F.perfil||r.perfil===F.perfil)&&(!F.facultad||r.facultad===F.facultad)&&(!F.anio||String(r.anio)===F.anio));}
function count(rows,key){const m=new Map(); rows.forEach(r=>{const k=r[key]; const o=m.get(k)||{k,out:0,in:0}; if(r.sentido==="SALIENTE") o.out++; else o.in++; m.set(k,o);}); return [...m.values()].map(o=>({...o,t:o.out+o.in})).sort((a,b)=>b.t-a.t);}
const pct=(a,b)=>b?Math.round(a*100/b)+"%":"–";
const tip=$("tip");
function hover(node,text){node.addEventListener("pointermove",e=>{tip.textContent=text; tip.hidden=false; tip.style.left=Math.min(e.clientX+12,innerWidth-270)+"px"; tip.style.top=(e.clientY+14)+"px";}); node.addEventListener("pointerleave",()=>tip.hidden=true);}

function kpis(rows){
  const K=$("kpis"); K.textContent="";
  const out=rows.filter(r=>r.sentido==="SALIENTE").length, inn=rows.length-out;
  const intl=rows.filter(r=>r.dimension==="INTERNACIONAL");
  const paises=new Set(intl.map(r=>r.pais)).size;
  const muj=rows.filter(r=>r.sexo==="FEMENINO").length;
  const disc=rows.filter(r=>r.discapacidad).length;
  const tiles=[
    [String(rows.length),"movilidades registradas",null],
    [null,"salientes · entrantes",[out,inn]],
    [pct(intl.length,rows.length),"internacionales",`${paises} países`],
    [pct(muj,rows.length),"mujeres",`${muj} de ${rows.length}`],
    [String(disc),"con discapacidad declarada","preguntas A–F del MESCyT"]];
  tiles.forEach(([v,l,s])=>{const d=el("div","kpi");
    if(Array.isArray(s)){const vv=el("div","v"); const a=el("span"); a.append(el("span","dot out")," "+s[0]); const b=el("span"); b.append(el("span","dot in")," "+s[1]); vv.append(a,"  ",b); d.append(vv,el("div","l",l));}
    else{d.append(el("div","v",v),el("div","l",l)); if(s) d.append(el("div","s",s));}
    K.append(d);});
}

function hbars(id,rows,key,max,split){
  const B=$(id); B.textContent=""; let data=count(rows,key); if(max&&data.length>max){const rest=data.slice(max); data=data.slice(0,max); const o={k:"Otros ("+rest.length+")",out:0,in:0}; rest.forEach(r=>{o.out+=r.out;o.in+=r.in;}); o.t=o.out+o.in; data.push(o);}
  const top=Math.max(1,...data.map(d=>d.t));
  if(!data.length){B.append(el("p","sub","Sin registros con estos filtros.")); return;}
  data.forEach(d=>{const row=el("div","hb"); row.append(el("span","name",d.k.trim()));
    const tr=el("div","track");
    if(split){ if(d.out){const a=el("span","seg1"+(d.in?" join":"")); a.style.width=(d.out/top*100)+"%"; tr.append(a);} if(d.in){const b=el("span","seg2"); b.style.width=(d.in/top*100)+"%"; tr.append(b);} }
    else {const a=el("span","seg1"); a.style.width=(d.t/top*100)+"%"; a.style.background="var(--accent)"; tr.append(a);}
    row.append(tr, el("span","val",String(d.t)));
    hover(row, `${d.k.trim()}: ${d.t} (salientes ${d.out}, entrantes ${d.in})`);
    B.append(row);});
}

function cols(rows){
  const C=$("cols"), X=$("colx"); C.textContent=""; X.textContent="";
  const per=[...new Set(DATA.rows.map(r=>r.periodo))].sort((a,b)=>a.localeCompare(b,"es",{numeric:true}));
  const data=per.map(p=>{const rs=rows.filter(r=>r.periodo===p); const out=rs.filter(r=>r.sentido==="SALIENTE").length; return {p,out,in:rs.length-out};});
  const top=Math.max(1,...data.map(d=>Math.max(d.out,d.in)));
  data.forEach(d=>{const c=el("div","col"+(d.p==="2026-II"?" partial":"")); const pr=el("div","pair");
    const a=el("div","b out"); a.style.height=(d.out/top*100)+"%"; const b=el("div","b in"); b.style.height=(d.in/top*100)+"%";
    pr.append(a,b); c.append(pr); const t=el("div","tot",String(d.out+d.in)); t.style.bottom=(Math.max(d.out,d.in)/top*100)+"%"; t.style.transform="translateY(-4px)"; c.append(t);
    hover(c,`${d.p}: ${d.out} salientes, ${d.in} entrantes${d.p==="2026-II"?" (semestre en curso)":""}`);
    C.append(c); X.append(el("span",null,d.p));});
}

function table(rows){
  const T=$("tbody"); T.textContent=""; const sorted=[...rows].sort((a,b)=>b.fecha.localeCompare(a.fecha));
  const lim=table.lim||25; sorted.slice(0,lim).forEach(r=>{const tr=el("tr");
    const f=r.fecha.split("-"); tr.append(el("td","mono",`${f[2]}/${f[1]}/${f[0]}`));
    const s=el("td"); s.append(el("span","pill "+(r.sentido==="SALIENTE"?"out":"in"),r.sentido==="SALIENTE"?"Saliente":"Entrante")); tr.append(s);
    [r.perfil,r.facultad,r.pais,r.institucion,r.razon.trim(),r.organismo].forEach(v=>tr.append(el("td",null,v))); T.append(tr);});
  $("tblCount").textContent=`${Math.min(lim,rows.length)} de ${rows.length}, más recientes primero`;
  $("more").hidden=rows.length<=lim;
}
$("more").addEventListener("click",()=>{table.lim=(table.lim||25)+50; table(filtered());});

// ---------- Mapa ----------
function mapList(rows){
  const L=$("maplist"); L.textContent="";
  const intl=rows.filter(r=>r.dimension==="INTERNACIONAL"); const data=count(intl,"pais");
  L.append(el("div","sub",intl.length?`${intl.length} internacionales en ${data.length} países`:"Sin movilidades internacionales con estos filtros"));
  data.slice(0,10).forEach(d=>{const r=el("div","row"); const n=el("span"); n.append(d.k); r.append(n, el("span","n",`${d.out} · ${d.in}`)); L.append(r);});
  if(data.length) L.append(el("div","sub","Cifras: salientes · entrantes"));
  const nac=rows.filter(r=>r.dimension==="NACIONAL");
  $("mapNote").textContent = nac.length ? `Además, ${nac.length} movilidades nacionales con ${new Set(nac.map(r=>r.institucion)).size} instituciones dominicanas (${count(nac,"institucion").slice(0,3).map(d=>d.k).join(", ")}…).` : "";
}
const SVGNS="http://www.w3.org/2000/svg";
const svgEl=(t,attrs)=>{const e=document.createElementNS(SVGNS,t); for(const k in attrs) e.setAttribute(k,attrs[k]); return e;};
let mapOK=false, mapSvg=null, mapLayer=null;
const M=window.MUNDO;
const proj=(lon,lat)=>[(lon-M.lon0)*M.w/(M.lon1-M.lon0),(M.lat0-lat)*M.w/(M.lon1-M.lon0)*M.yf];
function initMap(){
  const box=$("map"); if(!M){ box.append(el("p","sub","El mapa no está disponible. La lista de países muestra los mismos datos.")); return; }
  mapOK=true; box.style.aspectRatio=M.w+"/"+M.h;
  mapSvg=svgEl("svg",{viewBox:`0 0 ${M.w} ${M.h}`,width:"100%",height:"100%",role:"img","aria-label":"Mapa de movilidades internacionales desde y hacia Santo Domingo"});
  const land=svgEl("g",{class:"land"});
  M.paises.forEach(c=>{const pth=svgEl("path",{d:c.d}); const t=svgEl("title",{}); t.textContent=c.n; pth.append(t); land.append(pth);});
  mapLayer=svgEl("g",{});
  mapSvg.append(land,mapLayer); box.append(mapSvg);
}
function arcPath(a,b,bend){const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2, dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1; const cx=mx-dy/L*L*bend, cy=my+dx/L*L*bend; return `M${a[0].toFixed(1)},${a[1].toFixed(1)}Q${cx.toFixed(1)},${cy.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;}
function drawMap(rows){
  if(!mapOK) return; mapLayer.textContent="";
  const intl=rows.filter(r=>r.dimension==="INTERNACIONAL"); const data=count(intl,"pais");
  const top=Math.max(1,...data.map(d=>d.t)); const home=proj(SD[0],SD[1]);
  const gOut=svgEl("g",{class:"arcs out"}), gIn=svgEl("g",{class:"arcs in"}), gDots=svgEl("g",{});
  data.forEach(d=>{const c=DATA.coords[d.k]; if(!c) return; const p=proj(c[0],c[1]);
    if(d.out){const pa=svgEl("path",{d:arcPath(home,p,.18),"stroke-width":(1+3*d.out/top).toFixed(2)}); gOut.append(pa); hover(pa,`Salientes a ${d.k}: ${d.out}`);}
    if(d.in){const pa=svgEl("path",{d:arcPath(p,home,.18),"stroke-width":(1+3*d.in/top).toFixed(2)}); gIn.append(pa); hover(pa,`Entrantes desde ${d.k}: ${d.in}`);}
    const r=3+8*Math.sqrt(d.t/top); const dot=svgEl("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:r.toFixed(1),class:"dotp"}); gDots.append(dot); hover(dot,`${d.k}: salientes ${d.out} · entrantes ${d.in}`);
    if(d.t>=top*.35){const tx=svgEl("text",{x:(p[0]+r+3).toFixed(1),y:(p[1]+4).toFixed(1),class:"lbl"}); tx.textContent=d.k; gDots.append(tx);}
  });
  const hd=svgEl("circle",{cx:home[0].toFixed(1),cy:home[1].toFixed(1),r:6,class:"homep"}); hover(hd,"Santo Domingo · UASD");
  const ht=svgEl("text",{x:(home[0]+9).toFixed(1),y:(home[1]+16).toFixed(1),class:"lbl strong"}); ht.textContent="UASD";
  gDots.append(hd,ht);
  mapLayer.append(gOut,gIn,gDots);
}




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

function update(){ if(!mapSvg && window.MUNDO && !update._m){ update._m=1; initMap(); }
  const rows=filtered(); kpis(rows); mapList(rows); drawMap(rows); cols(rows);
  hbars("bRazon",rows,"razon",7,false); hbars("bOrg",rows,"organismo",8,false); hbars("bFac",rows,"facultad",9,true); hbars("bPerfil",rows,"perfil",6,true);
  const nac=rows.filter(r=>r.dimension==="NACIONAL").length; $("nacNote").textContent=`${pct(nac,rows.length)} de las movilidades son nacionales (con otras instituciones dominicanas).`;
  table.lim=25; table(rows);
}
update();


})();
