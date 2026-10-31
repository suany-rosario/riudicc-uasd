/* Panel RI · pestaña "Registro de movilidad": movilidades aprobadas por el Consejo Universitario */
(function(){
  "use strict";
  const D=window.MOVILIDADES; if(!D) return;
  const ALL=D.rows;
  const $=id=>document.getElementById(id);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
  const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const fecha=s=>{ const [y,m]=s.split("-").map(Number); return `${MESES[m-1]} ${y}`; };
  const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const tip=$("tip");
  function hover(node,text){ node.addEventListener("pointermove",e=>{tip.textContent=text; tip.hidden=false; tip.style.left=Math.min(e.clientX+12,innerWidth-270)+"px"; tip.style.top=(e.clientY+14)+"px";}); node.addEventListener("pointerleave",()=>tip.hidden=true); }
  const pct=(a,b)=>b?Math.round(a*100/b)+" %":"–";
  const byKey=(rows,key)=>{const m=new Map(); rows.forEach(r=>{const o=m.get(r[key])||{k:r[key],out:0,in:0}; r.sentido==="SALIENTE"?o.out++:o.in++; m.set(r[key],o);}); return [...m.values()].map(o=>({...o,t:o.out+o.in})).sort((a,b)=>b.t-a.t||String(a.k).localeCompare(String(b.k),"es"));};

  const out=ALL.filter(r=>r.sentido==="SALIENTE"), inn=ALL.filter(r=>r.sentido==="ENTRANTE");
  const anios=[...new Set(ALL.map(r=>r.anio))].sort((a,b)=>a-b);
  const res=new Set(ALL.map(r=>r.resolucion).filter(Boolean)).size;
  const cu=ALL.filter(r=>r.fuente!=="Registro de Relaciones Internacionales").length, ri=ALL.length-cu;
  const sx=ALL.filter(r=>r.sexo!=="NO CONSTA"), muj=sx.filter(r=>r.sexo==="FEMENINO").length;
  $("mvAviso").textContent=` ${ALL.length} movilidades de personas (${out.length} salientes y ${inn.length} entrantes) entre ${anios[0]} y ${anios[anios.length-1]}: ${cu} aprobadas en ${res} resoluciones del Consejo Universitario (viajes de autoridades, aportes económicos, licencias de estudio, rotaciones clínicas y profesores invitados)${ri?` y ${ri} aportadas por el equipo de Relaciones Internacionales`:""}. No es todavía el total de la movilidad de la UASD.`;

  // Cifras clave
  const paises=new Set(ALL.map(r=>r.pais)).size;
  [[String(ALL.length),"movilidades registradas",`${res} resoluciones del Consejo`],
   [null,"salientes · entrantes",[out.length,inn.length]],
   [String(paises),"países",`${byKey(ALL,"pais")[0].k} y ${byKey(ALL,"pais")[1].k} a la cabeza`],
   [pct(muj,sx.length),"mujeres",`${muj} de ${sx.length} con sexo conocido`]]
  .forEach(([v,l,s])=>{const d=el("div","kpi");
    if(Array.isArray(s)){const vv=el("div","v"); const a=el("span"); a.append(el("span","dot out")," "+s[0]); const b=el("span"); b.append(el("span","dot in")," "+s[1]); vv.append(a,"  ",b); d.append(vv,el("div","l",l));}
    else{d.append(el("div","v",v),el("div","l",l),el("div","s",s));}
    $("mvKpis").append(d);});

  // Columnas por año
  (function(){
    const C=$("mvAnios"), X=$("mvAniosX"); const ys=[]; for(let y=anios[0];y<=anios[anios.length-1];y++) ys.push(y);
    const data=ys.map(y=>{const rs=ALL.filter(r=>r.anio===y); const o=rs.filter(r=>r.sentido==="SALIENTE").length; return {y,o,i:rs.length-o};});
    const top=Math.max(1,...data.map(d=>Math.max(d.o,d.i)));
    data.forEach(d=>{const c=el("div","col"); const pr=el("div","pair"); const a=el("div","b out"); a.style.height=(d.o/top*100)+"%"; const b=el("div","b in"); b.style.height=(d.i/top*100)+"%";
      pr.append(a,b); c.append(pr); const t=el("div","tot",String(d.o+d.i)); t.style.bottom=(Math.max(d.o,d.i)/top*100)+"%"; t.style.transform="translateY(-4px)"; c.append(t);
      hover(c,`${d.y}: ${d.o} salientes, ${d.i} entrantes`); C.append(c); X.append(el("span",null,String(d.y)));});
  })();

  // Barras (con división salientes/entrantes)
  function barras(id,data,onPick,split){
    const B=$(id); const top=Math.max(1,...data.map(d=>d.t));
    data.forEach(d=>{const row=el("div","hb"); row.append(el("span","name",d.k)); const tr=el("div","track");
      if(split){ if(d.out){const a=el("span","seg1"+(d.in?" join":"")); a.style.width=(d.out/top*100)+"%"; tr.append(a);} if(d.in){const b=el("span","seg2"); b.style.width=(d.in/top*100)+"%"; tr.append(b);} }
      else { const a=el("span","seg1"); a.style.width=(d.t/top*100)+"%"; a.style.background="var(--accent)"; tr.append(a); }
      row.append(tr,el("span","val",String(d.t))); hover(row,`${d.k}: ${d.t}`+(split?` (${d.out} salientes, ${d.in} entrantes)`:""));
      if(onPick){ row.tabIndex=0; row.setAttribute("role","button"); row.addEventListener("click",()=>onPick(d.k)); row.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault(); onPick(d.k);} }); }
      B.append(row);});
  }
  const go=()=>{ draw(); $("mvBody").closest(".card").scrollIntoView({behavior:"smooth",block:"start"}); };
  barras("mvPais",byKey(ALL,"pais"),k=>{F.pais=k; sync(); go();},true);
  barras("mvPerfil",byKey(ALL,"perfil"),k=>{F.perfil=k; sync(); go();},true);
  barras("mvRazon",byKey(ALL,"razon"),k=>{F.q=k; sync(); go();},false);

  // Tabla y filtros
  const F={q:"",sentido:"",perfil:"",pais:"",anio:""};
  const opts=(id,vals)=>vals.forEach(v=>$(id).add(new Option(v,v)));
  opts("mvPerf",[...new Set(ALL.map(r=>r.perfil))].sort((a,b)=>a.localeCompare(b,"es")));
  opts("mvPaisSel",[...new Set(ALL.map(r=>r.pais))].sort((a,b)=>a.localeCompare(b,"es")));
  opts("mvAnio",anios.slice().reverse().map(String));
  function sync(){ $("mvQ").value=F.q; $("mvSent").value=F.sentido; $("mvPerf").value=F.perfil; $("mvPaisSel").value=F.pais; $("mvAnio").value=F.anio; }
  function filtered(){ const q=norm(F.q); return ALL.filter(r=>(!F.sentido||r.sentido===F.sentido)&&(!F.perfil||r.perfil===F.perfil)&&(!F.pais||r.pais===F.pais)&&(!F.anio||String(r.anio)===F.anio)&&(!q||norm([r.pais,r.ciudad,r.institucion,r.razon,r.organismo,r.facultad,r.resolucion,r.nota].join(" ")).includes(q))); }
  function draw(){
    const rows=filtered().sort((a,b)=>b.fecha.localeCompare(a.fecha)||a.id.localeCompare(b.id)); const T=$("mvBody"); T.textContent="";
    $("mvCount").textContent=`${rows.length} de ${ALL.length} movilidades`;
    rows.forEach(r=>{const tr=el("tr");
      tr.append(el("td","mono",fecha(r.fecha)));
      const s=el("td"); s.append(el("span","pill "+(r.sentido==="SALIENTE"?"out":"in"),r.sentido==="SALIENTE"?"Saliente":"Entrante")); tr.append(s);
      tr.append(el("td",null,r.perfil), el("td",null,r.facultad), el("td",null,r.pais+(r.ciudad?` · ${r.ciudad}`:"")));
      const i=el("td"); i.append(el("span",null,r.institucion)); if(r.nota) i.append(el("div","sub",r.nota)); tr.append(i);
      tr.append(el("td",null,r.razon), el("td",null,r.organismo), el("td","mono",r.resolucion||"Registro RI")); T.append(tr);});
    if(!rows.length){ const tr=el("tr"); const td=el("td",null,"Ninguna movilidad coincide con estos filtros."); td.colSpan=9; tr.append(td); T.append(tr); }
  }
  $("mvQ").addEventListener("input",e=>{F.q=e.target.value; draw();});
  [["mvSent","sentido"],["mvPerf","perfil"],["mvPaisSel","pais"],["mvAnio","anio"]].forEach(([id,k])=>$(id).addEventListener("change",e=>{F[k]=e.target.value; draw();}));
  $("mvReset").addEventListener("click",()=>{ Object.keys(F).forEach(k=>F[k]=""); sync(); draw(); });
  $("mvCsv").addEventListener("click",()=>{
    const cols=["resolucion","fuente","fecha","sentido","perfil","facultad","pais","ciudad","institucion","razon","organismo","duracion","sexo","nota"];
    const q=v=>`"${String(v??"").replace(/"/g,'""')}"`;
    const csv="﻿"+[cols.join(","),...filtered().map(r=>cols.map(c=>q(r[c])).join(","))].join("\r\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download="movilidades-consejo-uasd.csv"; document.body.append(a); a.click(); a.remove();
  });
  draw();
  if(location.hash==="#movilidad") $("tab-mov").click();
})();
