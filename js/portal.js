/* Portal RIUDICC–UASD: dibuja las secciones a partir de data/contenido.js y data/ofertas.js */
(function(){
  const $=id=>document.getElementById(id);
  const el=(t,c,x)=>{const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;};
  const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const fecha=s=>{ if(!/^\d{4}-\d{2}-\d{2}$/.test(s||"")) return ""; const [y,m,d]=s.split("-").map(Number); return `${d} ${MESES[m-1]} ${y}`; };
  const externo=h=>/^https?:/.test(h||"");
  const link=(text,href,cls)=>{const a=el("a",cls||null,text); a.href=href; if(externo(href)){a.target="_blank"; a.rel="noopener noreferrer";} return a;};
  const S=window.SITIO||{};
  const hoy=new Date(); const hoyISO=`${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`;

  // Convocatorias abiertas (de data/ofertas.js): con fecha primero, por cierre más próximo; luego plazo variable
  const abiertas=(window.OFERTAS||[])
    .filter(o=>(o.estado||"Aprobada")==="Aprobada" && (!o.fecha_limite || o.fecha_limite>=hoyISO))
    .sort((a,b)=>(a.fecha_limite||"9999")<(b.fecha_limite||"9999")?-1:1);
  const proxima=abiertas.find(o=>o.fecha_limite);

  // Destacados (el primero, automático: la próxima convocatoria que cierra)
  const D=$("destacados");
  const dests=(window.DESTACADOS||[]).slice();
  if(proxima) dests.unshift({ etiqueta:"Convocatoria", fecha:proxima.fecha_limite, titulo:proxima.titulo,
    texto:[proxima.entidad,proxima.pais,proxima.nivel].filter(Boolean).join(" · "), enlace:S.tablonMovilidad||"tablon.html" });
  dests.slice(0,4).forEach(d=>{
    const a=link("",d.enlace,"dest"); a.textContent="";
    const top=el("div","dest-top"); top.append(el("span","tag",d.etiqueta)); if(d.fecha) top.append(el("span","dest-date","Cierra "+fecha(d.fecha)));
    const mas=externo(d.enlace)?"Abrir enlace ↗":(d.enlace.charAt(0)==="#"?"Ver más ↓":"Ver más →");
    a.append(top, el("h3",null,d.titulo), el("p",null,d.texto), el("span","more",mas));
    D.append(a);
  });

  // Qué es RIUDICC
  const R=window.RIUDICC;
  if(R && $("riuTexto")){
    $("riuTexto").textContent=R.texto;
    if((R.objetivos||[]).length){ $("riuObjT").textContent=R.objetivosTitulo||""; R.objetivos.forEach(t=>$("riuHace").append(el("li",null,t))); if(R.objetivosFuente) $("riuObjF").textContent=R.objetivosFuente; }
    else { $("riuObjT").hidden=true; $("riuHace").hidden=true; $("riuObjF").hidden=true; }
    (R.logros||[]).forEach(l=>{const c=el("div","logro"); c.append(el("div","n",l.n), el("div","l",l.texto)); $("logros").append(c);});
    if(R.nota) $("logrosNota").textContent=R.nota;
  }

  // UASD
  if(window.UASD){ $("uasdTexto").textContent=UASD.texto; const O=$("oficinas");
    UASD.oficinas.forEach(o=>{const c=el("div","oficina"); const h=el("h3"); if(o.enlace) h.append(link(o.nombre,o.enlace)); else h.textContent=o.nombre; c.append(h, el("p",null,o.rol)); O.append(c);}); }

  // Convocatorias: las 5 próximas abiertas
  const C=$("convs");
  if(!abiertas.length){
    const v=el("p","conv-m","No hay convocatorias abiertas en este momento. El agente revisa las fuentes cada semana.");
    C.append(v);
  }
  abiertas.slice(0,5).forEach(c=>{
    const r=el("div","conv"); const d=el("div","conv-date"); d.textContent=c.fecha_limite?fecha(c.fecha_limite):"Plazo variable";
    const b=el("div","conv-body");
    b.append(externo(c.enlace)?link(c.titulo,c.enlace,"conv-t"):el("span","conv-t",c.titulo), el("div","conv-m",[c.entidad,c.pais,c.nivel].filter(Boolean).join(" · ")));
    r.append(d,b); C.append(r);
  });
  if(abiertas.length>5){ const m=link(`Ver las ${abiertas.length} convocatorias abiertas →`,S.tablonMovilidad||"tablon.html","more"); m.style.display="inline-block"; m.style.marginTop="12px"; C.append(m); }
  const Og=$("organismos");
  (window.ORGANISMOS_BECAS||[]).forEach(o=>{const li=el("li"); li.append(el("span","org-p",o.pais+": "), link(o.nombre,o.enlace)); Og.append(li);});
  const T=$("tablonLink"); if(T && S.tablonMovilidad){ T.href=S.tablonMovilidad; if(!externo(S.tablonMovilidad)){ T.removeAttribute("target"); T.removeAttribute("rel"); T.textContent="Abrir el tablón →"; } }

  // Participa
  const Fm=$("formLink");
  if(Fm){ if(S.formularioMovilidad){ Fm.href=S.formularioMovilidad; if(externo(S.formularioMovilidad)){ Fm.target="_blank"; Fm.rel="noopener noreferrer"; } } else { Fm.removeAttribute("href"); Fm.classList.add("disabled"); Fm.textContent="Formulario disponible pronto"; } }
  document.querySelectorAll("[data-correo]").forEach(n=>{ n.textContent=S.correo||""; });
  const U=$("actualizado"); if(U) U.textContent=fecha(S.actualizado);

  // Navegación activa (solo enlaces internos de la página)
  const links=[...document.querySelectorAll('.nav a[href^="#"]')];
  const secs=links.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(es=>{es.forEach(e=>{ if(e.isIntersecting){ links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id)); } });},{rootMargin:"-40% 0px -55% 0px"});
    secs.forEach(s=>io.observe(s));
  }
})();
