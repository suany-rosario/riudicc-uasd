/* Tablón de movilidad RIUDICC: lee las ofertas aprobadas de la hoja de Google (SITIO.tablonEndpoint)
   y envía las propuestas nuevas para revisión. Sin endpoint, usa data/ofertas.js y el formulario queda en vista previa. */
(function(){
  "use strict";
  const S=window.SITIO||{}, EP=(S.tablonEndpoint||"").trim();
  const $=id=>document.getElementById(id);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
  const TIPOS=["Beca","Intercambio semestral","Curso corto","Estancia de investigación","Profesor visitante","COIL / movilidad virtual","Pasantía"];
  const NIVELES=["Grado","Postgrado","Docentes","Investigadores","Personal administrativo","Todos"];
  const MODALIDADES=["Presencial","Virtual","Híbrida"];
  const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const hoy=new Date(); const hoyISO=`${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`;
  const fecha=s=>{ if(!/^\d{4}-\d{2}-\d{2}$/.test(s||"")) return ""; const [y,m,d]=s.split("-").map(Number); return `${d} ${MESES[m-1]} ${y}`; };
  const dias=s=>Math.round((Date.parse(s+"T12:00:00")-Date.parse(hoyISO+"T12:00:00"))/864e5);
  const store={get(k){try{return JSON.parse(localStorage.getItem(k)||"null");}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
  document.querySelectorAll("[data-correo]").forEach(n=>{ if(!S.correo) return; n.textContent=S.correo; if(n.tagName==="A") n.href="mailto:"+S.correo; });

  let ofertas=(window.OFERTAS||[]).slice(), fuente="copia";
  TIPOS.forEach(t=>$("tTipo").add(new Option(t,t)));
  NIVELES.forEach(t=>$("tNivel").add(new Option(t,t)));

  /* ---------- Lista ---------- */
  function render(){
    const q=$("tBuscar").value.trim().toLowerCase(), tipo=$("tTipo").value, nivel=$("tNivel").value, origen=$("tOrigen").value, inc=$("tInc").checked, venc=$("tVenc").checked;
    const lista=ofertas.filter(o=>{
      const vencida=o.fecha_limite && o.fecha_limite<hoyISO;
      if(vencida && !venc) return false;
      if(tipo && o.tipo!==tipo) return false;
      if(nivel && o.nivel!==nivel && o.nivel!=="Todos") return false;
      if(origen && (o.tipo_registro||"oferta")!==origen) return false;
      if(inc && !o.apoyos_inclusion) return false;
      if(q){ const h=[o.titulo,o.entidad,o.pais,o.area,o.tipo,o.descripcion].join(" ").toLowerCase(); if(!h.includes(q)) return false; }
      return true;
    }).sort((a,b)=>(a.fecha_limite||"9999")<(b.fecha_limite||"9999")?-1:1);
    const L=$("tLista"); L.textContent="";
    const ocultas=ofertas.filter(o=>o.fecha_limite && o.fecha_limite<hoyISO).length;
    $("tCuenta").textContent=`${lista.length} ${lista.length===1?"oferta":"ofertas"}`+(!venc&&ocultas?` · ${ocultas} vencida${ocultas>1?"s":""} oculta${ocultas>1?"s":""}`:"");
    if(!lista.length){ const v=el("div","t-vacio"); v.append(el("p",null,"No hay ofertas con estos filtros."), el("p",null,"¿Su universidad tiene una? Propóngala abajo.")); L.append(v); return; }
    lista.forEach(o=>L.append(tarjeta(o)));
  }
  function tarjeta(o){
    const c=el("article","t-card"); const vencida=o.fecha_limite && o.fecha_limite<hoyISO;
    if(vencida) c.classList.add("vencida");
    const top=el("div","t-top");
    top.append(el("span","t-tipo",o.tipo||"Oferta"));
    top.append(el("span","t-src "+((o.tipo_registro||"oferta")==="convocatoria"?"ext":"red"),(o.tipo_registro||"oferta")==="convocatoria"?"Convocatoria externa":"Oferta de la red"));
    if(o.apoyos_inclusion) top.append(el("span","t-inc","Apoyos de inclusión"));
    const plazo=el("div","t-plazo");
    if(o.fecha_limite){ const d=dias(o.fecha_limite); plazo.append(el("b",null,fecha(o.fecha_limite))); plazo.append(el("span",null, vencida?"Cerrada":(d===0?"Cierra hoy":(d===1?"Cierra mañana":`Cierra en ${d} días`)))); if(!vencida&&d<=7) plazo.classList.add("pronto"); }
    else plazo.append(el("span",null,"Plazo variable"));
    const h=el("h3",null,o.titulo);
    const meta=el("p","t-meta",[o.entidad,o.pais,o.nivel,o.modalidad].filter(Boolean).join(" · "));
    c.append(top,plazo,h,meta);
    if(o.cubre){ const p=el("p","t-cubre"); p.append(el("b",null,"Cubre: "),o.cubre); c.append(p); }
    if(o.descripcion){ const d=el("details","t-desc"); d.append(el("summary",null,"Requisitos y detalles"), el("p",null,o.descripcion)); if(o.area) d.append(el("p","t-meta","Área: "+o.area)); if(o.contacto) d.append(el("p","t-meta","Contacto: "+o.contacto)); c.append(d); }
    const acts=el("div","t-acts2");
    if(/^https?:\/\//.test(o.enlace||"")){ const a=el("a","btn primary","Ver convocatoria oficial ↗"); a.href=o.enlace; a.target="_blank"; a.rel="noopener noreferrer"; acts.append(a); }
    const yaK="riudicc-interes-"+o.id, ya=!!store.get(yaK);
    const b=el("button","btn",ya?"Interés registrado":"Me interesa"); b.type="button"; b.disabled=ya||vencida;
    b.addEventListener("click",()=>{ store.set(yaK,1); b.textContent="Interés registrado"; b.disabled=true; if(EP) fetch(EP,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({accion:"interes",id:o.id})}).catch(()=>{}); });
    acts.append(b);
    if(o.interesados) acts.append(el("span","t-meta",`${o.interesados} ${o.interesados===1?"persona interesada":"personas interesadas"}`));
    c.append(acts);
    return c;
  }
  ["tBuscar","tTipo","tNivel","tOrigen","tInc","tVenc"].forEach(id=>$(id).addEventListener(id==="tBuscar"?"input":"change",render));

  function estado(){
    const E=$("tEstado");
    E.textContent = fuente==="hoja" ? "Ofertas al día desde la hoja del tablón." : (EP ? "No se pudo leer la hoja; se muestra la última copia guardada." : "Ofertas revisadas por el micro-observatorio UASD.");
  }
  render(); estado();
  if(EP){
    fetch(EP,{method:"GET"}).then(r=>r.json()).then(d=>{ if(d&&d.ok&&Array.isArray(d.ofertas)){ ofertas=d.ofertas; fuente="hoja"; render(); } estado(); }).catch(()=>estado());
  }

  /* ---------- Proponer ---------- */
  if(!EP) $("tPreview").hidden=false;
  const opt=(box,name,type,v)=>{const l=el("label","opt"); const i=document.createElement("input"); i.type=type; i.name=name; i.value=v; l.append(i, el("span",null,v)); $(box).append(l);};
  TIPOS.forEach(t=>opt("pTipo","ptipo","radio",t)); NIVELES.forEach(t=>opt("pNivel","pnivel","radio",t)); MODALIDADES.forEach(t=>opt("pModalidad","pmod","radio",t));
  const radio=n=>{const i=document.querySelector(`input[name="${n}"]:checked`); return i?i.value:"";};
  const v=id=>$(id).value.trim();
  function marca(k,msg){ const q=document.querySelector(`#tForm .q[data-req="${k}"]`); q.classList.toggle("mal",!!msg); q.querySelector(".err").textContent=msg||""; return !msg; }
  $("tForm").addEventListener("input",e=>{const q=e.target.closest(".q.mal"); if(q){q.classList.remove("mal"); q.querySelector(".err").textContent="";}});
  $("tForm").addEventListener("change",e=>{const q=e.target.closest(".q.mal"); if(q){q.classList.remove("mal"); q.querySelector(".err").textContent="";}});
  let enviando=false;
  $("tForm").addEventListener("submit",async e=>{
    e.preventDefault(); if(enviando) return;
    let ok=true;
    ok=marca("titulo",v("pTitulo")?"":"Escriba el título de la oferta.")&&ok;
    ok=marca("entidad",v("pEntidad")?"":"Indique la universidad o entidad.")&&ok;
    ok=marca("tipo",radio("ptipo")?"":"Elija el tipo de oferta.")&&ok;
    ok=marca("fecha",v("pFecha")&&v("pFecha")<hoyISO?"La fecha límite ya pasó.":"")&&ok;
    ok=marca("enlace",v("pEnlace")&&!/^https?:\/\/\S+\.\S+/.test(v("pEnlace"))?"El enlace debe empezar por https://":"")&&ok;
    if(!ok){ const m=document.querySelector("#tForm .q.mal"); m.scrollIntoView({block:"center"}); const f=m.querySelector("input,textarea"); if(f) f.focus({preventScroll:true}); return; }
    const d={titulo:v("pTitulo"),entidad:v("pEntidad"),tipo:radio("ptipo"),pais:v("pPais"),area:v("pArea"),nivel:radio("pnivel"),modalidad:radio("pmod"),
      fecha_limite:v("pFecha"),plazas:v("pPlazas").replace(/\D/g,""),cubre:v("pCubre"),descripcion:v("pDesc"),enlace:v("pEnlace"),contacto:v("pContacto"),
      apoyos_inclusion:$("pInc").checked,sitio_web:$("pWeb").value};
    const btn=$("pEnviar"), msg=$("pMsg"); enviando=true; btn.disabled=true; btn.textContent="Enviando…"; msg.textContent="";
    try{
      if(EP) await fetch(EP,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});
      $("tForm").reset();
      msg.textContent = EP ? "Recibida. Se publicará cuando el micro-observatorio la revise." : "Vista previa: la propuesta no se guardó porque el tablón aún no está conectado.";
      msg.className="t-msg ok";
    }catch(err){ msg.textContent="No se pudo enviar. Revise su conexión e inténtelo de nuevo."; msg.className="t-msg mal"; }
    finally{ enviando=false; btn.disabled=false; btn.textContent="Enviar para revisión"; }
  });
})();
