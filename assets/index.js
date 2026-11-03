(function(){
  var root=document.documentElement;
  try{var s=localStorage.getItem("mg-theme");root.setAttribute("data-theme",s||"light");}catch(e){root.setAttribute("data-theme","light");}
  document.getElementById("themeBtn").addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    var dark=cur?cur==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
    var n=dark?"light":"dark";root.setAttribute("data-theme",n);
    try{localStorage.setItem("mg-theme",n);}catch(e){}
  });

  var nodes=Array.prototype.slice.call(document.querySelectorAll("[data-tr]"));
  nodes.forEach(function(n){n.setAttribute("data-en",n.textContent);});
  var ph=document.getElementById("q");
  var phEN=ph?ph.getAttribute("placeholder"):"", phTR=ph?ph.getAttribute("data-trph"):"";
  var bEN=document.getElementById("btnEN"), bTR=document.getElementById("btnTR");
  var lang="en";

  var noteTR={
    "2026":"2026 dönemi metni. Yıl içinde yapılan değişiklikler madde bazında işaretlidir.",
    "2025":"2025 dönemi metni görüntüleniyor.",
    "2024":"2024 dönemi metni. Enflasyon düzeltmesi ve asgari kurumlar vergisi bu döneme ilişkindir.",
    "2023":"2023 dönemi metni. Geçiş dönemi düzeltmesine ilişkin hükümler ayrıca gösterilir.",
    "2022":"2022 dönemi metni. Sonraki değişiklikler karşılaştırmalı olarak listelenir."
  };
  var noteEN={
    "2026":"Text in force for 2026. In-year amendments are flagged per article.",
    "2025":"Showing the text in force for 2025.",
    "2024":"Text in force for 2024. Inflation adjustment and minimum corporate tax apply to this period.",
    "2023":"Text in force for 2023. Transitional adjustment provisions are shown separately.",
    "2022":"Text in force for 2022. Later amendments are listed comparatively."
  };
  var yr=document.getElementById("yr"), ym=document.getElementById("yrmsg");
  function updYear(){if(yr&&ym)ym.textContent=(lang==="tr"?noteTR:noteEN)[yr.value]||"";}
  if(yr)yr.addEventListener("change",updYear);

  function apply(l){
    lang=l;
    nodes.forEach(function(n){
      var v=l==="tr"?n.getAttribute("data-tr"):n.getAttribute("data-en");
      if(v!=null)n.textContent=v;
    });
    if(ph)ph.setAttribute("placeholder",l==="tr"?phTR:phEN);
    bEN.setAttribute("aria-pressed",l==="en"?"true":"false");
    bTR.setAttribute("aria-pressed",l==="tr"?"true":"false");
    root.setAttribute("lang",l);
    updYear();
  }
  bTR.addEventListener("click",function(){location.hash="tr";apply("tr");});
  bEN.addEventListener("click",function(){location.hash="en";apply("en");});
  window.addEventListener("hashchange",function(){
    var h=location.hash.replace("#","").toLowerCase();
    if(h==="tr")apply("tr"); else if(h==="en")apply("en");
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-c]"),function(b){
    b.addEventListener("click",function(){
      var el=document.getElementById(b.dataset.c), t=el.textContent.trim();
      var done=lang==="tr"?"Kopyalandı":"Copied", base=lang==="tr"?"Kopyala":"Copy";
      function sel(){try{var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);b.textContent=lang==="tr"?"Seçildi":"Selected";}catch(e){}
        setTimeout(function(){b.textContent=base;},1700);}
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(t).then(function(){b.textContent=done;setTimeout(function(){b.textContent=base;},1700);},sel);
      }else sel();
    });
  });

  var nav=Array.prototype.slice.call(document.querySelectorAll("nav.top a"));
  nav.forEach(function(a){a.addEventListener("click",function(){nav.forEach(function(o){o.classList.remove("on");});a.classList.add("on");});});

  Array.prototype.forEach.call(document.querySelectorAll(".yrs[data-years]"),function(el){
    var p=el.getAttribute("data-years").split("-"), a=+p[0], b=+p[1],
        base=el.getAttribute("data-base")||"#", h="";
    for(var y=a;y>=b;y--)h+='<a href="'+base+'">'+y+"</a>";
    el.innerHTML=h;
  });

  var mts=Array.prototype.slice.call(document.querySelectorAll(".mt"));
  function closeAll(except){
    mts.forEach(function(t){
      if(t===except)return;
      t.setAttribute("aria-expanded","false");
      var p=document.getElementById(t.getAttribute("data-m"));
      if(p)p.hidden=true;
    });
  }
  mts.forEach(function(t){
    t.addEventListener("click",function(e){
      e.stopPropagation();
      var p=document.getElementById(t.getAttribute("data-m"));
      var open=t.getAttribute("aria-expanded")==="true";
      closeAll(t);
      t.setAttribute("aria-expanded",open?"false":"true");
      if(p)p.hidden=open;
    });
  });
  document.addEventListener("click",function(e){
    if(e.target&&e.target.closest&&e.target.closest(".mega"))return;
    closeAll(null);
  });
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeAll(null);});

  var INSTR_BASE=[
   "You are the regulatory information assistant on the website of MG Consulting, an accounting, tax and advisory firm in Turkey. Your audience may be a professional accountant, a finance team member, or a business owner.",
   "",
   "SCOPE: Turkish tax legislation (Tax Procedure Law, Income Tax Law, Corporate Tax Law, VAT Law, excise and stamp duty), accounting (Turkish uniform chart of accounts, journal entries, period-end procedures), payroll and social security, labour law, commercial and company law, returns and e-document or e-ledger processes, accounting standards (TFRS, BOBI FRS) and how they differ from tax rules, financial modelling, cash flow forecasting and working capital analysis, and the professional rules applying to accountants. If a question falls outside this scope, say so politely and do not answer it.",
   "",
   "BEHAVIOUR:",
   "1. If the question is incomplete or ambiguous, ask ONE clarifying question first and stop, without answering. Commonly missing: accounting period or year, type of taxpayer (individual or company, balance sheet or cash basis), VAT registration, amount, nature of the transaction, type of asset, whether parties are related. If several things are missing, ask for the most critical one.",
   "2. If the question is clear enough, answer directly in this order: short answer of at most three sentences, a numerical example where useful, the accounting entry with account codes and debit and credit, points to watch, and the relevant article of law.",
   "3. Do NOT quote year-specific amounts, rates, thresholds, caps or tariffs from memory. Explain the calculation method instead and say that the figure is updated annually and must be verified for the relevant period.",
   "4. Do NOT invent communique numbers, private ruling dates or court decision references. If unsure, stay at the level of the statute article.",
   "5. Where treatment is contested, give the tax authority position and the opposing position separately; do not hide either.",
   "6. Say plainly when you are not certain. If you do not know, say so.",
   "7. Do not make a final professional judgement on a specific case; give general information. Do not discuss fees, prices or proposals, and do not write marketing copy or steer the reader to engage the firm.",
   "8. Write concisely, in professional language. Do not use markdown headings. Use a hyphen and a space for list items. You may use double asterisks for bold.",
   "9. End your answer with this exact line, on its own: [NOT] This is general information and does not constitute an assessment of any specific matter.",
   "   Do not add that line when you are asking a clarifying question."
  ].join("\n");
  var LANG_TR="\n\nIMPORTANT: Reply in Turkish. Use this closing line instead: [NOT] Bilgilendirme amaclidir; somut olaya iliskin degerlendirme icermez.";
  var LANG_EN="\n\nIMPORTANT: Reply in English.";

  var log=document.getElementById("log"), qEl=document.getElementById("q"),
      sendBtn=document.getElementById("send"), stat=document.getElementById("stat"),
      statBadge=document.getElementById("statBadge"), starters=document.getElementById("starters");
  var msgs=[], sampleFn=null, busy=false;

  function esc(s){return s.replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function inline(s){return esc(s).replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>");}
  function fmt(t){
    var tail="", i=t.indexOf("[NOT]");
    if(i>-1){tail=t.slice(i+5).trim();t=t.slice(0,i);}
    var out="", ul=false;
    t.replace(/\s+$/,"").split("\n").forEach(function(L){
      var m=L.match(/^\s*[-*]\s+(.*)$/);
      if(m){if(!ul){out+="<ul>";ul=true;}out+="<li>"+inline(m[1])+"</li>";}
      else{if(ul){out+="</ul>";ul=false;}if(L.trim()==="")return;out+="<p>"+inline(L)+"</p>";}
    });
    if(ul)out+="</ul>";
    if(tail)out+='<span class="tail">'+inline(tail)+"</span>";
    return out;
  }
  function add(who,cls){
    var d=document.createElement("div");d.className="msg "+cls;
    var h=document.createElement("span");h.className="who";h.textContent=who;
    var b=document.createElement("div");b.className="body";
    d.appendChild(h);d.appendChild(b);log.appendChild(d);
    log.scrollTop=log.scrollHeight;return b;
  }
  function setBusy(v){
    busy=v;sendBtn.disabled=v;
    sendBtn.textContent=v?(lang==="tr"?"Yazıyor…":"Writing…"):(lang==="tr"?"Gönder":"Send");
    stat.textContent=v?(lang==="tr"?"Çalışıyor":"Working"):(lang==="tr"?"Hazır":"Ready");
  }

  async function ask(text){
    text=(text||"").trim();
    if(busy||!text)return;
    if(!sampleFn){
      add(lang==="tr"?"Asistan":"Advisor","bot").innerHTML="<p>"+(lang==="tr"
        ?"Asistan bu görünümde çalışmıyor. Sayfanın claude.ai üzerinde açılması ve izin verilmesi gerekiyor."
        :"The advisor is not available in this view. The page must be opened on claude.ai and permission granted.")+"</p>";
      return;
    }
    add(lang==="tr"?"Siz":"You","me").textContent=text;
    qEl.value="";
    var head=msgs.length===0?(INSTR_BASE+(lang==="tr"?LANG_TR:LANG_EN)+"\n\nQUESTION: "):"";
    msgs.push({role:"user",content:head+text});
    var body=add(lang==="tr"?"Asistan":"Advisor","bot");
    body.innerHTML="<p>"+(lang==="tr"?"Düşünüyor…":"Thinking…")+"</p>";
    setBusy(true);
    try{
      var r=await sampleFn(msgs,{
        modelTier:"default",cache:false,
        onText:function(ev){body.innerHTML=fmt(ev.text||"");log.scrollTop=log.scrollHeight;}
      });
      var out=(r&&r.text)||"";
      body.innerHTML=fmt(out)||"<p>"+(lang==="tr"?"Cevap alınamadı.":"No answer returned.")+"</p>";
      msgs.push({role:"assistant",content:out});
    }catch(err){
      var c=err&&err.code;
      var m=lang==="tr"?"Bir hata oluştu, tekrar deneyebilirsiniz.":"Something went wrong. Please try again.";
      if(c==="not_granted")m=lang==="tr"?"Asistanı kullanmak için izin verilmedi.":"Permission to use the advisor was not granted.";
      else if(c==="rate_limited")m=lang==="tr"?"Çok fazla istek gönderildi. Kısa bir süre sonra tekrar deneyin.":"Too many requests. Please try again shortly.";
      body.innerHTML="<p>"+esc(m)+"</p>";
      if(msgs.length&&msgs[msgs.length-1].role==="user")msgs.pop();
    }
    setBusy(false);log.scrollTop=log.scrollHeight;
  }

  if(sendBtn&&qEl&&starters&&log){
  sendBtn.addEventListener("click",function(){ask(qEl.value);});
  qEl.addEventListener("keydown",function(e){if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault();ask(qEl.value);}});
  Array.prototype.forEach.call(starters.querySelectorAll("button"),function(b){
    b.addEventListener("click",function(){ask(b.textContent);});
  });

  function off(){if(stat)stat.textContent=lang==="tr"?"Kullanılamıyor":"Unavailable";if(statBadge)statBadge.className="badge seal";}
  if(window.claude&&window.claude.use){
    window.claude.use("sample").then(function(s){if(s){sampleFn=s;}else off();},off);
  }else off();
  }

  apply(location.hash.replace("#","").toLowerCase()==="en"?"en":"tr");
})();
(function(){
  var b=document.getElementById("ckBar"),k="mg-ck";
  var seen=false;try{seen=localStorage.getItem(k)==="1";}catch(e){}
  if(seen){b.hidden=true;b.style.display="none";}else{b.hidden=false;}
  document.getElementById("ckOk").addEventListener("click",function(){
    b.hidden=true;b.style.display="none";try{localStorage.setItem(k,"1");}catch(e){}
  });
})();