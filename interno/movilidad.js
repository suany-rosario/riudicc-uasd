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

  const go=()=>{ draw(); $("mvBody").closest(".card").scrollIntoView({behavior:"smooth",block:"start"}); };

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
      tr.append(el("td","mono",r.solo_anio?String(r.anio):fecha(r.fecha)));
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
