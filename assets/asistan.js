/* MG Asistan — sayfa betigi. Sohbet worker/worker.js adresine gider; anahtar tarayicida yoktur. */
(function(){
  // Cloudflare Worker adresi. Worker yayinlandiginda buraya yazilir (sonunda /chat olmadan).
  var ENDPOINT="https://mgconsulting.mithat-smmm-ofis.workers.dev";

  var root=document.documentElement, lang="tr", busy=false, msgs=[];
  function el(id){return document.getElementById(id);}

  try{var s=localStorage.getItem("mg-theme");root.setAttribute("data-theme",s||"light");}catch(e){root.setAttribute("data-theme","light");}
  el("themeBtn").addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    var dk=cur?cur==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
    var n=dk?"light":"dark";root.setAttribute("data-theme",n);
    try{localStorage.setItem("mg-theme",n);}catch(e){}
  });

  var UI={
   kick:["Guide","Rehber"],
   h1:["MG Assistant","MG Asistan"],
   intro:["An AI guide for accounting, tax, payroll, tax returns, e-ledger, TFRS and reporting questions. If a question is incomplete it asks for the missing detail first; then it answers with a short reply, an example, the accounting entry and the legal basis.","Muhasebe, vergi, bordro, beyanname, e-defter, TFRS ve raporlama sorularınızda yol gösteren yapay zekâ rehberi. Soru eksikse önce eksik bilgiyi sorar; sonra kısa cevap, örnek, muhasebe kaydı ve dayanak maddesiyle açıklar."],
   utilLabel:["MG Assistant","MG Asistan"],
   chatTitle:["MG Assistant","MG Asistan"],
   themeBtn:["Theme","Tema"],
   qLabel:["Your question","Sorunuz"],
   send:["Send","Gönder"],
   reset:["New conversation","Yeni sohbet"],
   hint:["Ctrl+Enter also sends","Ctrl+Enter ile de gönderebilirsiniz"],
   s1h:["How it works","Nasıl çalışır"],
   s1a:["If the question is unclear it asks one clarifying question first.","Soru belirsizse önce tek bir netleştirme sorusu sorar."],
   s1b:["Answer order: short reply, numerical example, accounting entry, points to watch, legal basis.","Cevap sırası: kısa cevap, sayısal örnek, muhasebe kaydı, dikkat noktaları, dayanak madde."],
   s1d:["On contested matters it gives the tax authority's view and the opposing view separately.","Tartışmalı konularda idarenin görüşünü ve karşı görüşü ayrı verir."],
   s2h:["Limits","Sınırlar"],
   s2a:["General information only; not a professional opinion on a specific matter.","Genel bilgilendirmedir; somut olaya ilişkin mesleki görüş değildir."],
   s2b:["It does not invent communiqué numbers, rulings or court decisions; it says when unsure.","Tebliğ numarası, özelge veya yargı kararı uydurmaz; emin olmadığında söyler."],
   s2c:["No fees, proposals or marketing.","Ücret, teklif veya hizmet pazarlaması yapmaz."],
   s3h:["Privacy","Gizlilik"],
   ready:["Ready","Hazır"], thinking:["Thinking","Yanıtlıyor"], off:["Not active","Devrede değil"],
   you:["You","Siz"], bot:["MG Assistant","MG Asistan"],
   offMsg:["The assistant is not active yet. It will be switched on once the backend is deployed.","Asistan henüz devreye alınmadı. Arka uç yayınlandığında açılacaktır."],
   errGen:["Something went wrong. Please try again.","Bir hata oluştu, tekrar deneyebilirsiniz."],
   errRate:["Too many requests. Please try again in a minute.","Çok fazla istek gönderildi. Bir dakika sonra tekrar deneyin."],
   errCfg:["The assistant is temporarily unavailable.","Asistan geçici olarak kullanılamıyor."],
   empty:["No answer returned.","Cevap alınamadı."],
   ph:["Example: can the VAT on a passenger car bought by a cash-basis taxpayer in 2026 be expensed?","Örnek: 2026 yılında işletme esasına tabi bir mükellefin aldığı binek otomobilin KDV'si gider yazılır mı?"]
  };
  function L(k){var v=UI[k];return v?(lang==="tr"?v[1]:v[0]):"";}

  var log=el("log"), qEl=el("q"), sendBtn=el("send"), stat=el("stat"), starters=el("starters"), offNote=el("offNote");

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function inline(s){return esc(s).replace(/\*\*([^*\n]+)\*\*/g,"<b>$1</b>");}
  function fmt(t){
    var tail="", i=t.indexOf("[NOT]");
    if(i>-1){tail=t.slice(i+5).trim();t=t.slice(0,i);}
    var err="", j=t.indexOf("[HATA]");
    if(j>-1){err=t.slice(j+6).trim();t=t.slice(0,j);}
    var out="", ul=false;
    t.split(/\r?\n/).forEach(function(line){
      var l=line.trim();
      if(/^[-•]\s+/.test(l)){if(!ul){out+="<ul>";ul=true;}out+="<li>"+inline(l.replace(/^[-•]\s+/,""))+"</li>";return;}
      if(ul){out+="</ul>";ul=false;}
      if(l)out+="<p>"+inline(l)+"</p>";
    });
    if(ul)out+="</ul>";
    if(err)out+='<p class="err">'+esc(err)+"</p>";
    if(tail)out+='<span class="not">'+esc(tail)+"</span>";
    return out;
  }
  function add(who,cls){
    var m=document.createElement("div");m.className="msg "+cls;
    var w=document.createElement("div");w.className="who";w.textContent=who;
    var b=document.createElement("div");b.className="b";
    m.appendChild(w);m.appendChild(b);log.appendChild(m);log.scrollTop=log.scrollHeight;return b;
  }
  function setBusy(v){
    busy=v;sendBtn.disabled=v||!ENDPOINT;qEl.disabled=v;
    stat.className="st "+(ENDPOINT?(v?"busy":"on"):"off");
    stat.textContent=ENDPOINT?(v?L("thinking"):L("ready")):L("off");
  }

  async function ask(text){
    text=(text||"").trim();
    if(!text||busy||!ENDPOINT)return;
    qEl.value="";
    add(L("you"),"me").innerHTML="<p>"+esc(text)+"</p>";
    msgs.push({role:"user",content:text});
    var body=add(L("bot"),"bot");
    body.innerHTML="<p>…</p>";
    setBusy(true);
    var out="";
    try{
      var r=await fetch(ENDPOINT.replace(/\/$/,"")+"/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({lang:lang,messages:msgs.slice(-16)})
      });
      if(!r.ok){
        var code="",st="",det="";try{var j=await r.json();code=j.error||"";st=j.status||"";det=j.detail||"";}catch(e){}
        var m=L("errGen");
        if(r.status===429||code==="rate_limited")m=L("errRate");
        else if(r.status===503||code==="not_configured"||code==="bad_key")m=L("errCfg");
        throw new Error(m+" ["+r.status+(code?" "+code:"")+(st?" "+st:"")+(det?": "+det:"")+"]");
      }
      var rd=r.body.getReader(), dec=new TextDecoder();
      while(true){
        var ch=await rd.read();if(ch.done)break;
        out+=dec.decode(ch.value,{stream:true});
        body.innerHTML=fmt(out);log.scrollTop=log.scrollHeight;
      }
      out+=dec.decode();
      body.innerHTML=fmt(out)||"<p>"+L("empty")+"</p>";
      if(out.trim())msgs.push({role:"assistant",content:out});else msgs.pop();
    }catch(err){
      var em=err&&err.message?err.message:"";
      if(!em||/^(TypeError|Failed to fetch|NetworkError|Load failed)/.test(em))em=L("errGen")+" [ağ: "+esc(em||"fetch")+"]";
      body.innerHTML='<p class="err">'+esc(em)+"</p>";
      if(msgs.length&&msgs[msgs.length-1].role==="user")msgs.pop();
    }
    setBusy(false);log.scrollTop=log.scrollHeight;
  }

  sendBtn.addEventListener("click",function(){ask(qEl.value);});
  qEl.addEventListener("keydown",function(e){if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault();ask(qEl.value);}});
  el("reset").addEventListener("click",function(){msgs=[];log.innerHTML="";qEl.value="";qEl.focus();});
  Array.prototype.forEach.call(starters.querySelectorAll("button"),function(b){
    b.addEventListener("click",function(){ask(b.textContent);});
  });

  function applyLang(l){
    lang=l;
    document.title=(l==="tr")?"MG Asistan — MG Consulting":"MG Assistant — MG Consulting";
    ["kick","h1","intro","utilLabel","chatTitle","themeBtn","qLabel","send","reset","hint",
     "s1h","s1a","s1b","s1d","s2h","s2a","s2b","s2c","s3h"].forEach(function(id){var e=el(id);if(e)e.textContent=L(id);});
    el("s1c").innerHTML=(l==="tr")
      ?'Yıla bağlı tutar ve oranları ezberden vermez; hesap yöntemini anlatır. Güncel değerler <a href="hesaplamalar.html">Hesaplamalar</a> sayfasındadır.'
      :'It does not quote year-specific amounts or rates from memory; it explains the method. Current values are on the <a href="hesaplamalar.html">Calculations</a> page.';
    el("s3a").innerHTML=(l==="tr")
      ?'Kişisel veri girmeyin: ad, TC kimlik no, vergi no, telefon. Sorunuz cevap üretilmesi için yapay zekâ servis sağlayıcısına iletilir; sohbet bu sitede saklanmaz, sayfa kapanınca silinir. Ayrıntı: <a href="kvkk.html">Aydınlatma metni</a>.'
      :'Do not enter personal data: names, ID numbers, tax numbers, phone numbers. Your question is sent to the AI service provider to generate the answer; the conversation is not stored on this site and is cleared when the page closes. Details: <a href="kvkk.html">Privacy notice</a>.';
    el("f1").innerHTML=(l==="tr")
      ?"<strong>Dayanak.</strong> Asistan kanun maddesi düzeyinde dayanak gösterir. Tebliğ, özelge ve yargı kararları için resmî kaynaklara bakılmalıdır."
      :"<strong>Basis.</strong> The assistant cites the statute article. Communiqués, rulings and court decisions must be checked against official sources.";
    el("f2").innerHTML=(l==="tr")
      ?"<strong>Kullanım.</strong> Cevaplar mesleki çalışma için başlangıç noktasıdır; yürürlükteki mevzuatla doğrulanmadan uygulanmaz."
      :"<strong>Use.</strong> Answers are a starting point for professional work and are not applied before verification against the legislation in force.";
    qEl.placeholder=L("ph");
    Array.prototype.forEach.call(starters.querySelectorAll("button"),function(b){b.textContent=b.getAttribute(l==="tr"?"data-q-tr":"data-q-en");});
    Array.prototype.forEach.call(document.querySelectorAll("[data-tr]"),function(e){
      if(!e.getAttribute("data-en"))e.setAttribute("data-en",e.textContent);
      e.textContent=e.getAttribute(l==="tr"?"data-tr":"data-en");
    });
    el("btnEN").setAttribute("aria-pressed",l==="en"?"true":"false");
    el("btnTR").setAttribute("aria-pressed",l==="tr"?"true":"false");
    root.setAttribute("lang",l);
    offNote.hidden=!!ENDPOINT;offNote.textContent=L("offMsg");
    setBusy(busy);
  }
  el("btnTR").addEventListener("click",function(){location.hash="tr";applyLang("tr");});
  el("btnEN").addEventListener("click",function(){location.hash="en";applyLang("en");});
  window.addEventListener("hashchange",function(){
    var h=location.hash.replace("#","").toLowerCase();
    if(h==="tr")applyLang("tr"); else if(h==="en")applyLang("en");
  });
  applyLang(location.hash.replace("#","").toLowerCase()==="en"?"en":"tr");
})();
(function(){
  var b=document.getElementById("ckBar"),k="mg-ck";
  var seen=false;try{seen=localStorage.getItem(k)==="1";}catch(e){}
  if(seen){b.hidden=true;b.style.display="none";}else{b.hidden=false;}
  document.getElementById("ckOk").addEventListener("click",function(){
    b.hidden=true;b.style.display="none";try{localStorage.setItem(k,"1");}catch(e){}
  });
})();
