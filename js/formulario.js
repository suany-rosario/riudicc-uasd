/* Formulario de registro de movilidad · RIUDICC–UASD
   Envía las respuestas al Apps Script indicado en SITIO.formularioEndpoint (data/contenido.js).
   Si no hay endpoint, funciona en modo vista previa y no guarda nada. */
(function(){
  "use strict";
  const O=window.OPCIONES, S=window.SITIO||{};
  const ENDPOINT=(S.formularioEndpoint||"").trim();
  const $=id=>document.getElementById(id);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
  const BORRADOR="riudicc-registro-movilidad-borrador";
  const MAX_MOVS=5;
  const hoy=new Date(), mesActual=`${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}`;
  const store={get(){try{return JSON.parse(localStorage.getItem(BORRADOR)||"null");}catch(e){return null;}},
               set(v){try{localStorage.setItem(BORRADOR,JSON.stringify(v));}catch(e){}},
               del(){try{localStorage.removeItem(BORRADOR);}catch(e){}}};

  document.querySelectorAll("[data-correo]").forEach(n=>{n.textContent=S.correo||"";});
  if(!ENDPOINT) $("preview").hidden=false;

  /* ---------- Opciones ---------- */
  function opt(name,type,value,text,extra){
    const l=el("label","opt"); const i=document.createElement("input");
    i.type=type; i.name=name; i.value=value; if(extra) Object.assign(i.dataset,extra);
    l.append(i, el("span",null,text)); return l;
  }
  O.perfiles.forEach(p=>$("o-perfil").append(opt("perfil","radio",p,p)));
  O.facultades.forEach(f=>{const o=opt("facultad","radio",f.n,f.n,{area:f.area}); o.style.setProperty("--fc",f.c); $("o-facultad").append(o);});
  O.edades.forEach(e=>$("o-edad").append(opt("edad","radio",e,e)));
  const rs=$("recinto"); rs.append(new Option("Elige tu recinto…",""));
  O.recintos.forEach(r=>rs.append(new Option(r.replace(/^UASD[-–]\s*/,""),r)));
  const dl=$("paises"); O.paises.forEach(p=>{const o=document.createElement("option"); o.value=p; dl.append(o);});
  const PAISES=new Set(O.paises.map(p=>p.toLowerCase()));
  const dif=$("o-dif");
  O.dificultades.filas.forEach((fila,i)=>{
    const r=el("div","dif"); const lab=el("span","dl",fila); lab.id="dif-l-"+i;
    const g=el("div","opts"); g.setAttribute("role","radiogroup"); g.setAttribute("aria-labelledby",lab.id);
    O.dificultades.columnas.forEach(c=>g.append(opt("dif_"+i,"radio",c,c)));
    r.append(lab,g); dif.append(r);
  });

  /* ---------- Movilidades ---------- */
  let movSeq=0;
  const movs=$("movs"), tpl=$("tplMov");
  function addMov(datos){
    if(movs.children.length>=MAX_MOVS) return null;
    const k=++movSeq; const node=tpl.content.firstElementChild.cloneNode(true);
    node.dataset.k=k;
    const fill=(key,list,type)=>{const box=node.querySelector(`[data-o="${key}"]`); list.forEach(it=>{const v=typeof it==="string"?it:it.m; const t=typeof it==="string"?it:it.t; box.append(opt(`${key}_${k}`,type,v,t));});};
    fill("razon",O.razones,"radio");
    fill("dimension",[{t:"Internacional",m:"INTERNACIONAL"},{t:"Nacional (en la R. D.)",m:"NACIONAL"}],"radio");
    fill("modalidad",O.modalidades,"radio");
    fill("duracion",O.duraciones,"radio");
    fill("apoyo",O.apoyos,"checkbox");
    fill("obstaculos",O.obstaculos,"checkbox");
    fill("resultados",O.resultados,"checkbox");
    node.querySelectorAll("[data-f]").forEach(i=>{i.id=`${i.dataset.f}_${k}`;});
    node.querySelectorAll("[data-for]").forEach(l=>{l.htmlFor=`${l.dataset.for}_${k}`;});
    node.querySelectorAll('[role="radiogroup"]').forEach((g,j)=>{const ql=g.parentElement.querySelector(".ql"); if(ql){ql.id=`m${k}-q${j}`; g.setAttribute("aria-labelledby",ql.id);}});
    node.querySelector('[data-f="inicio"]').max=mesActual;
    node.querySelector(".quitar").addEventListener("click",()=>{node.remove(); renum(); guardar();});
    node.addEventListener("change",e=>{ if(e.target.name===`dimension_${k}`) dimension(node,k); });
    movs.append(node);
    if(datos) setMov(node,k,datos);
    renum(); return node;
  }
  function dimension(node,k){
    const v=(node.querySelector(`input[name="dimension_${k}"]:checked`)||{}).value;
    const p=node.querySelector('[data-f="pais"]');
    if(v==="NACIONAL"){ p.value="República Dominicana"; p.readOnly=true; marca(p.closest(".q"),""); }
    else if(p.readOnly){ p.value=""; p.readOnly=false; }
  }
  function renum(){
    [...movs.children].forEach((m,i)=>{m.querySelector(".mov-t").textContent="Movilidad "+(i+1); m.querySelector(".quitar").hidden=movs.children.length===1;});
    $("addMov").hidden=movs.children.length>=MAX_MOVS;
  }
  $("addMov").addEventListener("click",()=>{const n=addMov(); if(n){ n.querySelector("input").focus({preventScroll:true}); n.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}); }});

  /* ---------- Leer y escribir ---------- */
  const radio=(name,root)=>{const i=(root||document).querySelector(`input[name="${name}"]:checked`); return i?i.value:"";};
  const checks=(name,root)=>[...(root||document).querySelectorAll(`input[name="${name}"]:checked`)].map(i=>i.value);
  const setRadio=(name,v,root)=>{ (root||document).querySelectorAll(`input[name="${name}"]`).forEach(i=>{i.checked=i.value===v;}); };
  const setChecks=(name,vs,root)=>{ (root||document).querySelectorAll(`input[name="${name}"]`).forEach(i=>{i.checked=(vs||[]).includes(i.value);}); };
  function leerMov(m){
    const k=m.dataset.k, f=n=>m.querySelector(`[data-f="${n}"]`).value.trim();
    const razon=radio(`razon_${k}`,m), r=O.razones.find(x=>x.m===razon);
    return {razon, razon_texto:r?r.t:"", dimension:radio(`dimension_${k}`,m), pais:f("pais"), institucion:f("institucion"),
      inicio:f("inicio"), duracion:radio(`duracion_${k}`,m), modalidad:radio(`modalidad_${k}`,m),
      apoyo:checks(`apoyo_${k}`,m), convenio:f("convenio"), obstaculos:checks(`obstaculos_${k}`,m), resultados:checks(`resultados_${k}`,m)};
  }
  function setMov(m,k,d){
    setRadio(`razon_${k}`,d.razon,m); setRadio(`dimension_${k}`,d.dimension,m); setRadio(`duracion_${k}`,d.duracion,m); setRadio(`modalidad_${k}`,d.modalidad,m);
    setChecks(`apoyo_${k}`,d.apoyo,m); setChecks(`obstaculos_${k}`,d.obstaculos,m); setChecks(`resultados_${k}`,d.resultados,m);
    ["pais","institucion","inicio","convenio"].forEach(n=>{m.querySelector(`[data-f="${n}"]`).value=d[n]||"";});
    if(d.dimension==="NACIONAL") m.querySelector('[data-f="pais"]').readOnly=true;
    if((d.obstaculos||[]).length||(d.resultados||[]).length) m.querySelector(".mas").open=true;
  }
  function leer(){
    const fac=document.querySelector('input[name="facultad"]:checked');
    const hizo=radio("hizo");
    const dific={}; O.dificultades.filas.forEach((f,i)=>{const v=radio("dif_"+i); if(v) dific[f]=v;});
    return {v:1, consentimiento:radio("consent"), perfil:radio("perfil"), facultad:radio("facultad"), area:fac?fac.dataset.area:"",
      escuela:$("escuela").value.trim(), recinto:$("recinto").value, sexo:radio("sexo"), edad:radio("edad"), hizo,
      movilidades: hizo==="si"?[...movs.children].map(leerMov):[],
      inclusion:{dificultades:dific, primera_gen:radio("primera_gen")},
      visitantes:$("visitantes").value.trim(), email:$("email").value.trim(), sitio_web:$("sitio_web").value};
  }
  function escribir(d){
    setRadio("consent",d.consentimiento); setRadio("perfil",d.perfil); setRadio("facultad",d.facultad); $("escuela").value=d.escuela||"";
    $("recinto").value=d.recinto||""; setRadio("sexo",d.sexo); setRadio("edad",d.edad); setRadio("hizo",d.hizo);
    (d.movilidades||[]).forEach(m=>addMov(m));
    const di=(d.inclusion||{}).dificultades||{}; O.dificultades.filas.forEach((f,i)=>setRadio("dif_"+i,di[f]));
    setRadio("primera_gen",(d.inclusion||{}).primera_gen); $("visitantes").value=d.visitantes||""; $("email").value=d.email||"";
  }

  /* ---------- Borrador local ---------- */
  let tGuardar=0;
  function guardar(){ clearTimeout(tGuardar); tGuardar=setTimeout(()=>store.set(leer()),500); }
  $("f").addEventListener("input",guardar); $("f").addEventListener("change",guardar);
  const b=store.get(); if(b) escribir(b);
  if(!movs.children.length) addMov();

  /* ---------- Validación ---------- */
  function marca(q,msg){ q.classList.toggle("mal",!!msg); const e=q.querySelector(".err"); if(e) e.textContent=msg||""; return !msg; }
  function valida(paso){
    let ok=true, primero=null;
    const chk=(q,msg)=>{ if(!q) return; const bien=marca(q,msg); if(!bien){ ok=false; primero=primero||q; } };
    const qq=(k,root)=>(root||$("f")).querySelector(`.q[data-req="${k}"]`);
    if(paso===0) chk(qq("consent"), radio("consent")?"":"Elige una opción para continuar.");
    if(paso===1){
      chk(qq("perfil"), radio("perfil")?"":"Elige tu perfil.");
      chk(qq("facultad"), radio("facultad")?"":"Elige tu facultad.");
      chk(qq("recinto"), $("recinto").value?"":"Elige tu recinto, centro o subcentro.");
      chk(qq("hizo"), radio("hizo")?"":"Responde sí o no.");
    }
    if(paso===2){
      [...movs.children].forEach(m=>{
        const d=leerMov(m), q=k=>m.querySelector(`.q[data-req="${k}"]`);
        chk(q("razon"), d.razon?"":"Elige la razón principal.");
        chk(q("dimension"), d.dimension?"":"Indica si fue nacional o internacional.");
        chk(q("pais"), !d.pais?"Escribe el país.":(d.dimension==="INTERNACIONAL" && !PAISES.has(d.pais.toLowerCase())?"Elige el país de la lista para que coincida con la Plantilla del MESCyT.":""));
        chk(q("institucion"), d.institucion?"":"Escribe la institución que te recibió.");
        chk(q("inicio"), !d.inicio?"Indica el mes y el año.":(d.inicio<"2023-01"?"El registro empieza en enero de 2023.":(d.inicio>mesActual?"La fecha no puede ser futura.":"")));
        chk(q("modalidad"), d.modalidad?"":"Elige la modalidad.");
        chk(q("duracion"), d.duracion?"":"Elige la duración.");
        chk(q("apoyo"), d.apoyo.length?"":"Marca al menos una opción. Si no hubo apoyo, marca «Fondos personales».");
      });
    }
    if(paso===4){ const e=$("email").value.trim(); chk(qq("email"), e && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)?"Revisa el correo; parece incompleto.":""); }
    if(primero){ const foco=primero.querySelector("input:not([type=hidden]),select,textarea"); primero.scrollIntoView({block:"center",behavior:"auto"}); if(foco) foco.focus({preventScroll:true}); }
    return ok;
  }
  ["input","change"].forEach(ev=>$("f").addEventListener(ev,e=>{const q=e.target.closest(".q.mal"); if(q) marca(q,"");}));

  /* ---------- Pasos ---------- */
  const fs=[...document.querySelectorAll(".step")], lis=[...document.querySelectorAll("#steps li")];
  let paso=0;
  const ruta=()=>radio("hizo")==="no"?[0,1,4]:[0,1,2,3,4];
  function ir(n,inicial){
    paso=n; fs.forEach((f,i)=>{f.hidden=i!==n;});
    const r=ruta(), pos=r.indexOf(n);
    lis.forEach((li,i)=>{ li.classList.toggle("actual",i===n); li.classList.toggle("hecho",i<n && r.includes(i)); li.style.opacity=r.includes(i)?"":".35"; if(i===n) li.setAttribute("aria-current","step"); else li.removeAttribute("aria-current"); });
    $("barFill").style.width=((pos+1)/r.length*100)+"%";
    $("atras").hidden=n===0;
    $("sig").textContent=n===4?"Enviar registro":"Continuar";
    $("pasoTxt").textContent=`Paso ${pos+1} de ${r.length}`;
    if(n===4) resumen();
    if(inicial) return;
    $("steps").scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
    const leg=fs[n].querySelector(".sh"); if(leg){ leg.tabIndex=-1; leg.focus({preventScroll:true}); }
  }
  function resumen(){
    const d=leer(), R=$("resumen"); R.textContent="";
    if(d.hizo==="no"){ R.append(el("p",null,"Indicaste que no has realizado movilidades desde 2023. Saberlo también ayuda: muestra cuántas personas aún no acceden a la movilidad.")); return; }
    const t=el("p"); t.append("Vas a registrar ", el("b",null,d.movilidades.length===1?"1 movilidad":`${d.movilidades.length} movilidades`), ":"); R.append(t);
    const ul=el("ul"); d.movilidades.forEach(m=>{ ul.append(el("li",null,`${m.razon_texto} · ${m.institucion} (${m.pais}) · ${fechaMes(m.inicio)}`)); }); R.append(ul);
  }
  const MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const fechaMes=s=>{ if(!/^\d{4}-\d{2}$/.test(s||"")) return s||""; const [y,m]=s.split("-").map(Number); return `${MESES[m-1]} de ${y}`; };

  $("sig").addEventListener("click",()=>{
    if(!valida(paso)) return;
    if(paso===0 && radio("consent")==="no"){ $("f").hidden=true; $("steps").hidden=true; document.querySelector(".bar").hidden=true; store.del(); $("noAcepta").hidden=false; $("noAcepta").focus(); return; }
    if(paso===4){ enviar(); return; }
    const r=ruta(); ir(r[r.indexOf(paso)+1]);
  });
  $("atras").addEventListener("click",()=>{ const r=ruta(); const i=r.indexOf(paso); if(i>0) ir(r[i-1]); });

  /* ---------- Envío ---------- */
  let enviando=false;
  async function enviar(){
    if(enviando) return; enviando=true;
    const d=leer(); d.enviado=new Date().toISOString(); d.zona="America/Santo_Domingo";
    const btn=$("sig"); btn.disabled=true; btn.textContent="Enviando…";
    try{
      if(ENDPOINT){
        await fetch(ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});
      }
      store.del(); fin(d);
    }catch(e){
      const p=$("pasoTxt"); p.textContent="No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.";
      btn.disabled=false; btn.textContent="Enviar registro";
    }finally{ enviando=false; }
  }
  function fin(d){
    $("f").hidden=true; $("steps").hidden=true; document.querySelector(".bar").hidden=true; $("preview").hidden=true;
    const D=$("done"); D.hidden=false;
    if(!ENDPOINT){
      $("doneT").textContent="Así se vería la confirmación";
      $("doneTxt").textContent="Estás en la vista previa: este registro no se guardó. Cuando el formulario esté conectado a la hoja de respuestas, cada envío llegará a Google Sheets con las categorías de la Plantilla 13.";
      const T=$("enviadoTbl"); T.textContent="";
      const fila=(a,b)=>{const tr=el("tr"); tr.append(el("td",null,a), el("td",null,b)); T.append(tr);};
      fila("Perfil",d.perfil); fila("Facultad",`${d.facultad} (${d.area})`); fila("Recinto",d.recinto);
      if(d.escuela) fila("Escuela",d.escuela); if(d.sexo) fila("Sexo",d.sexo); if(d.edad) fila("Edad",d.edad);
      d.movilidades.forEach((m,i)=>{ fila(`Movilidad ${i+1}`,[m.razon,m.dimension,m.pais,m.institucion,m.inicio,m.duracion,m.modalidad].join(" · ")); fila(`  Apoyo`,m.apoyo.join(", ")); if(m.convenio) fila("  Convenio",m.convenio); });
      if(d.hizo==="no") fila("Movilidad","No ha realizado desde 2023");
      const di=Object.entries(d.inclusion.dificultades); if(di.length) fila("Dificultades",di.map(([k,v])=>`${k}: ${v}`).join(" · "));
      if(d.inclusion.primera_gen) fila("Primera generación",d.inclusion.primera_gen);
      if(d.visitantes) fila("Visitantes recibidos",d.visitantes);
      fila("Correo",d.email?"Se guarda en una hoja aparte, sin enlace con las respuestas":"No indicado");
      $("enviadoBox").hidden=false;
    }
    D.focus();
    D.scrollIntoView({block:"start"});
  }
  $("copiar").addEventListener("click",()=>{
    const url=(S.formularioMovilidad && /^https?:/.test(S.formularioMovilidad))?S.formularioMovilidad:location.href.split("#")[0];
    const ok=()=>{$("copiado").textContent="Enlace copiado.";};
    const no=()=>{$("copiado").textContent=url;};
    try{ navigator.clipboard.writeText(url).then(ok,no); }catch(e){ no(); }
  });
  $("otra").addEventListener("click",()=>{ store.del(); location.hash=""; location.reload(); });

  ir(0,true);
})();
