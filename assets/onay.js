/* Cerez onay ekrani: kabul edilmeden siteye girilmez.
   Kabul bilgisi tarayicida "mg-ck" anahtarinda tutulur (eski bilgilendirme seridiyle ayni anahtar).
   Aydinlatma metni ve kullanim sartlari sayfalarinda bu betik yuklenmez; metinler kabulden once okunabilir. */
(function(){
  var KEY="mg-ck";
  try{ if(localStorage.getItem(KEY)==="1") return; }catch(e){}

  var T={
    tr:{h:"Çerez bildirimi",
        p:"Bu sitede reklam, izleme veya analiz çerezi kullanılmaz. Yalnızca tema ve son açılan hesaplayıcı gibi sitenin çalışması için gerekli teknik tercihler tarayıcınızda saklanır. Siteyi kullanmak için bu bildirimi kabul etmeniz gerekir.",
        a:"Aydınlatma metni ve çerez politikası", u:"Kullanım şartları", b:"Kabul et ve devam et"},
    en:{h:"Cookie notice",
        p:"This site uses no advertising, tracking or analytics cookies. Only technical preferences needed for the site to work, such as the theme and the calculator you last opened, are kept in your browser. You must accept this notice to use the site.",
        a:"Data protection notice and cookie policy", u:"Terms of use", b:"Accept and continue"}
  };
  function lang(){
    var h=(location.hash||"").replace("#","").toLowerCase();
    if(h==="en")return "en";
    return (document.documentElement.getAttribute("lang")||"tr").slice(0,2)==="en"?"en":"tr";
  }

  var root=document.documentElement, prevOverflow=root.style.overflow;
  var others=[];
  var ov=document.createElement("div");
  ov.id="mgOnay";
  ov.setAttribute("role","dialog");
  ov.setAttribute("aria-modal","true");
  ov.setAttribute("aria-labelledby","mgOnayH");
  ov.style.cssText="position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,31,51,.82);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)";
  var box=document.createElement("div");
  box.style.cssText="max-width:520px;width:100%;background:#F8F6F2;color:#0A1F33;border-top:4px solid #9A7524;padding:28px 26px 24px;box-shadow:0 18px 50px rgba(0,0,0,.35);font:400 16px/1.55 'Source Sans 3','Segoe UI',system-ui,sans-serif";
  var h=document.createElement("h2"); h.id="mgOnayH";
  h.style.cssText="margin:0 0 10px;font:700 20px/1.25 'Archivo','Segoe UI',system-ui,sans-serif;color:#0A1F33";
  var p=document.createElement("p"); p.style.cssText="margin:0 0 14px;color:#24384C";
  var links=document.createElement("p"); links.style.cssText="margin:0 0 20px;font-size:14px";
  var la=document.createElement("a"); la.href="/kvkk.html"; la.style.cssText="color:#7A5A12;font-weight:600";
  var sep=document.createTextNode(" · ");
  var lu=document.createElement("a"); lu.href="/kullanim-sartlari.html"; lu.style.cssText="color:#7A5A12;font-weight:600";
  links.appendChild(la); links.appendChild(sep); links.appendChild(lu);
  var btn=document.createElement("button"); btn.type="button";
  btn.style.cssText="display:block;width:100%;font:600 15px 'Archivo','Segoe UI',system-ui,sans-serif;background:#0A1F33;color:#F8F6F2;border:0;padding:13px 18px;cursor:pointer";
  box.appendChild(h); box.appendChild(p); box.appendChild(links); box.appendChild(btn);
  ov.appendChild(box);

  function fill(){
    var t=T[lang()];
    h.textContent=t.h; p.textContent=t.p; la.textContent=t.a; lu.textContent=t.u; btn.textContent=t.b;
  }
  function open(){
    fill();
    Array.prototype.forEach.call(document.body.children,function(el){
      if(el!==ov && !el.hasAttribute("inert")){el.setAttribute("inert","");el.setAttribute("aria-hidden","true");others.push(el);}
    });
    document.body.appendChild(ov);
    root.style.overflow="hidden";
    try{btn.focus({preventScroll:true});}catch(e){btn.focus();}
  }
  function accept(){
    try{localStorage.setItem(KEY,"1");}catch(e){}
    others.forEach(function(el){el.removeAttribute("inert");el.removeAttribute("aria-hidden");});
    root.style.overflow=prevOverflow;
    if(ov.parentNode)ov.parentNode.removeChild(ov);
    var bar=document.getElementById("ckBar");
    if(bar){bar.hidden=true;bar.style.display="none";}
    window.removeEventListener("hashchange",fill);
  }
  btn.addEventListener("click",accept);
  ov.addEventListener("keydown",function(e){
    if(e.key!=="Tab")return;
    var f=[la,lu,btn], i=f.indexOf(document.activeElement);
    e.preventDefault();
    f[(i+(e.shiftKey?f.length-1:1))%f.length].focus();
  });
  window.addEventListener("hashchange",fill);

  if(document.body)open(); else document.addEventListener("DOMContentLoaded",open);
})();
