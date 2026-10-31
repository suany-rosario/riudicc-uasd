/* Panel RI · pestaña "Proyectos internacionales" */
(function(){
  "use strict";
  const ALL=(window.PROYECTOS||[]).slice(); if(!ALL.length) return;
  const $=id=>document.getElementById(id);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
  const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const YEAR=new Date().getFullYear();
  const estado=p=>p.propuesta?"Propuesta":(p.fin&&p.fin<YEAR?"Finalizado":"En ejecución");
  ALL.forEach(p=>p.estado=estado(p));
  const count=(rows,f)=>{const m=new Map(); rows.forEach(r=>{const k=f(r); m.set(k,(m.get(k)||0)+1);}); return [...m].map(([k,n])=>({k,n})).sort((a,b)=>b.n-a.n||String(a.k).localeCompare(String(b.k),"es"));};

  // Cifras clave
  const ue=ALL.filter(p=>/Unión Europea/.test(p.financiador)).length;
  const ej=ALL.filter(p=>p.estado==="En ejecución").length;
  const coord=ALL.filter(p=>p.rol==="Coordinador").length;
  [[String(ALL.length),"proyectos y acuerdos",`${ALL.filter(p=>p.estado==="Propuesta").length} en fase de propuesta`],
   [String(ej),"en ejecución",`${ALL.filter(p=>p.estado==="Finalizado").length} finalizados`],
   [String(ue),"con fondos de la Unión Europea",`${ALL.filter(p=>/Erasmus/.test(p.programa)).length} del programa Erasmus+`],
   [String(coord),"coordinados por la UASD",`en ${ALL.length-coord} participa como socia`]]
  .forEach(([v,l,s])=>{const d=el("div","kpi"); d.append(el("div","v",v),el("div","l",l),el("div","s",s)); $("pyKpis").append(d);});

  // Barras
  function barras(id,data,color,onPick){
    const B=$(id); const top=Math.max(1,...data.map(d=>d.n));
    data.forEach(d=>{const row=el("div","hb"); row.append(el("span","name",d.k)); const tr=el("div","track"); const s=el("span","seg1"); s.style.width=(d.n/top*100)+"%"; s.style.background=color; tr.append(s);
      row.append(tr,el("span","val",String(d.n))); row.tabIndex=0; row.setAttribute("role","button");
      row.addEventListener("click",()=>onPick(d.k)); row.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault(); onPick(d.k);} }); B.append(row);});
  }
  const unidadFac=p=>(p.unidad.split(" · ")[1]||p.unidad);
  barras("pyFin",count(ALL,p=>p.ambito),"var(--s-out)",k=>{F.q=k; sync(); draw();});
  barras("pyFac",count(ALL,unidadFac),"var(--hilo-cian)",k=>{F.q=k; sync(); draw();});

  // Lista con filtros
  const F={q:"",tipo:"",estado:""};
  [...new Set(ALL.map(p=>p.tipo))].sort((a,b)=>a.localeCompare(b,"es")).forEach(v=>$("pyTipo").add(new Option(v,v)));
  function sync(){ $("pyQ").value=F.q; $("pyTipo").value=F.tipo; $("pyEstado").value=F.estado; }
  function filtered(){ const q=norm(F.q); return ALL.filter(p=>(!F.tipo||p.tipo===F.tipo)&&(!F.estado||p.estado===F.estado)&&(!q||norm([p.titulo,p.programa,p.financiador,p.ambito,p.unidad,p.socios,p.resolucion].join(" ")).includes(q))); }
  const ORD={"En ejecución":0,"Propuesta":1,"Finalizado":2};
  function draw(){
    const rows=filtered().sort((a,b)=>ORD[a.estado]-ORD[b.estado]||b.inicio-a.inicio);
    const L=$("pyList"); L.textContent=""; $("pyCount").textContent=`${rows.length} de ${ALL.length} proyectos`;
    if(!rows.length){ L.append(el("p","sub","Ningún proyecto coincide con estos filtros.")); return; }
    rows.forEach(p=>{const c=el("article","proy");
      const top=el("div","proy-top"); top.append(el("span","tag",p.tipo), el("span","proy-est "+(p.estado==="En ejecución"?"on":p.estado==="Propuesta"?"pro":"off"),p.estado), el("span","proy-rol",p.rol==="Coordinador"?"UASD coordina":"UASD participa"));
      const h=el("h3",null,p.titulo);
      const dl=el("dl");
      [["Programa",p.programa],["Financia",p.financiador],["Unidad UASD",p.unidad],["Socios",p.socios],["Periodo",p.inicio+(p.fin?`–${p.fin}`:" →")],["Presupuesto",p.presupuesto],["Res. CU",p.resolucion],["Nota",p.nota]]
        .forEach(([k,v])=>{ if(!v) return; dl.append(el("dt",null,k),el("dd",null,v)); });
      c.append(top,h,dl);
      if(p.enlace){ const a=el("a","more","Sitio del proyecto ↗"); a.href=p.enlace; a.target="_blank"; a.rel="noopener noreferrer"; c.append(a); }
      L.append(c);});
  }
  $("pyQ").addEventListener("input",e=>{F.q=e.target.value; draw();});
  $("pyTipo").addEventListener("change",e=>{F.tipo=e.target.value; draw();});
  $("pyEstado").addEventListener("change",e=>{F.estado=e.target.value; draw();});
  $("pyReset").addEventListener("click",()=>{F.q=F.tipo=F.estado=""; sync(); draw();});
  draw();
  if(location.hash==="#proyectos") $("tab-proy").click();
})();
