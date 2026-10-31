/* La UASD en cifras: dibuja la sección a partir de data/uasd-cifras.js */
(function(){
  "use strict";
  const C=window.UASD_CIFRAS; if(!C) return;
  const $=id=>document.getElementById(id);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
  const nf=n=>Number(n).toLocaleString("es-DO");
  const pc=(a,b,d)=>(a*100/b).toLocaleString("es-DO",{minimumFractionDigits:d,maximumFractionDigits:d})+" %";
  const tip=$("tip");
  function hover(node,text){ if(!tip) return;
    node.addEventListener("pointermove",e=>{tip.textContent=text; tip.hidden=false; tip.style.left=Math.min(e.clientX+12,innerWidth-270)+"px"; tip.style.top=(e.clientY+14)+"px";});
    node.addEventListener("pointerleave",()=>tip.hidden=true); }

  const M=C.matricula, ult=M[M.length-1], max=M.reduce((a,b)=>b.total>a.total?b:a);
  const X=C.extranjeros, xu=X[X.length-1];
  const D=C.docentes2025.reduce((s,d)=>s+d.n,0), I=C.investigadores2023;
  const nExtInv=I.extranjeros.reduce((s,d)=>s+d.n,0);

  // Lede con el hallazgo principal
  const L=$("cifrasLede");
  if(L) L.textContent=`En ${xu.anio}, solo ${pc(xu.total,ult.total,2)} del estudiantado de grado de la UASD tiene otra nacionalidad (${nf(xu.total)} de ${nf(ult.total)}), frente al ${C.referenciaPaisEntrante.toLocaleString("es-DO")} % de estudiantes internacionales en el conjunto del país según la UNESCO. Casi 9 de cada 10 son de Venezuela o Haití.`;

  // Cifras clave
  const K=$("cifrasKpis");
  [[nf(ult.total),`estudiantes de grado y técnico superior (${ult.anio})`,`${pc(ult.mujeres,ult.total,0)} mujeres`],
   [nf(xu.total),`estudiantes extranjeros (${xu.anio})`,`${xu.paises} nacionalidades · ${pc(xu.total,ult.total,2)} de la matrícula`],
   [nf(D),"docentes (primer semestre 2025)",`${nf(Math.round(ult.total/D))} estudiantes por docente`],
   [nf(I.total),"investigadores registrados (2023)",`${nExtInv} de otros países · ${pc(I.mujeres,I.total,0)} mujeres`]]
  .forEach(([v,l,s])=>{const d=el("div","kpi"); d.append(el("div","v",v),el("div","l",l),el("div","s",s)); K.append(d);});

  // Columnas: una barra por año
  function columnas(boxId,axisId,data,val,label,color,hint){
    const B=$(boxId), A=$(axisId); const top=Math.max(...data.map(val));
    data.forEach(d=>{const c=el("div","col"); const pr=el("div","pair"); const b=el("div","b"); b.style.height=(val(d)/top*100)+"%"; b.style.background=color; b.style.width="min(28px,60%)";
      pr.append(b); c.append(pr); const t=el("div","tot",label(d)); t.style.bottom=(val(d)/top*100)+"%"; t.style.transform="translateY(-4px)"; c.append(t);
      hover(c,hint(d)); B.append(c); A.append(el("span",null,String(d.anio)));});
  }
  const miles=n=>(n/1000).toLocaleString("es-DO",{maximumFractionDigits:0})+" mil";
  columnas("cMat","cMatX",M,d=>d.total,d=>miles(d.total),"var(--accent)",
    d=>`${d.anio}: ${nf(d.total)} estudiantes (${nf(d.mujeres)} mujeres, ${nf(d.hombres)} hombres)`);
  const nota=$("cMatNota");
  if(nota) nota.textContent=`La matrícula alcanzó su máximo en ${max.anio} (${nf(max.total)}) y en ${ult.anio} fue ${pc(max.total-ult.total,max.total,0)} menor. La proporción de mujeres pasó de ${pc(M[0].mujeres,M[0].total,0)} a ${pc(ult.mujeres,ult.total,0)}.`;

  columnas("cExt","cExtX",X,d=>d.total,d=>nf(d.total),"var(--s-in)",
    d=>`${d.anio}: ${d.total} estudiantes extranjeros (${d.venezuela} de Venezuela, ${d.haiti} de Haití, ${d.total-d.venezuela-d.haiti} de otros ${d.paises-2} países)`);

  // Barras horizontales
  function barras(boxId,rows,parts){
    const B=$(boxId); const tot=r=>parts.reduce((s,p)=>s+r[p.key],0); const top=Math.max(...rows.map(tot));
    rows.forEach(r=>{const row=el("div","hb"); row.append(el("span","name",r.k)); const tr=el("div","track");
      parts.forEach((p,i)=>{ if(!r[p.key]) return; const s=el("span","seg1"+(i<parts.length-1?" join":"")); s.style.width=(r[p.key]/top*100)+"%"; s.style.background=p.color; tr.append(s); });
      row.append(tr, el("span","val",nf(tot(r))));
      hover(row, `${r.k}: ${nf(tot(r))}`+(parts.length>1?" ("+parts.map(p=>`${nf(r[p.key])} ${p.name}`).join(", ")+")":""));
      B.append(row);});
  }
  const top6=C.nacionalidades2025.slice(0,6), resto=C.nacionalidades2025.slice(6);
  barras("cNac",[...top6,{k:`Otras ${resto.length} nacionalidades`,n:resto.reduce((s,d)=>s+d.n,0)}],[{key:"n",color:"var(--s-in)"}]);
  barras("cFac",C.facultades2025,[{key:"mujeres",name:"mujeres",color:"var(--t-cian)"},{key:"hombres",name:"hombres",color:"var(--hilo-amarillo)"}]);
  barras("cDoc",C.docentes2025,[{key:"n",color:"var(--accent)"}]);

  const F=$("cifrasFuente");
  if(F){ const a=el("a",null,C.fuente.nombre); a.href=C.fuente.enlace; a.target="_blank"; a.rel="noopener noreferrer"; F.append("Fuente: ",a,". Matrícula de grado y técnico superior; no incluye postgrado. Referencia nacional: UNESCO UIS."); }
})();
