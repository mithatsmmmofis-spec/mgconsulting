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
   kick:["Tools","Araçlar"],
   h1:["Calculations","Hesaplamalar"],
   intro:["Every calculation uses the period parameters shown below, which the firm keeps current. The basis and the date of the last check are always visible.","Her hesaplama, aşağıda gösterilen ve büro tarafından güncel tutulan dönem parametrelerini kullanır. Dayanak ve son kontrol tarihi her zaman görünür."],
   utilLabel:["Calculations","Hesaplamalar"],
   parH:["Period parameters","Dönem parametreleri"],
   parD:["Maintained by the firm and updated when the legislation changes. Visitors cannot alter them; every calculation below uses exactly these values.","Büro tarafından tutulur ve mevzuat değiştiğinde güncellenir. Ziyaretçi değiştiremez; aşağıdaki her hesaplama tam olarak bu değerleri kullanır."],
   pp1:["Period","Dönem"],
   pp2:["Employee social security rate, per cent","SGK işçi payı oranı, yüzde"],
   pp3:["Employee unemployment rate, per cent","İşsizlik sigortası işçi payı, yüzde"],
   pp4:["Stamp duty on wages, per thousand","Ücrette damga vergisi, binde"],
   pp5:["Social security base, lower limit, monthly","Prime esas kazanç alt sınırı, aylık"],
   pp6:["Social security base, upper limit, monthly","Prime esas kazanç üst sınırı, aylık"],
   pp7:["Gross minimum wage, monthly","Brüt asgari ücret, aylık"],
   pp8:["Severance pay ceiling, current period (selected by leaving date in the calculator)","Kıdem tazminatı tavanı, cari dönem (hesaplayıcı çıkış tarihine göre dönemi seçer)"],
   pp9:["Default surcharge, monthly rate, per cent","Gecikme zammı aylık oranı, yüzde"],
   bh1:["Income tax band, cumulative base up to","Gelir vergisi dilimi, kümülatif matrah üst sınırı"],
   bh2:["Rate","Oran"],
   save:["Save parameters","Parametreleri kaydet"],
   reset:["Reset","Sıfırla"],
   savedMsg:["Saved on this device","Bu cihaza kaydedildi"],
   c1h:["Salary, gross to net","Ücret, brütten nete"],
   c1s:["Monthly payroll with cumulative base, minimum wage exemption and stamp duty.","Kümülatif matrah, asgari ücret istisnası ve damga vergisiyle aylık bordro."],
   c1a:["Gross monthly salary","Aylık brüt ücret"],
   c1b:["Cumulative tax base, prior months","Önceki ayların kümülatif vergi matrahı"],
   c1y:["Full year, month by month","Tüm yıl, ay ay"],
   c1n:["The minimum wage exemption is applied as income tax and stamp duty computed on the gross minimum wage entered above.","Asgari ücret istisnası, yukarıda girilen brüt asgari ücret üzerinden hesaplanan gelir vergisi ve damga vergisi olarak uygulanır."],
   c2h:["Salary, net to gross","Ücret, netten brüte"],
   c2s:["Solves for the gross that produces the net entered.","Girilen neti veren brütü çözer."],
   c2a:["Target net salary","Hedef net ücret"],
   c2b:["Cumulative tax base, prior months","Önceki ayların kümülatif vergi matrahı"],
   c2n:["Solved numerically against the same payroll rules, to the nearest kurus.","Aynı bordro kurallarıyla sayısal olarak, kuruş hassasiyetinde çözülür."],
   c3h:["Severance and notice pay","Kıdem ve ihbar tazminatı"],
   c3s:["Enter the gross wage and any regular benefits; the severance base is built for you. Notice periods are those set in the Labour Law.","Brüt ücreti ve varsa düzenli yan hakları yazın; kıdeme esas ücret sizin için oluşturulur. İhbar süreleri İş Kanunu'nda yazılı olanlardır."],
   c3a:["Date of hire","İşe giriş tarihi"],
   c3b:["Date of leaving","Çıkış tarihi"],
   c3c:["Gross monthly wage","Brüt aylık ücret"],
   c3add:["Regular, recurring benefits are added to the severance base and each is shown separately in the result. Enter monthly amounts; leave blank if none. One-off items such as overtime are not added.","Düzenli ve sürekli ödenen yan haklar kıdem tazminatına esas ücrete eklenir ve sonuçta her biri ayrı satırda gösterilir. Aylık tutarları yazın; yoksa boş bırakın. Fazla mesai gibi arızi ödemeler eklenmez."],
   c3d:["Annual bonus total (one twelfth is added)","Yıllık ikramiye toplamı (on ikide biri eklenir)"],
   c3e:["Meal allowance, monthly","Yemek yardımı, aylık"],
   c3f:["Transport allowance, monthly","Yol yardımı, aylık"],
   c3g:["Other regular benefits, monthly (fuel, clothing, housing, insurance)","Diğer düzenli yardımlar, aylık (yakacak, giyim, konut, sigorta)"],
   rBase:["Gross wage","Brüt ücret"],
   rTavan:["Severance ceiling for the period","Dönemin kıdem tazminatı tavanı"],
   rCap:["Exceeds the ceiling; ceiling applied","Tavanı aşıyor; tavan uygulandı"],
   rNoCap:["Severance ceiling not set for this period; computed without a cap","Bu dönem için kıdem tavanı tanımlı değil; tavansız hesaplandı"],
   rAdds:["Benefits added","Eklenen yan haklar"],
   rBonus:["Bonus, one twelfth of annual","İkramiye payı (yıllık ÷ 12)"],
   rPrim:["Regular premium","Düzenli prim"],
   rMeal:["Meal allowance","Yemek yardımı"],
   rTr:["Transport allowance","Yol yardımı"],
   rOth:["Other regular benefits","Diğer düzenli yardımlar"],
   c3p:["Regular premium, monthly","Düzenli prim, aylık"],
   rGiy:["Severance base, monthly","Kıdeme esas aylık ücret (giydirilmiş)"],
   c3n:["Severance is subject to stamp duty only. Notice pay is subject to income tax and stamp duty; the income tax shown uses the top band entered and should be checked against the cumulative base.","Kıdem tazminatından yalnızca damga vergisi kesilir. İhbar tazminatı gelir vergisi ve damga vergisine tabidir; gösterilen gelir vergisi girilen en üst dilimi kullanır ve kümülatif matraha göre kontrol edilmelidir."],
   c4h:["Default surcharge","Gecikme zammı"],
   c4s:["Months are charged in full and part months by day, as the collection law provides.","Aylar tam, ay kesirleri günlük hesaplanır; tahsil kanununun öngördüğü şekilde."],
   c4a:["Due date","Vade tarihi"],
   c4b:["Date of payment","Ödeme tarihi"],
   c4c:["Principal amount","Asıl alacak tutarı"],
   c4n:["Uses the monthly rate from the panel. Where the rate changed during the period, run each sub-period separately.","Panelden gelen aylık oranı kullanır. Oran dönem içinde değiştiyse her alt dönemi ayrı hesaplayın."],
   c5h:["Deadline calculator","Süre hesaplayıcı"],
   c5s:["Adds the statutory period and carries a weekend ending to the next working day.","Yasal süreyi ekler ve hafta sonuna denk gelen bitişi sonraki iş gününe taşır."],
   c5a:["Start date, notification","Başlangıç tarihi, tebliğ"],
   c5b:["Period","Süre"],
   c5c:["Public holidays in the period, comma separated, YYYY-MM-DD","Dönemdeki resmî tatiller, virgülle, YYYY-AA-GG"],
   c5n:["Periods run from the day after notification. Confirm the holiday list for the year; it is not pre-filled.","Süreler tebliğ tarihini izleyen günden işler. Yılın resmî tatil listesini teyit edin; önceden doldurulmaz."],
   c6h:["Depreciation","Amortisman"],
   c6s:["Straight line, declining balance and pro rata in the year of acquisition.","Normal, azalan bakiyeler ve iktisap yılında kıst amortisman."],
   c6a:["Cost","Maliyet bedeli"],
   c6b:["Useful life, years","Faydalı ömür, yıl"],
   c6c:["Method","Yöntem"],
   c6d:["Months in the first year","İlk yıldaki ay sayısı"],
   c6n:["Declining balance uses twice the straight-line rate, capped at 50 per cent. Pro rata applies to passenger cars.","Azalan bakiyeler, normal oranın iki katını kullanır ve yüzde elliyi geçemez. Kıst amortisman binek otomobillerde uygulanır."],
   c7h:["Cash conversion cycle","Nakit dönüşüm süresi"],
   c7s:["Receivable, inventory and payable days, and the working capital they tie up.","Alacak, stok ve borç gün sayıları ile bağladıkları işletme sermayesi."],
   c7a:["Annual net sales","Yıllık net satışlar"],
   c7b:["Annual cost of sales","Yıllık satışların maliyeti"],
   c7c:["Average trade receivables","Ortalama ticari alacaklar"],
   c7d:["Average inventory","Ortalama stoklar"],
   c7e:["Average trade payables","Ortalama ticari borçlar"],
   c7n:["Working capital requirement is the cycle expressed in days applied to daily cost of sales.","İşletme sermayesi ihtiyacı, gün cinsinden döngünün günlük satış maliyetine uygulanmasıdır."],
   c8h:["Passenger car expense restriction","Binek otomobil gider kısıtlaması"],
   c8s:["Splits running costs into the deductible and non-deductible portions, with the VAT effect.","Cari giderleri gider yazılabilir ve kabul edilmeyen kısma ayırır, KDV etkisiyle birlikte."],
   c8a:["Expense, excluding VAT","Gider tutarı, KDV hariç"],
   c8b:["VAT rate, per cent","KDV oranı, yüzde"],
   c8n:["Seventy per cent is deductible. Whether the VAT on the non-deductible portion may be recovered is contested; it is shown separately here.","Yüzde yetmişi gider yazılır. Kabul edilmeyen kısma isabet eden KDV'nin indirilip indirilemeyeceği tartışmalıdır; burada ayrı gösterilir."],
   f1:["<strong>Basis.</strong> Rates and periods set directly in legislation are applied as such. Amounts indexed annually are taken only from the parameters panel; nothing is assumed.","<strong>Dayanak.</strong> Doğrudan mevzuatta yazılı oran ve süreler olduğu gibi uygulanır. Yıllık güncellenen tutarlar yalnızca parametre panelinden alınır; hiçbir varsayım yapılmaz."],
   f2:["<strong>Use.</strong> These are working calculations for professional use, not an assessment of any specific matter. Results are checked against the legislation in force before they are relied on.","<strong>Kullanım.</strong> Bunlar mesleki kullanım için çalışma hesaplamalarıdır, somut olaya ilişkin değerlendirme değildir. Sonuçlar kullanılmadan önce yürürlükteki mevzuatla karşılaştırılır."],
   needPar:["Enter the period parameters above.","Yukarıdan dönem parametrelerini girin."],
   /* result labels */
   rGross:["Gross","Brüt"], rSgk:["Social security, employee","SGK işçi payı"],
   rIss:["Unemployment, employee","İşsizlik işçi payı"], rGvm:["Income tax base","Gelir vergisi matrahı"],
   rGv:["Income tax","Gelir vergisi"], rGvi:["Minimum wage exemption, income tax","Asgari ücret istisnası, gelir vergisi"],
   rDmg:["Stamp duty","Damga vergisi"], rDmgi:["Minimum wage exemption, stamp duty","Asgari ücret istisnası, damga vergisi"],
   rNet:["Net salary","Net ücret"], rCum:["New cumulative base","Yeni kümülatif matrah"],
   rEmp:["Employer cost, excluding incentives","İşveren maliyeti, teşvik hariç"],
   rKid:["Severance pay, gross","Kıdem tazminatı, brüt"], rKidN:["Severance pay, net of stamp duty","Kıdem tazminatı, damga sonrası"],
   rSen:["Length of service","Kıdem süresi"], rNotW:["Notice period","İhbar süresi"],
   rIhb:["Notice pay, gross","İhbar tazminatı, brüt"], rIhbN:["Notice pay, net","İhbar tazminatı, net"],
   rDays:["Days elapsed","Geçen gün"], rMon:["Full months","Tam ay"],
   rSur:["Default surcharge","Gecikme zammı"], rTot:["Total payable","Ödenecek toplam"],
   rEnd:["Last day","Son gün"], rShift:["Carried to","Taşındığı gün"], rNoShift:["No carry needed","Taşıma gerekmedi"],
   rRate:["Rate applied","Uygulanan oran"], rY1:["First year","İlk yıl"], rY2:["Second year","İkinci yıl"],
   rTotDep:["Total over the life","Ömür boyunca toplam"],
   rAr:["Receivable days","Alacak gün sayısı"], rInv:["Inventory days","Stok gün sayısı"],
   rAp:["Payable days","Borç gün sayısı"], rCcc:["Cash conversion cycle","Nakit dönüşüm süresi"],
   rWc:["Working capital requirement","İşletme sermayesi ihtiyacı"],
   rDed:["Deductible, 70 per cent","Gider yazılır, yüzde 70"], rKkeg:["Non-deductible, 30 per cent","KKEG, yüzde 30"],
   rVatD:["VAT, deductible portion","KDV, indirilebilir kısım"], rVatN:["VAT on the non-deductible portion","KDV, kabul edilmeyen kısma isabet eden"],
   rCost:["Total cost","Toplam maliyet"],
   dOpts:[["30 days, appeal to the tax court","30 gün, vergi mahkemesinde dava"],
          ["30 days, request for settlement","30 gün, uzlaşma talebi"],
          ["30 days, request for penalty reduction","30 gün, cezada indirim talebi"],
          ["15 days, voluntary disclosure filing","15 gün, pişmanlıkla beyan"],
          ["7 days, issuing an invoice","7 gün, fatura düzenleme"]],
   mOpts:[["Straight line","Normal amortisman"],["Declining balance","Azalan bakiyeler"]],
   yrs:["years","yıl"], mos:["months","ay"], dys:["days","gün"], wks:["weeks","hafta"]
  };
  function L(k){return UI[k][lang==="tr"?1:0];}

  function num(x){
    if(x==null)return 0;
    var t=String(x).replace(/[^\d,.\-]/g,"").trim();
    if(!t)return 0;
    var hasC=t.indexOf(",")>-1, hasD=t.indexOf(".")>-1;
    if(hasC&&hasD){
      if(t.lastIndexOf(",")>t.lastIndexOf("."))t=t.replace(/\./g,"").replace(",",".");
      else t=t.replace(/,/g,"");
    }else if(hasC){
      var p=t.split(",");
      if(p.length===2&&p[1].length<=2)t=p[0]+"."+p[1]; else t=t.replace(/,/g,"");
    }else if(hasD){
      var q=t.split(".");
      if(q.length>2||(q[1]&&q[1].length===3))t=t.replace(/\./g,"");
    }
    var v=parseFloat(t);
    return isNaN(v)?0:v;
  }
  function f2(v){
    if(!isFinite(v))return "—";
    var neg=v<0;v=Math.abs(v);
    var s=v.toFixed(2).split(".");
    s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return (neg?"-":"")+s[0]+","+s[1];
  }
  function f0(v){return isFinite(v)?Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."):"—";}
  function el(id){return document.getElementById(id);}

  /* ---- brackets ---- */
  var BR=[{up:"198000",r:15},{up:"414000",r:20},{up:"1500000",r:27},{up:"7300000",r:35},{up:"",r:40}];
  function drawBrackets(){
    var b=el("brkBody"),h="";
    BR.forEach(function(x,i){
      var last=i===BR.length-1;
      h+='<tr><td><input data-br="'+i+'" data-f="up" value="'+(x.up||"")+'" inputmode="decimal" placeholder="'+(last?"∞":"0")+'"'+(last?" disabled":" readonly")+'></td>'+
         '<td><input data-br="'+i+'" data-f="r" value="'+x.r+'" inputmode="decimal" style="max-width:88px" readonly> %</td></tr>';
    });
    b.innerHTML=h;
    Array.prototype.forEach.call(b.querySelectorAll("input"),function(inp){
      inp.addEventListener("input",function(){
        BR[+inp.getAttribute("data-br")][inp.getAttribute("data-f")]=inp.value;
        runAll();
      });
    });
  }
  function taxOn(base){
    var rem=base, prev=0, tax=0;
    for(var i=0;i<BR.length;i++){
      var up=i===BR.length-1?Infinity:num(BR[i].up);
      if(i<BR.length-1&&up<=0)up=Infinity;
      var slice=Math.max(0,Math.min(base,up)-prev);
      tax+=slice*num(BR[i].r)/100;
      prev=up;
      if(base<=up)break;
    }
    return tax;
  }

  /* ---- params ---- */
  var PIDS=["pYear","pSgk","pIss","pDmg","pTaban","pTavan","pAsg","pKidTavan","pGec"];
  function P(id){return num(el(id).value);}
  function saveP(){
    try{
      var o={};PIDS.forEach(function(i){o[i]=el(i).value;});o.BR=BR;
      localStorage.setItem("mg-params",JSON.stringify(o));
      var m=el("savedMsg");m.hidden=false;m.textContent=L("savedMsg");
      setTimeout(function(){m.hidden=true;},2200);
    }catch(e){}
  }
  function loadP(){
    try{
      var raw=localStorage.getItem("mg-params");if(!raw)return;
      var o=JSON.parse(raw);
      PIDS.forEach(function(i){if(o[i]!==undefined)el(i).value=o[i];});
      if(o.BR&&o.BR.length)BR=o.BR;
    }catch(e){}
  }

  function rows(target,list){
    var h="";
    list.forEach(function(r){
      if(!r)return;
      h+='<div class="r'+(r.tot?" tot":"")+(r.neg?" neg":"")+'"><span class="k">'+r.k+'</span><span class="v">'+r.v+"</span></div>";
    });
    el(target).innerHTML=h;
  }

  /* ---- payroll ---- */
  function payroll(gross,cum){
    var taban=P("pTaban"), tavan=P("pTavan"), asg=P("pAsg");
    var base=gross;
    if(taban>0)base=Math.max(base,taban);
    if(tavan>0)base=Math.min(base,tavan);
    var sgk=base*P("pSgk")/100, iss=base*P("pIss")/100;
    var gvm=gross-sgk-iss;
    var gv=taxOn(cum+gvm)-taxOn(cum);
    var exGv=0;
    if(asg>0){
      var aB=asg, aSgk=aB*P("pSgk")/100, aIss=aB*P("pIss")/100;
      var aGvm=aB-aSgk-aIss;
      exGv=Math.min(gv,taxOn(cum+Math.min(aGvm,gvm))-taxOn(cum));
      if(exGv<0)exGv=0;
    }
    var dmgR=P("pDmg")/1000;
    var dmg=gross*dmgR;
    var exDmg=asg>0?Math.min(dmg,asg*dmgR):0;
    var net=gross-sgk-iss-(gv-exGv)-(dmg-exDmg);
    return {gross:gross,base:base,sgk:sgk,iss:iss,gvm:gvm,gv:gv,exGv:exGv,dmg:dmg,exDmg:exDmg,net:net,newCum:cum+gvm};
  }
  function showPayroll(target,p){
    rows(target,[
      {k:L("rGross"),v:f2(p.gross)},
      {k:L("rSgk")+" ("+P("pSgk")+"%)",v:"-"+f2(p.sgk),neg:1},
      {k:L("rIss")+" ("+P("pIss")+"%)",v:"-"+f2(p.iss),neg:1},
      {k:L("rGvm"),v:f2(p.gvm)},
      {k:L("rGv"),v:"-"+f2(p.gv),neg:1},
      p.exGv>0?{k:L("rGvi"),v:"+"+f2(p.exGv)}:null,
      {k:L("rDmg"),v:"-"+f2(p.dmg),neg:1},
      p.exDmg>0?{k:L("rDmgi"),v:"+"+f2(p.exDmg)}:null,
      {k:L("rNet"),v:f2(p.net),tot:1},
      {k:L("rCum"),v:f2(p.newCum)}
    ]);
  }


  function yearTable(gross,cum0){
    var box=el("s_year"); if(!box)return;
    if(gross<=0){box.innerHTML="";return;}
    var M=lang==="tr"?["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"]
                     :["January","February","March","April","May","June","July","August","September","October","November","December"];
    var H=lang==="tr"?["Ay","Brüt","SGK + işsizlik","GV matrahı","Kümülatif","Gelir vergisi","Damga","Net"]
                     :["Month","Gross","SS + unemp.","Tax base","Cumulative","Income tax","Stamp","Net"];
    var cum=cum0, T={g:0,s:0,m:0,gv:0,d:0,n:0}, h='<table class="ytab"><thead><tr>';
    H.forEach(function(x){h+="<th>"+x+"</th>";}); h+="</tr></thead><tbody>";
    for(var i=0;i<12;i++){
      var p=payroll(gross,cum), gvNet=p.gv-p.exGv, dNet=p.dmg-p.exDmg;
      h+="<tr><td>"+M[i]+"</td><td>"+f2(p.gross)+'</td><td class="neg">'+f2(p.sgk+p.iss)+"</td><td>"+f2(p.gvm)+"</td><td>"+f2(p.newCum)+'</td><td class="neg">'+f2(gvNet)+'</td><td class="neg">'+f2(dNet)+'</td><td class="net">'+f2(p.net)+"</td></tr>";
      T.g+=p.gross;T.s+=p.sgk+p.iss;T.m+=p.gvm;T.gv+=gvNet;T.d+=dNet;T.n+=p.net;cum=p.newCum;
    }
    h+='<tr class="tot"><td>'+(lang==="tr"?"Yıllık toplam":"Annual total")+"</td><td>"+f2(T.g)+'</td><td class="neg">'+f2(T.s)+"</td><td>"+f2(T.m)+"</td><td>—</td><td class=\"neg\">"+f2(T.gv)+'</td><td class="neg">'+f2(T.d)+'</td><td class="net">'+f2(T.n)+"</td></tr></tbody></table>";
    box.innerHTML=h;
  }

  function calcG2N(){
    var g=num(el("s_gross").value), c0=num(el("s_cum").value);
    if(g<=0){el("s_res").innerHTML="";yearTable(0,0);return;}
    showPayroll("s_res",payroll(g,c0));
    yearTable(g,c0);
  }
  function calcN2G(){
    var want=num(el("n_net").value), cum=num(el("n_cum").value);
    if(want<=0){el("n_res").innerHTML="";return;}
    var lo=want, hi=want*3+10000, g=want;
    for(var i=0;i<60;i++){
      g=(lo+hi)/2;
      var n=payroll(g,cum).net;
      if(n<want)lo=g;else hi=g;
    }
    var p=payroll(Math.round(g*100)/100,cum);
    showPayroll("n_res",p);
  }

  /* ---- severance ---- */

  /* kidem tavani: cikis tarihine gore donem secimi (Hazine ve Maliye Bakanligi genelgeleri) */
  var KIDEM_TAVAN=[
    {from:"2026-01-01",to:"2026-06-30",v:64948.77},
    {from:"2026-07-01",to:"2026-12-31",v:73729.87}
  ];
  function tavanFor(dateStr){
    for(var i=0;i<KIDEM_TAVAN.length;i++){
      var t=KIDEM_TAVAN[i];
      if(dateStr>=t.from&&dateStr<=t.to)return t;
    }
    return null;
  }

  function noticeWeeks(days){
    if(days<182)return 2;
    if(days<547)return 4;
    if(days<1095)return 6;
    return 8;
  }
  function calcKidem(){
    var a=el("k_start").value, b=el("k_end").value, base=num(el("k_wage").value);
    if(!a||!b||base<=0){el("k_res").innerHTML="";return;}
    var aBonus=num(el("k_bonus").value)/12, aPrim=num(el("k_prim").value), aMeal=num(el("k_meal").value),
        aTr=num(el("k_transport").value), aOth=num(el("k_other").value);
    var adds=aBonus+aPrim+aMeal+aTr+aOth;
    var w=base+adds;
    var d1=new Date(a), d2=new Date(b);
    var days=Math.round((d2-d1)/86400000);
    if(!(days>0)){el("k_res").innerHTML="";return;}
    var tp=tavanFor(b), tav=tp?tp.v:P("pKidTavan"), dmgR=P("pDmg")/1000;
    var capped=tav>0&&w>tav;
    var basePer=capped?tav:w;
    var kid=basePer*days/365;
    var kidNet=kid-kid*dmgR;
    var wk=noticeWeeks(days);
    var ihb=w/30*7*wk;
    var topRate=num(BR[BR.length-1].r)/100;
    var ihbNet=ihb-ihb*topRate-ihb*dmgR;
    rows("k_res",[
      {k:L("rBase"),v:f2(base)},
      aBonus>0?{k:L("rBonus"),v:"+"+f2(aBonus)}:null,
      aPrim>0?{k:L("rPrim"),v:"+"+f2(aPrim)}:null,
      aMeal>0?{k:L("rMeal"),v:"+"+f2(aMeal)}:null,
      aTr>0?{k:L("rTr"),v:"+"+f2(aTr)}:null,
      aOth>0?{k:L("rOth"),v:"+"+f2(aOth)}:null,
      {k:L("rGiy"),v:f2(w),tot:1},
      tav>0?{k:L("rTavan")+(tp?" ("+tp.from.slice(8,10)+"."+tp.from.slice(5,7)+"."+tp.from.slice(0,4)+" – "+tp.to.slice(8,10)+"."+tp.to.slice(5,7)+"."+tp.to.slice(0,4)+")":""),v:f2(tav)}:null,
      capped?{k:L("rCap"),v:f2(tav),neg:1}:null,
      tav<=0?{k:L("rNoCap"),v:"—"}:null,
      {k:L("rSen"),v:Math.floor(days/365)+" "+L("yrs")+" "+Math.floor((days%365)/30)+" "+L("mos")+" "+days%365%30+" "+L("dys")},
      {k:L("rKid"),v:f2(kid)},
      {k:L("rKidN"),v:f2(kidNet),tot:1},
      {k:L("rNotW"),v:wk+" "+L("wks")},
      {k:L("rIhb"),v:f2(ihb)},
      {k:L("rIhbN"),v:f2(ihbNet)}
    ]);
  }

  /* ---- surcharge ---- */
  function calcGec(){
    var a=el("g_due").value, b=el("g_pay").value, amt=num(el("g_amt").value), r=P("pGec");
    if(!a||!b||amt<=0){el("g_res").innerHTML="";return;}
    var d1=new Date(a), d2=new Date(b);
    var days=Math.round((d2-d1)/86400000);
    if(days<=0){el("g_res").innerHTML="";return;}
    var months=0, cur=new Date(d1);
    while(true){
      var nx=new Date(cur); nx.setMonth(nx.getMonth()+1);
      if(nx<=d2){months++;cur=nx;}else break;
    }
    var restDays=Math.round((d2-cur)/86400000);
    var sur=amt*(months*r/100)+amt*(r/100/30)*restDays;
    rows("g_res",[
      {k:L("rDays"),v:days+" "+L("dys")},
      {k:L("rMon"),v:months+" "+L("mos")+" + "+restDays+" "+L("dys")},
      {k:L("rRate"),v:"%"+r+" / "+L("mos")},
      {k:L("rSur"),v:f2(sur)},
      {k:L("rTot"),v:f2(amt+sur),tot:1}
    ]);
  }

  /* ---- deadline ---- */
  var DKINDS=[30,30,30,15,7];
  function calcDl(){
    var a=el("d_start").value, k=+el("d_kind").value;
    if(!a){el("d_res").innerHTML="";return;}
    var n=DKINDS[k]||30;
    var d=new Date(a); d.setDate(d.getDate()+n);
    var raw=new Date(d);
    var hol={};
    (el("d_hol").value||"").split(",").forEach(function(x){
      x=x.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(x))hol[x]=1;
    });
    function iso(x){return x.toISOString().slice(0,10);}
    var moved=false, guard=0;
    while((d.getDay()===0||d.getDay()===6||hol[iso(d)])&&guard<30){d.setDate(d.getDate()+1);moved=true;guard++;}
    rows("d_res",[
      {k:L("rEnd"),v:iso(raw)+" ("+n+" "+L("dys")+")"},
      moved?{k:L("rShift"),v:iso(d),tot:1}:{k:L("rNoShift"),v:iso(d),tot:1}
    ]);
  }

  /* ---- depreciation ---- */
  function calcAmo(){
    var c=num(el("a_cost").value), life=num(el("a_life").value), m=+el("a_method").value, mo=num(el("a_months").value)||12;
    if(c<=0||life<=0){el("a_res").innerHTML="";return;}
    var r=1/life;
    if(m===1)r=Math.min(r*2,0.5);
    var y1=c*r*(Math.min(mo,12)/12);
    var y2=m===1?(c-y1)*r:c*r;
    rows("a_res",[
      {k:L("rRate"),v:"%"+(r*100).toFixed(2).replace(".",",")},
      {k:L("rY1"),v:f2(y1)},
      {k:L("rY2"),v:f2(y2)},
      {k:L("rTotDep"),v:f2(c),tot:1}
    ]);
  }

  /* ---- working capital ---- */
  function calcWc(){
    var s=num(el("w_sales").value), cg=num(el("w_cogs").value),
        ar=num(el("w_ar").value), inv=num(el("w_inv").value), ap=num(el("w_ap").value);
    if(s<=0||cg<=0){el("w_res").innerHTML="";return;}
    var dAr=ar/s*365, dInv=inv/cg*365, dAp=ap/cg*365;
    var ccc=dAr+dInv-dAp;
    var wc=cg/365*ccc;
    rows("w_res",[
      {k:L("rAr"),v:f0(dAr)+" "+L("dys")},
      {k:L("rInv"),v:f0(dInv)+" "+L("dys")},
      {k:L("rAp"),v:"-"+f0(dAp)+" "+L("dys")},
      {k:L("rCcc"),v:f0(ccc)+" "+L("dys"),tot:1},
      {k:L("rWc"),v:f2(wc)}
    ]);
  }

  /* ---- car ---- */
  function calcCar(){
    var n=num(el("b_net").value), vr=num(el("b_vat").value)/100;
    if(n<=0){el("b_res").innerHTML="";return;}
    var ded=n*0.7, kkeg=n*0.3, vat=n*vr;
    rows("b_res",[
      {k:L("rDed"),v:f2(ded)},
      {k:L("rKkeg"),v:f2(kkeg),neg:1},
      {k:L("rVatD"),v:f2(vat*0.7)},
      {k:L("rVatN"),v:f2(vat*0.3),neg:1},
      {k:L("rCost"),v:f2(n+vat),tot:1}
    ]);
  }

  function runAll(){calcG2N();calcN2G();calcKidem();calcGec();calcDl();calcAmo();calcWc();calcCar();}

  ["s_gross","s_cum","n_net","n_cum","k_start","k_end","k_wage","k_bonus","k_prim","k_meal","k_transport","k_other","g_due","g_pay","g_amt",
   "d_start","d_kind","d_hol","a_cost","a_life","a_method","a_months",
   "w_sales","w_cogs","w_ar","w_inv","w_ap","b_net","b_vat"].concat(PIDS).forEach(function(id){
    var e=el(id);if(e)e.addEventListener("input",runAll);
    if(e&&e.tagName==="SELECT")e.addEventListener("change",runAll);
  });
  el("save").addEventListener("click",saveP);
  el("reset").addEventListener("click",function(){
    try{localStorage.removeItem("mg-params");}catch(e){}
    PIDS.forEach(function(i){if(i!=="pYear")el(i).value="";});
    el("pSgk").value="14";el("pIss").value="1";el("pDmg").value="7.59";
    el("pAsg").value="33.030";el("pTaban").value="33.030";el("pTavan").value="247.725";el("pGec").value="4,5";
    BR=[{up:"198000",r:15},{up:"414000",r:20},{up:"1500000",r:27},{up:"7300000",r:35},{up:"",r:40}];
    drawBrackets();runAll();
  });

  function fillSelects(){
    var d=el("d_kind");d.innerHTML="";
    UI.dOpts.forEach(function(o,i){
      var op=document.createElement("option");op.value=i;op.textContent=o[lang==="tr"?1:0];d.appendChild(op);
    });
    var m=el("a_method"),cur=m.value;m.innerHTML="";
    UI.mOpts.forEach(function(o,i){
      var op=document.createElement("option");op.value=i;op.textContent=o[lang==="tr"?1:0];m.appendChild(op);
    });
    if(cur)m.value=cur;
  }


  /* ---- tek hesaplayici goster ---- */
  var cards=[].slice.call(document.querySelectorAll(".cards .card")), cnav=el("calcnav"), curCalc=0;
  try{curCalc=parseInt(localStorage.getItem("mg-calc")||"0",10)||0;}catch(e){}
  function showCalc(i){
    curCalc=i;
    cards.forEach(function(c,k){c.hidden=(k!==i);});
    [].forEach.call(cnav.children,function(b,k){b.setAttribute("aria-pressed",k===i?"true":"false");});
    try{localStorage.setItem("mg-calc",String(i));}catch(e){}
  }
  function buildCalcNav(){
    if(!cnav)return;
    cnav.innerHTML="";
    cards.forEach(function(c,k){
      var b=document.createElement("button");b.type="button";b.setAttribute("role","tab");
      b.textContent=c.querySelector("h3").textContent;
      b.addEventListener("click",function(){showCalc(k);});
      cnav.appendChild(b);
    });
    showCalc(Math.min(curCalc,cards.length-1));
  }

  function applyLang(l){
    document.title=(l==="tr")?'Hesaplamalar — MG Consulting':'Calculations — MG Consulting';
    lang=l;
    ["kick","h1","intro","utilLabel","parH","parD","bh1","bh2",
     "pp1","pp2","pp3","pp4","pp5","pp6","pp7","pp8","pp9",
     "c1h","c1s","c1a","c1b","c1y","c1n","c2h","c2s","c2a","c2b","c2n",
     "c3h","c3s","c3a","c3b","c3c","c3add","c3d","c3p","c3e","c3f","c3g","c3n","c4h","c4s","c4a","c4b","c4c","c4n",
     "c5h","c5s","c5a","c5b","c5c","c5n","c6h","c6s","c6a","c6b","c6c","c6d","c6n",
     "c7h","c7s","c7a","c7b","c7c","c7d","c7e","c7n","c8h","c8s","c8a","c8b","c8n","parNote"].forEach(function(id){
      var e=el(id);if(e)e.textContent=L(id);
    });
    el("save").textContent=L("save");
    el("reset").textContent=L("reset");
    el("f1").innerHTML=L("f1");
    el("f2").innerHTML=L("f2");
    el("btnEN").setAttribute("aria-pressed",l==="en"?"true":"false");
    el("btnTR").setAttribute("aria-pressed",l==="tr"?"true":"false");
    root.setAttribute("lang",l);
    fillSelects();buildCalcNav();runAll();
  }
  el("btnTR").addEventListener("click",function(){location.hash="tr";applyLang("tr");});
  el("btnEN").addEventListener("click",function(){location.hash="en";applyLang("en");});
  window.addEventListener("hashchange",function(){
    var h=location.hash.replace("#","").toLowerCase();
    if(h==="tr")applyLang("tr"); else if(h==="en")applyLang("en");
  });

  drawBrackets();
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