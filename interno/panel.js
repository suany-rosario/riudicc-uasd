/* Panel de Relaciones Internacionales: convenios del Consejo Universitario */
(function(){
  "use strict";
  const ALL=window.CONVENIOS||[];
  const $=id=>document.getElementById(id);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
  const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const fecha=s=>{ if(!/^\d{4}-\d{2}-\d{2}$/.test(s||"")) return s||""; const [y,m,d]=s.split("-").map(Number); return `${d} ${MESES[m-1]} ${y}`; };
  const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const tip=$("tip");
  function hover(node,text){ node.addEventListener("pointermove",e=>{tip.textContent=text; tip.hidden=false; tip.style.left=Math.min(e.clientX+12,innerWidth-270)+"px"; tip.style.top=(e.clientY+14)+"px";}); node.addEventListener("pointerleave",()=>tip.hidden=true); }
  const count=(rows,key)=>{const m=new Map(); rows.forEach(r=>m.set(r[key],(m.get(r[key])||0)+1)); return [...m].map(([k,n])=>({k,n})).sort((a,b)=>b.n-a.n||String(a.k).localeCompare(String(b.k),"es"));};

  // Pestañas
  const tabs=[["tab-conv","p-conv"],["tab-mov","p-mov"],["tab-proy","p-proy"]];
  tabs.forEach(([t,p])=>$(t).addEventListener("click",()=>tabs.forEach(([t2,p2])=>{ $(t2).setAttribute("aria-selected",String(t2===t)); $(p2).hidden=(t2!==t); })));

  // Resumen
  const intl=ALL.filter(r=>r.ambito==="Internacional"), paises=new Set(intl.map(r=>r.pais).filter(p=>p!=="Organismo internacional"&&p!=="Unión Europea"));
  const anios=[...new Set(ALL.map(r=>r.anio))].sort();
  $("intLede").textContent=`El Consejo Universitario aprobó ${ALL.length} convenios entre ${anios[0]} y ${anios[anios.length-1]}: ${intl.length} con instituciones de ${paises.size} países y organismos internacionales, y ${ALL.filter(r=>r.ambito==="Nacional").length} con instituciones dominicanas.`;
  const ult3=ALL.filter(r=>r.anio>=anios[anios.length-1]-2).length;
  [[String(ALL.length),"convenios aprobados",`${anios[0]}–${anios[anios.length-1]}`],
   [String(intl.length),"internacionales",`${paises.size} países + organismos`],
   [String(ALL.filter(r=>r.tipo==="Convenio marco").length),"convenios marco",`${ALL.filter(r=>r.tipo==="Acuerdo específico").length} acuerdos específicos`],
   [String(ult3),`en los últimos 3 años`,`${anios[anios.length-1]-2}–${anios[anios.length-1]}`]]
  .forEach(([v,l,s])=>{const d=el("div","kpi"); d.append(el("div","v",v),el("div","l",l),el("div","s",s)); $("cvKpis").append(d);});

  // Columnas por año (internacional / nacional)
  (function(){
    const C=$("cvAnios"), X=$("cvAniosX"); const data=anios.map(y=>{const rs=ALL.filter(r=>r.anio===y); const i=rs.filter(r=>r.ambito==="Internacional").length; return {y,i,n:rs.length-i};});
    const top=Math.max(...data.map(d=>Math.max(d.i,d.n)));
    data.forEach(d=>{const c=el("div","col"); const pr=el("div","pair"); const a=el("div","b out"); a.style.height=(d.i/top*100)+"%"; const b=el("div","b"); b.style.height=(d.n/top*100)+"%"; b.style.background="var(--hilo-cian)";
      pr.append(a,b); c.append(pr); const t=el("div","tot",String(d.i+d.n)); t.style.bottom=(Math.max(d.i,d.n)/top*100)+"%"; t.style.transform="translateY(-4px)"; c.append(t);
      hover(c,`${d.y}: ${d.i+d.n} convenios (${d.i} internacionales, ${d.n} nacionales u otros)`); C.append(c); X.append(el("span",null,String(d.y)));});
  })();

  // Barras horizontales (clic = filtrar)
  function barras(id,data,color,onPick){
    const B=$(id); const top=Math.max(1,...data.map(d=>d.n));
    data.forEach(d=>{const row=el("div","hb"); row.append(el("span","name",d.k)); const tr=el("div","track"); const s=el("span","seg1"); s.style.width=(d.n/top*100)+"%"; s.style.background=color; tr.append(s);
      row.append(tr,el("span","val",String(d.n))); hover(row,`${d.k}: ${d.n}`); if(onPick){ row.tabIndex=0; row.setAttribute("role","button"); row.addEventListener("click",()=>onPick(d.k)); row.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); onPick(d.k);} }); }
      B.append(row);});
  }
  const pickPais=p=>{ F.ambito=""; F.pais=p; sync(); draw(); $("cvBody").closest(".card").scrollIntoView({behavior:"smooth",block:"start"}); };
  const pais=count(intl,"pais");
  barras("cvPais",pais,"var(--s-out)",pickPais);
  barras("cvTipo",count(ALL,"tipo"),"var(--accent)",k=>{ F.tipo=k; sync(); draw(); });
  const top=count(ALL.filter(r=>!/sigla en el acta|ilegible|verificar/.test(r.contraparte)),"contraparte").filter(d=>d.n>=2);
  barras("cvTop",top,"var(--hilo-cian)",k=>{ F.q=k; sync(); draw(); });

  // Tabla con filtros
  const F={q:"",ambito:"",pais:"",tipo:"",anio:""};
  const opts=(id,vals)=>vals.forEach(v=>$(id).add(new Option(v,v)));
  opts("fPais",[...new Set(ALL.map(r=>r.pais))].sort((a,b)=>a.localeCompare(b,"es")));
  opts("fTipo",[...new Set(ALL.map(r=>r.tipo))].sort((a,b)=>a.localeCompare(b,"es")));
  opts("fAnio",anios.slice().reverse().map(String));
  function sync(){ $("fQ").value=F.q; $("fAmb").value=F.ambito; $("fPais").value=F.pais; $("fTipo").value=F.tipo; $("fAnio").value=F.anio; }
  function filtered(){ const q=norm(F.q); return ALL.filter(r=>(!F.ambito||r.ambito===F.ambito)&&(!F.pais||r.pais===F.pais)&&(!F.tipo||r.tipo===F.tipo)&&(!F.anio||String(r.anio)===F.anio)&&(!q||norm([r.contraparte,r.pais,r.resolucion,r.tipo].join(" ")).includes(q))); }
  let lim=40;
  function draw(){
    const rows=filtered(); const T=$("cvBody"); T.textContent="";
    $("cvCount").textContent=`${rows.length} de ${ALL.length} convenios`;
    rows.slice(0,lim).forEach(r=>{ const tr=el("tr");
      tr.append(el("td","mono",r.resolucion), el("td","mono",fecha(r.fecha)));
      const n=el("td"); n.append(el("span",null,r.contraparte)); if(/sigla en el acta|ilegible|verificar/.test(r.contraparte)) n.append(el("div","verif","Cotejar con el acta"+(r.pag?` (p. ${r.pag})`:"")));
      const p=el("td"); p.append(el("span","chipi"+(r.ambito==="Internacional"?" int":r.ambito==="Por identificar"?" pend":""),r.pais));
      tr.append(n,p,el("td",null,r.tipo),el("td",null,r.decision||"")); T.append(tr); });
    if(!rows.length){ const tr=el("tr"); const td=el("td",null,"Ningún convenio coincide con estos filtros."); td.colSpan=6; tr.append(td); T.append(tr); }
    $("cvMore").hidden=rows.length<=lim;
  }
  $("fQ").addEventListener("input",e=>{F.q=e.target.value; lim=40; draw();});
  [["fAmb","ambito"],["fPais","pais"],["fTipo","tipo"],["fAnio","anio"]].forEach(([id,k])=>$(id).addEventListener("change",e=>{F[k]=e.target.value; lim=40; draw();}));
  $("fReset").addEventListener("click",()=>{ Object.keys(F).forEach(k=>F[k]=""); lim=40; sync(); draw(); });
  $("cvMore").addEventListener("click",()=>{ lim+=60; draw(); });
  $("fCsv").addEventListener("click",()=>{
    const cols=["resolucion","fecha","contraparte","pais","ambito","tipo","decision","sesion","pag"];
    const q=v=>`"${String(v??"").replace(/"/g,'""')}"`;
    const csv="﻿"+[cols.join(","),...filtered().map(r=>cols.map(c=>q(r[c])).join(","))].join("\r\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download="convenios-uasd.csv"; document.body.append(a); a.click(); a.remove();
  });
  draw();
})();
