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
    kick:["Automated review","Otomatik inceleme"],
    h1:["Company check-up","Şirket check-up"],
    intro:["Paste or load a trial balance. The page runs the control set an inspector would run, in the order an inspector runs it, and returns a risk-rated report with the basis for each finding and the evidence that would be requested.","Mizanı yapıştırın veya dosyadan yükleyin. Sayfa, bir müfettişin uygulayacağı kontrolleri onun uyguladığı sırayla çalıştırır ve her bulgunun dayanağı ile istenecek belgeyi içeren risk puanlı bir rapor üretir."],
    utilLabel:["Company check-up","Şirket check-up"],
    privK:["Local","Yerel"],
    privT:["The file is read in your browser. Nothing is uploaded and nothing leaves this page.","Dosya tarayıcınızda okunur. Hiçbir şey yüklenmez, hiçbir veri bu sayfadan çıkmaz."],
    lblTb:["Trial balance","Mizan"],
    lblDecl:["Declared figures, optional","Beyan edilen tutarlar, isteğe bağlı"],
    run:["Run the review","İncelemeyi çalıştır"],
    lblFile:["Load a file","Dosya yükle"],
    sample:["Load sample","Örnek veri"],
    clear:["Clear","Temizle"],
    hintTxt:["Accepts CSV, tab or semicolon separated text: account code, account name, debit, credit. Four-column trial balances with separate balance columns are also read. Turkish and plain number formats are both handled.","CSV, sekme veya noktalı virgülle ayrılmış metin kabul eder: hesap kodu, hesap adı, borç, alacak. Ayrı bakiye sütunları olan dört sütunlu mizanlar da okunur. Türkçe ve düz sayı biçimlerinin ikisi de işlenir."],
    hintDecl:["Entered figures enable the cross-checks in phase three. Left empty, those checks are reported as not performed.","Girilen tutarlar üçüncü aşamadaki çapraz kontrolleri açar. Boş bırakılırsa bu kontroller yapılmadı olarak raporlanır."],
    l1:["Turnover per the corporate tax return","Kurumlar beyannamesindeki ciro"],
    l2:["VAT computed per returns, cumulative","Beyanlardaki hesaplanan KDV, kümülatif"],
    l3:["Social security accrual per declarations","Bildirgelerdeki SGK tahakkuku"],
    l4:["Non-deductible expenses per the return","Beyannamedeki KKEG"],
    idleTxt:["Load the sample or paste a trial balance, then run the review.","Örnek veriyi yükleyin veya mizanı yapıştırın, sonra incelemeyi çalıştırın."],
    f1:["<strong>Scope.</strong> This is an arithmetical and plausibility review of the records supplied. It is not an audit, not a tax inspection and not an opinion on any specific matter. Findings are indications to be examined, not conclusions.","<strong>Kapsam.</strong> Bu, verilen kayıtların aritmetik ve makullük incelemesidir. Bağımsız denetim, vergi incelemesi veya somut olaya ilişkin görüş değildir. Bulgular incelenmesi gereken işaretlerdir, sonuç değildir."],
    f2:["<strong>Data.</strong> Parsing and analysis run entirely in the browser. No file is transmitted, stored or retained.","<strong>Veri.</strong> Ayrıştırma ve analiz tamamen tarayıcıda çalışır. Hiçbir dosya iletilmez, saklanmaz veya tutulmaz."],
    sevH:["High","Yüksek"], sevM:["Medium","Orta"], sevL:["Note","Bilgi"],
    accounts:["accounts read","hesap okundu"],
    findings:["findings","bulgu"],
    high:["high risk","yüksek risk"],
    med:["to examine","incelenecek"],
    score:["Risk score","Risk puanı"],
    clean:["No finding in this phase.","Bu aşamada bulgu yok."],
    basis:["Basis","Dayanak"],
    action:["Action","Yapılacak"],
    evid:["Evidence to request","İstenecek belgeler"],
    parseErr:["No account line could be read. Check that each line holds an account code and at least one amount.","Hiçbir hesap satırı okunamadı. Her satırda bir hesap kodu ve en az bir tutar bulunduğunu kontrol edin."],
    ph1:["Arithmetical integrity","Aritmetik bütünlük"],
    ph1d:["An inspector starts here. If the trial balance does not add up, nothing after it can be relied on.","Müfettiş buradan başlar. Mizan tutmuyorsa sonrasındaki hiçbir şeye güvenilemez."],
    ph2:["Impossible and reversed balances","İmkânsız ve ters bakiyeler"],
    ph2d:["Balances that cannot occur in a correctly kept ledger, and accounts carrying the opposite sign to their nature.","Doğru tutulan bir defterde oluşamayacak bakiyeler ve niteliğinin tersi yönde bakiye taşıyan hesaplar."],
    ph3:["Cross-checks against declarations","Beyanlarla çapraz mutabakat"],
    ph3d:["The records are compared with what was declared. This is the first thing requested in an inspection.","Kayıtlar beyan edilenle karşılaştırılır. İncelemede ilk istenen budur."],
    ph4:["Known inspection focus points","Bilinen inceleme odakları"],
    ph4d:["Patterns inspectors look for, whether or not the arithmetic is correct.","Aritmetik doğru olsa da müfettişin baktığı desenler."],
    ph5:["Evidence an inspector would request","Müfettişin isteyeceği belgeler"],
    ph5d:["Compiled from the findings above. Having these ready shortens any examination.","Yukarıdaki bulgulardan derlenmiştir. Bunların hazır olması incelemeyi kısaltır."],
    notRun:["Not performed. The corresponding declared figure was not entered.","Yapılmadı. Karşılık gelen beyan tutarı girilmedi."]
  };
  function L(k){return UI[k][lang==="tr"?1:0];}

  /* ---------- parsing ---------- */
  function num(x){
    if(x==null)return NaN;
    var t=String(x).replace(/[^\d,.\-]/g,"").trim();
    if(!t||t==="-")return NaN;
    var hasC=t.indexOf(",")>-1, hasD=t.indexOf(".")>-1;
    if(hasC&&hasD){
      if(t.lastIndexOf(",")>t.lastIndexOf("."))t=t.replace(/\./g,"").replace(",",".");
      else t=t.replace(/,/g,"");
    }else if(hasC){
      var p=t.split(",");
      if(p.length===2&&p[1].length<=2)t=p[0]+"."+p[1]; else t=t.replace(/,/g,"");
    }else if(hasD){
      var q=t.split(".");
      if(q.length>2)t=t.replace(/\./g,"");
      else if(q[1]&&q[1].length===3)t=t.replace(/\./g,"");
    }
    var v=parseFloat(t);
    return isNaN(v)?NaN:v;
  }
  function fmt(v){
    if(!isFinite(v))return "—";
    var neg=v<0; v=Math.abs(v);
    var s=v.toFixed(2).split(".");
    s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return (neg?"-":"")+s[0]+","+s[1];
  }
  function parse(txt){
    var lines=txt.split(/\r?\n/), rows=[];
    lines.forEach(function(ln){
      if(!ln.trim())return;
      var parts=ln.indexOf("\t")>-1?ln.split("\t"):ln.indexOf(";")>-1?ln.split(";"):ln.split(",");
      if(parts.length<2)parts=ln.trim().split(/\s{2,}/);
      if(parts.length<2)return;
      var code=String(parts[0]).trim().replace(/\s+/g,"");
      if(!/^\d{3}/.test(code))return;
      code=code.replace(/[^0-9.\-]/g,"").slice(0,24);
      var name="", nums=[];
      for(var i=1;i<parts.length;i++){
        var raw=String(parts[i]).trim();
        if(!raw)continue;
        var v=num(raw);
        if(!isNaN(v)&&/\d/.test(raw)&&!/[A-Za-zÇĞİÖŞÜçğıöşü]{3}/.test(raw))nums.push(v);
        else if(!name)name=raw;
      }
      if(!nums.length)return;
      var d=0,c=0,bal;
      if(nums.length>=4){d=nums[0];c=nums[1];bal=(nums[2]||0)-(nums[3]||0);}
      else if(nums.length===3){d=nums[0];c=nums[1];bal=nums[2];}
      else {d=nums[0];c=nums[1]||0;bal=d-c;}
      rows.push({code:code,name:name,d:d,c:c,bal:bal});
    });
    return rows;
  }

  /* ---------- account knowledge ---------- */
  var CONTRA={"103":1,"119":1,"122":1,"124":1,"128":1,"129":1,"137":1,"139":1,"147":1,"158":1,"199":1,
              "222":1,"224":1,"226":1,"229":1,"237":1,"239":1,"241":1,"244":1,"247":1,"249":1,
              "257":1,"268":1,"278":1,"298":1,"501":1,"580":1,"591":1,"690":0};
  function normalSide(code){
    var g=code.charAt(0), p3=code.substring(0,3);
    if(CONTRA[p3]===1)return (g==="5")?"D":"C";
    if(g==="1"||g==="2")return "D";
    if(g==="3"||g==="4")return "C";
    if(g==="5")return "C";
    if(g==="6"){
      if(/^6[047]/.test(p3))return "C";
      if(/^6[123568]/.test(p3))return "D";
      return null;
    }
    if(g==="7")return "D";
    return null;
  }
  function sumPrefix(rows,pfx){
    var t=0;rows.forEach(function(r){if(r.code.indexOf(pfx)===0)t+=r.bal;});return t;
  }
  function find(rows,pfx){
    var out=[];rows.forEach(function(r){if(r.code.indexOf(pfx)===0)out.push(r);});return out;
  }

  /* ---------- rules ---------- */
  function analyse(rows,decl){
    var F={p1:[],p2:[],p3:[],p4:[]}, ev=[];
    var totD=0,totC=0;
    rows.forEach(function(r){totD+=r.d;totC+=r.c;});
    var diff=Math.round((totD-totC)*100)/100;

    function add(p,sev,code,t,ex,amt,bas,act,evi){
      F[p].push({sev:sev,code:code,t:t,ex:ex,amt:amt,bas:bas,act:act});
      if(evi)ev.push(evi);
    }
    function TT(a){return a[lang==="tr"?1:0];}

    /* phase 1 */
    if(Math.abs(diff)>0.5){
      add("p1","hi","",["Trial balance does not balance","Mizan dengede değil"],
        ["Total debits and total credits differ. Until this is resolved every figure below is unreliable.","Toplam borç ile toplam alacak farklı. Bu giderilmeden aşağıdaki hiçbir tutar güvenilir değildir."],
        (lang==="tr"?"Fark: ":"Difference: ")+fmt(diff),
        "VUK m.175, m.182",
        ["Find the unbalanced entry before anything else; check for a journal posted to one side only.","Her şeyden önce dengesiz fişi bulun; tek tarafa atılmış kayıt olup olmadığını kontrol edin."],
        ["Journal listing for the period, filtered to single-sided entries","Döneme ait yevmiye dökümü, tek taraflı kayıtlar süzülmüş"]);
    }
    var subs={};
    rows.forEach(function(r){
      if(r.code.length>3){
        var p=r.code.substring(0,3);
        subs[p]=(subs[p]||0)+r.bal;
      }
    });
    rows.forEach(function(r){
      if(r.code.length===3&&subs[r.code]!==undefined){
        var d2=Math.round((r.bal-subs[r.code])*100)/100;
        if(Math.abs(d2)>0.5){
          add("p1","hi",r.code,["Main account does not equal the sum of its sub-accounts","Ana hesap, alt hesap toplamına eşit değil"],
            ["The balance carried on the main account differs from the total of its sub-accounts.","Ana hesabın taşıdığı bakiye, alt hesaplarının toplamından farklı."],
            (lang==="tr"?"Fark: ":"Difference: ")+fmt(d2),"VUK m.182",
            ["Reconcile the sub-ledger before closing the period.","Dönemi kapatmadan önce alt hesap dökümünü mutabık hale getirin."],
            ["Sub-ledger listing for account "+r.code,r.code+" hesabının alt hesap dökümü"]);
        }
      }
    });

    /* phase 2 */
    rows.forEach(function(r){
      var side=normalSide(r.code);
      if(!side)return;
      if(Math.abs(r.bal)<0.5)return;
      var reversed=(side==="D"&&r.bal<0)||(side==="C"&&r.bal>0);
      if(!reversed)return;
      var sev="md", t=["Account carries a balance opposite to its nature","Hesap, niteliğinin tersi yönde bakiye taşıyor"];
      var ex=["An account of this type should not carry a balance on this side. Either a posting is on the wrong side or the account has been misused.","Bu türdeki bir hesap bu tarafta bakiye taşımamalı. Ya kayıt ters tarafa atılmış ya da hesap amacı dışında kullanılmış."];
      var act=["Trace the postings that created the balance; reclassify if the account was used for the wrong purpose.","Bakiyeyi oluşturan kayıtları izleyin; hesap yanlış amaçla kullanıldıysa yeniden sınıflandırın."];
      if(r.code.indexOf("100")===0){
        sev="hi";
        t=["Cash account shows a credit balance","Kasa hesabı alacak bakiye veriyor"];
        ex=["A cash account cannot hold less than nothing. This indicates payments recorded without the corresponding receipts, or dates out of sequence.","Kasa hiçbir zaman eksiye düşemez. Bu, karşılığı kaydedilmemiş ödemelere veya tarih sırası bozukluğuna işaret eder."];
        act=["This is the first thing an inspector looks for. Identify the missing receipts and correct the dates.","İncelemede ilk bakılan yer burasıdır. Eksik tahsilatları tespit edin ve tarihleri düzeltin."];
      }
      if(r.code.indexOf("15")===0){
        sev="hi";
        t=["Inventory account shows a credit balance","Stok hesabı alacak bakiye veriyor"];
        ex=["Negative inventory. Goods have been recorded as sold or issued before being recorded as received.","Negatif stok. Mal, girişi kaydedilmeden önce satılmış veya çıkışı yapılmış olarak kaydedilmiş."];
        act=["Check purchase invoices not yet posted and the cut-off at period end.","Henüz kaydedilmemiş alış faturalarını ve dönem sonu kesim tarihini kontrol edin."];
      }
      add("p2",sev,r.code,t,ex,fmt(r.bal),"VUK m.175",act,
        [(lang==="tr"?"":"Ledger detail for account ")+r.code+(lang==="tr"?" hesabının defter dökümü":"")]);
    });

    var amort=Math.abs(sumPrefix(rows,"257"));
    var mdv=sumPrefix(rows,"25")-(-amort);
    var cost=0;
    rows.forEach(function(r){if(/^2(5[0-6]|58)/.test(r.code))cost+=r.bal;});
    if(amort>0&&cost>0&&amort>cost+0.5){
      add("p2","hi","257",["Accumulated depreciation exceeds asset cost","Birikmiş amortisman, maliyet bedelini aşıyor"],
        ["Depreciation charged cannot exceed the cost of the assets it relates to.","Ayrılan amortisman, ilgili olduğu kıymetlerin maliyetini aşamaz."],
        (lang==="tr"?"Maliyet: ":"Cost: ")+fmt(cost)+" · "+(lang==="tr"?"Amortisman: ":"Depreciation: ")+fmt(amort),
        "VUK m.313-320",
        ["Check for assets disposed of where the accumulated depreciation was not removed.","Elden çıkarılmış ancak birikmiş amortismanı kapatılmamış kıymetleri kontrol edin."],
        ["Fixed asset register with additions and disposals","Giriş ve çıkışlarıyla birlikte sabit kıymet kayıt listesi"]);
    }

    /* phase 3 */
    var s600=sumPrefix(rows,"600")+sumPrefix(rows,"601")+sumPrefix(rows,"602");
    var s610=sumPrefix(rows,"610")+sumPrefix(rows,"611")+sumPrefix(rows,"612");
    var netSales=Math.abs(s600)-Math.abs(s610);
    if(decl.turnover>0){
      var dT=Math.round((netSales-decl.turnover)*100)/100;
      if(Math.abs(dT)>Math.max(1,decl.turnover*0.001)){
        add("p3","hi","600/601/602",["Turnover per the records differs from the declared figure","Kayıtlardaki ciro, beyan edilen tutardan farklı"],
          ["Net sales in the ledger do not agree with the turnover declared.","Defterdeki net satışlar, beyan edilen ciroyla uyuşmuyor."],
          (lang==="tr"?"Kayıt: ":"Records: ")+fmt(netSales)+" · "+(lang==="tr"?"Beyan: ":"Declared: ")+fmt(decl.turnover)+" · "+(lang==="tr"?"Fark: ":"Difference: ")+fmt(dT),
          "VUK m.227, KVK m.6",
          ["Reconcile line by line before filing; an unexplained difference is the most common basis for an assessment.","Beyandan önce satır satır mutabakat yapın; açıklanamayan fark, tarhiyatın en sık dayanağıdır."],
          ["Sales invoice listing reconciled to the e-invoice and e-archive reports","E-fatura ve e-arşiv raporlarıyla mutabık satış faturası listesi"]);
      }else{
        add("p3","lo","600/601/602",["Turnover agrees with the declared figure","Ciro, beyan edilen tutarla uyumlu"],
          ["Net sales in the ledger agree with the turnover declared.","Defterdeki net satışlar beyan edilen ciroyla uyumlu."],
          fmt(netSales),"—",["No action.","İşlem gerekmiyor."],null);
      }
    }else{
      add("p3","lo","600",["Turnover cross-check not performed","Ciro çapraz kontrolü yapılmadı"],
        [L("notRun"),L("notRun")],"—","—",
        ["Enter the declared turnover to enable this check.","Bu kontrolü açmak için beyan edilen ciroyu girin."],null);
    }
    var h391=Math.abs(sumPrefix(rows,"391"));
    if(decl.vat>0&&h391>0){
      var dV=Math.round((h391-decl.vat)*100)/100;
      if(Math.abs(dV)>1){
        add("p3","hi","391",["Output VAT in the ledger differs from the returns","Hesaplanan KDV, beyanlardan farklı"],
          ["Account 391 does not agree with the output VAT declared.","391 hesabı, beyan edilen hesaplanan KDV ile uyuşmuyor."],
          (lang==="tr"?"Kayıt: ":"Ledger: ")+fmt(h391)+" · "+(lang==="tr"?"Beyan: ":"Declared: ")+fmt(decl.vat)+" · "+(lang==="tr"?"Fark: ":"Difference: ")+fmt(dV),
          "KDVK m.29, m.41",
          ["Identify the period in which the difference arose and correct it before the next return.","Farkın hangi dönemde doğduğunu tespit edin ve bir sonraki beyandan önce düzeltin."],
          ["VAT returns for the period with the ledger reconciliation","Döneme ait KDV beyannameleri ve defter mutabakatı"]);
      }
    }
    var c361=0,d361=0;
    rows.forEach(function(r){if(r.code.indexOf("361")===0){c361+=r.c;d361+=r.d;}});
    if(decl.sgk>0&&c361>0&&Math.abs(c361-decl.sgk)>1){
      add("p3","md","361",["Social security accrual differs from the declarations","SGK tahakkuku, bildirgelerden farklı"],
        ["The credit side of account 361 does not agree with the accrual per the declarations.","361 hesabının alacak tarafı, bildirgelerdeki tahakkukla uyuşmuyor."],
        (lang==="tr"?"Kayıt: ":"Ledger: ")+fmt(c361)+" · "+(lang==="tr"?"Beyan: ":"Declared: ")+fmt(decl.sgk),
        "5510 s.K.",
        ["Reconcile the monthly declarations to the accrual entries.","Aylık bildirgeleri tahakkuk kayıtlarıyla mutabık hale getirin."],
        ["Monthly declarations for the period","Döneme ait aylık bildirgeler"]);
    }
    var unpaid=c361-d361;
    if(unpaid>0.5){
      add("p3","md","361",["Accrued premiums remain unpaid at the period end","Tahakkuk eden primler dönem sonunda ödenmemiş"],
        ["Premiums accrued but not paid are not deductible in the period in which they were accrued.","Tahakkuk edip ödenmeyen primler, tahakkuk ettikleri dönemde gider yazılamaz."],
        (lang==="tr"?"Tahakkuk: ":"Accrued: ")+fmt(c361)+" · "+(lang==="tr"?"Ödenen: ":"Paid: ")+fmt(d361)+" · "+(lang==="tr"?"Ödenmeyen: ":"Unpaid: ")+fmt(unpaid),
        "GVK m.40/2, 5510 s.K. m.88",
        ["Add the unpaid portion back to the tax base, or settle it before the filing date.","Ödenmeyen kısmı matraha ekleyin veya beyan tarihinden önce ödeyin."],
        ["Premium payment receipts for the period","Döneme ait prim ödeme belgeleri"]);
    }
    var k689=Math.abs(sumPrefix(rows,"689"));
    if(k689>0){
      if(decl.kkeg>0&&Math.abs(k689-decl.kkeg)>1){
        add("p3","hi","689",["Non-deductible expenses in the ledger differ from the return","Kayıttaki KKEG, beyannameden farklı"],
          ["Account 689 carries a balance that does not match the non-deductible expenses added back in the return.","689 hesabındaki bakiye, beyannamede matraha eklenen KKEG ile eşleşmiyor."],
          (lang==="tr"?"Kayıt: ":"Ledger: ")+fmt(k689)+" · "+(lang==="tr"?"Beyan: ":"Declared: ")+fmt(decl.kkeg),
          "KVK m.11, GVK m.41",
          ["A balance booked but not added back understates the tax base. Reconcile before filing.","Kaydedilip matraha eklenmeyen tutar matrahı eksik gösterir. Beyandan önce mutabık hale getirin."],
          ["Schedule of non-deductible expenses tied to the return","Beyannameyle bağlantılı KKEG dökümü"]);
      }else if(!decl.kkeg){
        add("p3","md","689",["Non-deductible expenses recorded; return figure not entered","KKEG kaydedilmiş; beyan tutarı girilmedi"],
          ["Account 689 carries a balance. Confirm the same amount is added back in the return.","689 hesabı bakiye taşıyor. Aynı tutarın beyannamede matraha eklendiğini teyit edin."],
          fmt(k689),"KVK m.11",
          ["Check the non-deductible line of the return against this balance.","Beyannamenin KKEG satırını bu bakiyeyle karşılaştırın."],
          ["Non-deductible expense schedule","KKEG dökümü"]);
      }
    }

    /* phase 4 */
    var kasa=sumPrefix(rows,"100");
    if(kasa>0){
      var big=netSales>0?netSales*0.02:0;
      if(kasa>Math.max(250000,big)){
        add("p4","hi","100",["Cash balance is high relative to activity","Kasa bakiyesi, faaliyete göre yüksek"],
          ["A persistently high cash balance is treated as funds effectively made available to shareholders, and deemed interest is sought.","Sürekli yüksek kasa bakiyesi, fiilen ortaklara kullandırılmış kaynak sayılır ve adat faizi aranır."],
          fmt(kasa),"KVK m.13, VUK m.3",
          ["Document what the cash is held for, or establish the deemed interest and the related VAT.","Nakdin ne için tutulduğunu belgeleyin ya da adat faizini ve buna bağlı KDV'yi hesaplayın."],
          ["Daily cash book and bank statements for the period","Döneme ait kasa defteri ve banka ekstreleri"]);
      }
    }
    [["131",["Receivable from shareholders","Ortaklardan alacaklar"]],
     ["231",["Long-term receivable from shareholders","Ortaklardan uzun vadeli alacaklar"]]].forEach(function(p){
      var v=sumPrefix(rows,p[0]);
      if(v>0.5){
        add("p4","hi",p[0],["Debit balance on a shareholder account","Ortaklar hesabında borç bakiye"],
          ["Funds carried by a shareholder require deemed interest, the related VAT, and disclosure on the transfer pricing form.","Ortağın taşıdığı tutar için adat faizi, buna bağlı KDV ve transfer fiyatlandırması formunda beyan gerekir."],
          fmt(v),"KVK m.13, KDVK m.1",
          ["Compute the deemed interest for the period and complete the transfer pricing form.","Dönem için adat faizini hesaplayın ve transfer fiyatlandırması formunu doldurun."],
          ["Shareholder current account movement listing","Ortaklar cari hesabı hareket dökümü"]);
      }
    });
    var ort336=sumPrefix(rows,"331")+sumPrefix(rows,"431");
    if(ort336<-0.5){
      add("p4","md","331/431",["Payable to shareholders","Ortaklara borçlar"],
        ["Funds provided by a shareholder raise thin capitalisation and deemed interest questions in the opposite direction.","Ortağın verdiği kaynak, ters yönde örtülü sermaye ve adat sorularını gündeme getirir."],
        fmt(Math.abs(ort336)),"KVK m.12",
        ["Test against the thin capitalisation threshold of three times equity.","Öz sermayenin üç katı örtülü sermaye sınırına göre test edin."],
        ["Loan agreements or board resolutions covering shareholder funding","Ortak finansmanına ilişkin sözleşme veya yönetim kararları"]);
    }
    var use7A=find(rows,"7").some(function(r){return /^7[0-7]/.test(r.code);});
    var use7B=find(rows,"79").length>0;
    if(use7A&&use7B){
      add("p4","md","7/A · 7/B",["Both cost accounting options appear in use","İki maliyet yöntemi birlikte kullanılmış"],
        ["Accounts from both the 7/A and 7/B options carry balances. Only one option may be applied in a period.","Hem 7/A hem 7/B seçeneğine ait hesaplar bakiye taşıyor. Bir dönemde yalnızca bir seçenek uygulanabilir."],
        "—","Muhasebe Sistemi Uygulama Genel Tebliği",
        ["Decide the option and reclassify; cost transfers will otherwise not reconcile.","Seçeneği belirleyip yeniden sınıflandırın; aksi halde maliyet aktarımı tutmaz."],
        ["Cost transfer journals for the period","Döneme ait maliyet aktarım fişleri"]);
    }
    var devreden=sumPrefix(rows,"190"), ind=sumPrefix(rows,"191"), hes=Math.abs(sumPrefix(rows,"391")), odn=Math.abs(sumPrefix(rows,"360"));
    if(ind>0&&hes>0){
      var net=hes-ind;
      if(net>0&&odn<0.5){
        add("p4","md","360",["Output VAT exceeds input VAT but no payable is recorded","Hesaplanan KDV indirilecekten fazla, ancak ödenecek vergi kaydı yok"],
          ["Where output exceeds input VAT a payable should appear, unless it was settled within the period.","Hesaplanan KDV indirilecekten fazlaysa ödenecek vergi görünmelidir; dönem içinde ödenmişse ayrı değerlendirilir."],
          (lang==="tr"?"Net: ":"Net: ")+fmt(net),"KDVK m.29",
          ["Check whether the payment was recorded and whether the accrual entry was made.","Ödemenin kaydedilip kaydedilmediğini ve tahakkuk fişinin atılıp atılmadığını kontrol edin."],
          ["VAT accrual and payment entries","KDV tahakkuk ve ödeme kayıtları"]);
      }
    }
    if(devreden<-0.5){
      add("p4","md","190",["Carried-forward VAT shows a credit balance","Devreden KDV alacak bakiye veriyor"],
        ["Account 190 should not carry a credit balance; the chain between periods is likely broken.","190 hesabı alacak bakiye taşımamalı; dönemler arası devir zinciri kopmuş olabilir."],
        fmt(devreden),"KDVK m.29",
        ["Trace the carried-forward amount back through each period's return.","Devreden tutarı dönem dönem beyannameler üzerinden geriye izleyin."],
        ["VAT returns for every period in the chain","Zincirdeki her döneme ait KDV beyannameleri"]);
    }
    var pes=sumPrefix(rows,"180")+sumPrefix(rows,"280");
    if(pes>0.5){
      add("p4","lo","180/280",["Prepaid expenses carried forward","Gelecek dönemlere ait giderler"],
        ["Confirm the portion relating to the current period has been released to expense.","Cari döneme isabet eden kısmın gidere alındığını teyit edin."],
        fmt(pes),"VUK m.283",
        ["Review the release schedule at period close.","Dönem sonunda dağıtım tablosunu gözden geçirin."],
        ["Prepaid expense schedule showing the period split","Dönem ayrımını gösteren peşin ödenmiş gider tablosu"]);
    }
    var naz9=sumPrefix(rows,"95")+sumPrefix(rows,"9");
    var n950=Math.abs(sumPrefix(rows,"950")), n951=Math.abs(sumPrefix(rows,"951"));
    if(n950>0&&Math.abs(n950-n951)>0.5){
      add("p4","lo","950/951",["Memorandum accounts do not offset","Nazım hesaplar birbirini kapatmıyor"],
        ["Memorandum accounts should mirror each other exactly.","Nazım hesaplar birbirinin tam karşılığı olmalıdır."],
        fmt(n950)+" / "+fmt(n951),"—",
        ["Correct the memorandum entry; it does not affect the result but is noticed.","Nazım kaydı düzeltin; sonucu etkilemez ama dikkat çeker."],null);
    }

    return {F:F, ev:ev, totD:totD, totC:totC, diff:diff, n:rows.length, netSales:netSales};
  }

  /* ---------- render ---------- */
  var out=document.getElementById("out"), sumBar=document.getElementById("sumBar"), sumIn=document.getElementById("sumIn");
  function TTT(a){return a[lang==="tr"?1:0];}

  function render(res){
    var all=res.F.p1.concat(res.F.p2,res.F.p3,res.F.p4);
    var hi=0,md=0;
    all.forEach(function(f){if(f.sev==="hi")hi++;else if(f.sev==="md")md++;});
    var score=Math.max(0,100-hi*14-md*6);
    sumIn.innerHTML=
      '<div class="sc"><div class="k">'+L("accounts")+'</div><div class="v">'+res.n+'</div></div>'+
      '<div class="sc"><div class="k">'+L("findings")+'</div><div class="v">'+all.length+'</div></div>'+
      '<div class="sc hi"><div class="k">'+L("high")+'</div><div class="v">'+hi+'</div></div>'+
      '<div class="sc md"><div class="k">'+L("med")+'</div><div class="v">'+md+'</div></div>'+
      '<div class="sc '+(score>=80?"ok":score>=55?"md":"hi")+'"><div class="k">'+L("score")+'</div><div class="v">'+score+'</div><div class="n">/ 100</div></div>';
    sumBar.hidden=false;

    var h="";
    h+='<div class="tw"><table><thead><tr><th>'+(lang==="tr"?"Toplam":"Total")+"</th><th>"+(lang==="tr"?"Borç":"Debit")+"</th><th>"+(lang==="tr"?"Alacak":"Credit")+"</th><th>"+(lang==="tr"?"Fark":"Difference")+"</th></tr></thead><tbody><tr><td>"+(lang==="tr"?"Mizan":"Trial balance")+'</td><td class="n">'+fmt(res.totD)+'</td><td class="n">'+fmt(res.totC)+'</td><td class="n">'+fmt(res.diff)+"</td></tr></tbody></table></div>";

    [["p1","ph1","ph1d"],["p2","ph2","ph2d"],["p3","ph3","ph3d"],["p4","ph4","ph4d"]].forEach(function(p,i){
      var list=res.F[p[0]];
      h+='<section class="phase"><h2><span class="n">0'+(i+1)+'</span><span>'+L(p[1])+'</span><span class="c">'+list.length+" "+L("findings")+'</span></h2><p class="d">'+L(p[2])+"</p>";
      if(!list.length){h+='<p class="clean">'+L("clean")+"</p>";}
      list.forEach(function(f){
        var sv=f.sev==="hi"?L("sevH"):f.sev==="md"?L("sevM"):L("sevL");
        h+='<article class="f"><div class="lf"><span class="sev '+f.sev+'">'+sv+"</span>"+
           (f.code?'<span class="acc">'+esc(f.code)+"</span>":"")+"</div><div>"+
           "<h3>"+TTT(f.t)+'</h3><p class="ex">'+TTT(f.ex)+"</p>"+
           (f.amt&&f.amt!=="—"?'<div class="amt">'+f.amt+"</div>":"")+
           '<div class="act"><b>'+L("action")+"</b>"+TTT(f.act)+"</div>"+
           (f.bas&&f.bas!=="—"?'<div class="bas">'+L("basis")+": "+f.bas+"</div>":"")+
           "</div></article>";
      });
      h+="</section>";
    });

    h+='<section class="phase"><h2><span class="n">05</span><span>'+L("ph5")+'</span><span class="c">'+res.ev.length+'</span></h2><p class="d">'+L("ph5d")+"</p>";
    if(res.ev.length){
      h+='<div class="ev"><ul>';
      var seen={};
      res.ev.forEach(function(e){
        var txt=TTT(e);
        if(seen[txt])return;seen[txt]=1;
        h+="<li>"+esc(txt)+"</li>";
      });
      h+="</ul></div>";
    }else{h+='<p class="clean">'+L("clean")+"</p>";}
    h+="</section>";

    out.innerHTML=h;
  }

  function run(){
    var txt=document.getElementById("tb").value;
    var rows=parse(txt);
    if(!rows.length){
      sumBar.hidden=true;
      out.innerHTML='<div class="err">'+L("parseErr")+"</div>";
      return;
    }
    var decl={
      turnover:num(document.getElementById("dTurnover").value)||0,
      vat:num(document.getElementById("dVat").value)||0,
      sgk:num(document.getElementById("dSgk").value)||0,
      kkeg:num(document.getElementById("dKkeg").value)||0
    };
    lastRes=analyse(rows,decl);
    render(lastRes);
  }
  var lastRes=null;

  var SAMPLE=[
   "100;KASA;1.450.000,00;512.000,00",
   "102;BANKALAR;8.900.000,00;8.640.000,00",
   "120;ALICILAR;9.188.000,00;5.180.000,00",
   "131;ORTAKLARDAN ALACAKLAR;980.000,00;0,00",
   "153;TICARI MALLAR;4.300.000,00;4.510.000,00",
   "180;GELECEK AYLARA AIT GIDERLER;240.000,00;60.000,00",
   "190;DEVREDEN KDV;310.000,00;0,00",
   "191;INDIRILECEK KDV;1.720.000,00;0,00",
   "255;DEMIRBASLAR;900.000,00;0,00",
   "257;BIRIKMIS AMORTISMANLAR;0,00;1.050.000,00",
   "320;SATICILAR;3.100.000,00;4.260.000,00",
   "331;ORTAKLARA BORCLAR;0,00;750.000,00",
   "360;ODENECEK VERGI VE FONLAR;410.000,00;410.000,00",
   "361;ODENECEK SOSYAL GUVENLIK KESINTILERI;288.000,00;356.000,00",
   "391;HESAPLANAN KDV;0,00;2.140.000,00",
   "500;SERMAYE;0,00;2.000.000,00",
   "600;YURTICI SATISLAR;0,00;11.900.000,00",
   "610;SATISTAN IADELER;180.000,00;0,00",
   "621;SATILAN TICARI MALLAR MALIYETI;7.650.000,00;0,00",
   "689;DIGER OLAGANDISI GIDER VE ZARARLAR;146.000,00;0,00",
   "770;GENEL YONETIM GIDERLERI;1.980.000,00;0,00",
   "950;KANUNEN KABUL EDILMEYEN GIDERLER;146.000,00;0,00",
   "951;KKEG KARSILIGI;0,00;120.000,00"
  ].join("\n");

  document.getElementById("run").addEventListener("click",run);
  document.getElementById("sample").addEventListener("click",function(){
    document.getElementById("tb").value=SAMPLE;
    document.getElementById("dTurnover").value="11.720.000";
    document.getElementById("dVat").value="2.140.000";
    document.getElementById("dSgk").value="356.000";
    document.getElementById("dKkeg").value="";
    run();
  });
  document.getElementById("clear").addEventListener("click",function(){
    document.getElementById("tb").value="";
    ["dTurnover","dVat","dSgk","dKkeg"].forEach(function(i){document.getElementById(i).value="";});
    sumBar.hidden=true;lastRes=null;
    out.innerHTML='<p class="idle" id="idleTxt">'+L("idleTxt")+"</p>";
  });
  document.getElementById("file").addEventListener("change",function(e){
    var f=e.target.files&&e.target.files[0];
    if(!f)return;
    var rd=new FileReader();
    rd.onload=function(){document.getElementById("tb").value=String(rd.result||"");run();};
    rd.readAsText(f,"utf-8");
  });

  function applyLang(l){
    Array.prototype.forEach.call(document.querySelectorAll("[data-tr]"),function(e){
      if(!e.getAttribute("data-en"))e.setAttribute("data-en",e.textContent);
      e.textContent=e.getAttribute(l==="tr"?"data-tr":"data-en");
    });
    document.title=(l==="tr")?'Şirket Check-Up — MG Consulting':'Company Check-Up — MG Consulting';
    lang=l;
    ["kick","h1","intro","utilLabel","privK","privT","lblTb","lblDecl","lblFile",
     "hintTxt","hintDecl","l1","l2","l3","l4"].forEach(function(id){
      var el=document.getElementById(id);if(el)el.textContent=L(id);
    });
    document.getElementById("run").textContent=L("run");
    document.getElementById("sample").textContent=L("sample");
    document.getElementById("clear").textContent=L("clear");
    document.getElementById("f1").innerHTML=L("f1");
    document.getElementById("f2").innerHTML=L("f2");
    document.getElementById("btnEN").setAttribute("aria-pressed",l==="en"?"true":"false");
    document.getElementById("btnTR").setAttribute("aria-pressed",l==="tr"?"true":"false");
    root.setAttribute("lang",l);
    var idle=document.getElementById("idleTxt");
    if(idle)idle.textContent=L("idleTxt");
    if(lastRes)run();
  }
  document.getElementById("btnTR").addEventListener("click",function(){location.hash="tr";applyLang("tr");});
  document.getElementById("btnEN").addEventListener("click",function(){location.hash="en";applyLang("en");});
  window.addEventListener("hashchange",function(){
    var h=location.hash.replace("#","").toLowerCase();
    if(h==="tr")applyLang("tr"); else if(h==="en")applyLang("en");
  });

  applyLang(location.hash.replace("#","").toLowerCase()==="en"?"en":"tr");
  document.getElementById("sample").click();
})();
(function(){
  var b=document.getElementById("ckBar"),k="mg-ck";
  var seen=false;try{seen=localStorage.getItem(k)==="1";}catch(e){}
  if(seen){b.hidden=true;b.style.display="none";}else{b.hidden=false;}
  document.getElementById("ckOk").addEventListener("click",function(){
    b.hidden=true;b.style.display="none";try{localStorage.setItem(k,"1");}catch(e){}
  });
})();