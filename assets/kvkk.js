(function(){
  var root=document.documentElement, lang="en";
  try{var s=localStorage.getItem("mg-theme");root.setAttribute("data-theme",s||"light");}catch(e){root.setAttribute("data-theme","light");}
  document.getElementById("themeBtn").addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    var dk=cur?cur==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
    var n=dk?"light":"dark";root.setAttribute("data-theme",n);
    try{localStorage.setItem("mg-theme",n);}catch(e){}
  });

  var UI={
    kick:["Legal","Hukuki"],
    h1:["Data protection notice and cookie policy","Aydınlatma metni ve çerez politikası"],
    intro:["How personal data is processed on this website and in the course of professional services, and what cookies the site uses.","Bu internet sitesinde ve mesleki hizmetlerin yürütülmesi sırasında kişisel verilerin nasıl işlendiği ve sitenin hangi çerezleri kullandığı."],
    utilLabel:["Data protection","Kişisel veriler"],
    dK:["Draft","Taslak"],
    dT:["Prepared as a working draft. It must be reviewed by a lawyer and the bracketed fields completed before the site goes live.","Çalışma taslağı olarak hazırlanmıştır. Site yayına alınmadan önce bir hukukçu tarafından gözden geçirilmeli ve köşeli parantezli alanlar doldurulmalıdır."],
    lblIdx:["Contents","İçindekiler"],
    f1:["<strong>Review.</strong> This text is a starting point, not legal advice. The categories of data, retention periods and recipients must be checked against how the practice actually operates before publication.","<strong>Gözden geçirme.</strong> Bu metin bir başlangıç noktasıdır, hukuki görüş değildir. Veri kategorileri, saklama süreleri ve alıcılar, büronun fiilen nasıl çalıştığına göre yayından önce kontrol edilmelidir."],
    f2:["<strong>Registry.</strong> Whether registration in the data controllers' registry is required depends on thresholds that change; this is confirmed separately.","<strong>Sicil.</strong> Veri sorumluları siciline kayıt gerekip gerekmediği, değişen eşiklere bağlıdır; ayrıca teyit edilir."]
  };
  function L(k){return UI[k][lang==="tr"?1:0];}
  function T(a){return a[lang==="tr"?1:0];}

  var F='<span class="fill">';
  var SEC=[
   {t:["Data controller","Veri sorumlusu"],
    p:[["The data controller is MG Consulting, a sole practitioner certified public accountant practice registered at the [tax office] tax office, with its office at Cumhuriyet Mah. Hal Cad. No: 5, İç Kapı No: 18, İncirliova / Aydın.","Veri sorumlusu, [vergi dairesi] vergi dairesine kayıtlı, serbest muhasebeci mali müşavirlik faaliyeti yürüten MG Consulting olup, iş yeri adresi Cumhuriyet Mah. Hal Cad. No: 5, İç Kapı No: 18, İncirliova / Aydın'dır."],
       ["Requests concerning personal data may be sent to info@mgconsultingtr.com or in writing to the office address.","Kişisel verilere ilişkin talepler info@mgconsultingtr.com adresine veya yazılı olarak iş yeri adresine iletilebilir."]]},

   {t:["Data processed through the website","İnternet sitesi üzerinden işlenen veriler"],
    p:[["Browsing the site requires no registration and no account. Where you send a message through the contact details, the identity and contact information you provide and the content of your message are processed in order to respond.","Sitenin gezilmesi için kayıt veya hesap gerekmez. İletişim bilgileri üzerinden mesaj göndermeniz halinde, verdiğiniz kimlik ve iletişim bilgileri ile mesajınızın içeriği, size dönüş yapılabilmesi amacıyla işlenir."],
       ["The calculation and review tools on the site run entirely in your browser. Figures you enter and files you load are not transmitted to any server and are not stored.","Sitedeki hesaplama ve inceleme araçları tamamen tarayıcınızda çalışır. Girdiğiniz tutarlar ve yüklediğiniz dosyalar hiçbir sunucuya iletilmez ve saklanmaz."]]},

   {t:["Data processed in the course of services","Hizmetlerin yürütülmesinde işlenen veriler"],
    p:[["Where a professional engagement exists, the data required to perform it is processed. This typically includes identity and contact data, tax identification data, payroll and social security data of employees, accounting records, invoices and bank movements.","Mesleki bir hizmet ilişkisi bulunması halinde, bu hizmetin yerine getirilmesi için gerekli veriler işlenir. Bunlar genellikle kimlik ve iletişim verileri, vergi kimlik bilgileri, çalışanlara ait bordro ve sosyal güvenlik verileri, muhasebe kayıtları, faturalar ve banka hareketleridir."]],
    tbl:{h:[["Purpose","Amaç"],["Legal ground","Hukuki sebep"]],
         r:[[["Performance of the engagement","Hizmet sözleşmesinin ifası"],["Necessity for the performance of a contract","Sözleşmenin ifası için gereklilik"]],
            [["Filing returns and statutory notifications","Beyanname ve yasal bildirimlerin verilmesi"],["Compliance with a legal obligation","Hukuki yükümlülüğün yerine getirilmesi"]],
            [["Retention of books and records","Defter ve belgelerin saklanması"],["Compliance with a legal obligation","Hukuki yükümlülüğün yerine getirilmesi"]],
            [["Establishment and defence of legal claims","Hakların tesisi ve savunulması"],["Legitimate interest","Meşru menfaat"]]]}},

   {t:["Recipients","Aktarım yapılan taraflar"],
    p:[["Data is disclosed to public authorities only where legislation requires it, in particular the Revenue Administration, the Social Security Institution and, where applicable, the chamber of certified public accountants.","Veriler, yalnızca mevzuatın gerektirdiği hallerde kamu kurumlarına, özellikle Gelir İdaresi Başkanlığı, Sosyal Güvenlik Kurumu ve gerektiğinde bağlı olunan meslek odasına bildirilir."],
       ["Technical service providers used to operate the practice, such as accounting software and electronic document integrators, may process data on instructions only. [List the providers actually used.]","Büronun işletilmesinde kullanılan teknik hizmet sağlayıcıları, örneğin muhasebe yazılımı ve e-belge özel entegratörleri, yalnızca talimat üzerine veri işleyebilir. [Fiilen kullanılan sağlayıcılar listelenecek.]"],
       ["Data is not transferred abroad unless a service provider requires it; where that is the case the conditions in the legislation are observed. [Confirm.]","Bir hizmet sağlayıcısı gerektirmedikçe yurt dışına aktarım yapılmaz; böyle bir durumda mevzuattaki şartlara uyulur. [Teyit edilecek.]"]]},

   {t:["Professional secrecy","Meslek sırrı"],
    p:[["Independently of data protection legislation, information learned in the course of the profession is subject to the duty of professional secrecy and is not disclosed to third parties, including after the engagement ends.","Kişisel verilerin korunması mevzuatından bağımsız olarak, mesleki faaliyet sırasında öğrenilen bilgiler sır saklama yükümlülüğüne tabidir ve hizmet ilişkisi sona erdikten sonra da üçüncü kişilerle paylaşılmaz."]]},

   {t:["Retention","Saklama süreleri"],
    p:[["Books, records and the documents supporting them are retained for the periods set in tax and commercial legislation. Correspondence not subject to a statutory period is retained for as long as it is needed for the purpose and then deleted. [Set the periods applied.]","Defter, kayıt ve bunlara dayanak belgeler, vergi ve ticaret mevzuatında öngörülen süreler boyunca saklanır. Yasal bir süreye tabi olmayan yazışmalar amaç için gerekli olduğu sürece saklanır ve sonrasında silinir. [Uygulanan süreler belirlenecek.]"]]},

   {t:["Your rights","Haklarınız"],
    p:[["You may ask whether your personal data is processed, request information about it, ask for correction of inaccurate data, request erasure where the conditions are met, object to a result produced solely by automated processing, and claim compensation for damage caused by unlawful processing.","Kişisel verilerinizin işlenip işlenmediğini öğrenme, buna ilişkin bilgi talep etme, yanlış işlenmişse düzeltilmesini isteme, şartları oluştuğunda silinmesini talep etme, yalnızca otomatik sistemlerle analiz edilmesi yoluyla aleyhinize bir sonuç çıkmasına itiraz etme ve hukuka aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz."],
       ["Requests are answered within the statutory period, free of charge unless the response requires a separate cost.","Talepler, yanıtın ayrı bir maliyet gerektirmediği hallerde ücretsiz olarak ve yasal süre içinde cevaplanır."]]},

   {t:["Cookies","Çerezler"],
    p:[["This site uses no advertising, tracking or analytics cookies and no third-party tracking scripts.","Bu sitede reklam, izleme veya analiz çerezi ile üçüncü taraf izleme kodu kullanılmaz."],
       ["Technically necessary preferences are kept in your browser's local storage, not transmitted to any server: the language you selected, the light or dark theme, and the parameters you entered into the calculation tools. You can clear them at any time from your browser settings.","Teknik olarak gerekli tercihler, hiçbir sunucuya iletilmeden tarayıcınızın yerel deposunda tutulur: seçtiğiniz dil, açık veya koyu tema ve hesaplama araçlarına girdiğiniz parametreler. Bunları tarayıcı ayarlarınızdan istediğiniz zaman silebilirsiniz."],
       ["Fonts are loaded from Google Fonts. Your browser therefore connects to that service when the page loads. [If this is to be avoided, the fonts are hosted on the site's own server.]","Yazı tipleri Google Fonts üzerinden yüklenir. Bu nedenle sayfa açıldığında tarayıcınız bu hizmete bağlanır. [Bu istenmiyorsa yazı tipleri sitenin kendi sunucusunda barındırılır.]"]]},

   {t:["Changes","Değişiklikler"],
    p:[["This notice is updated when the way data is processed changes. The date of the current version appears below.","Bu metin, verilerin işlenme biçimi değiştiğinde güncellenir. Yürürlükteki sürümün tarihi aşağıda yer alır."],
       ["Version date: [date]","Sürüm tarihi: [tarih]"]]}
  ];

  function render(){
    var idx=document.getElementById("idx"), doc=document.getElementById("doc");
    idx.innerHTML="";doc.innerHTML="";
    SEC.forEach(function(s,i){
      var n=("0"+(i+1)).slice(-2);
      var a=document.createElement("a");
      a.href="#s"+i;a.innerHTML='<span class="n">'+n+"</span><span>"+T(s.t)+"</span>";
      idx.appendChild(a);
      var sec=document.createElement("section");
      sec.id="s"+i;
      var h='<h2><span class="n">'+n+"</span><span>"+T(s.t)+"</span></h2>";
      s.p.forEach(function(p){h+="<p>"+T(p)+"</p>";});
      if(s.tbl){
        h+='<div class="tw"><table><thead><tr>';
        s.tbl.h.forEach(function(c){h+="<th>"+T(c)+"</th>";});
        h+="</tr></thead><tbody>";
        s.tbl.r.forEach(function(r){
          h+="<tr><td>"+T(r[0])+"</td><td>"+T(r[1])+"</td></tr>";
        });
        h+="</tbody></table></div>";
      }
      sec.innerHTML=h;
      doc.appendChild(sec);
    });
  }

  function applyLang(l){
    lang=l;
    ["kick","h1","intro","utilLabel","dK","dT","lblIdx"].forEach(function(id){
      var e=document.getElementById(id);if(e)e.textContent=L(id);
    });
    document.getElementById("f1").innerHTML=L("f1");
    document.getElementById("f2").innerHTML=L("f2");
    document.getElementById("btnEN").setAttribute("aria-pressed",l==="en"?"true":"false");
    document.getElementById("btnTR").setAttribute("aria-pressed",l==="tr"?"true":"false");
    root.setAttribute("lang",l);
    render();
  }
  document.getElementById("btnTR").addEventListener("click",function(){location.hash="tr";applyLang("tr");});
  document.getElementById("btnEN").addEventListener("click",function(){location.hash="en";applyLang("en");});
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