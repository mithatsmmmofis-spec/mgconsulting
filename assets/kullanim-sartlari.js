(function(){
  var root=document.documentElement;
  try{var s=localStorage.getItem("mg-theme");root.setAttribute("data-theme",s||"light");}catch(e){root.setAttribute("data-theme","light");}
  document.getElementById("themeBtn").addEventListener("click",function(){
    var c=root.getAttribute("data-theme");
    var d=c?c==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
    var n=d?"light":"dark";root.setAttribute("data-theme",n);
    try{localStorage.setItem("mg-theme",n);}catch(e){}
  });
  var nodes=[].slice.call(document.querySelectorAll("[data-tr]"));
  nodes.forEach(function(n){n.setAttribute("data-en",n.textContent);});
  var bEN=document.getElementById("btnEN"),bTR=document.getElementById("btnTR");
  function apply(l){
    nodes.forEach(function(n){
      var v=l==="tr"?n.getAttribute("data-tr"):n.getAttribute("data-en");
      if(v!=null)n.textContent=v;
    });
    bEN.setAttribute("aria-pressed",l==="en"?"true":"false");
    bTR.setAttribute("aria-pressed",l==="tr"?"true":"false");
    root.setAttribute("lang",l);
  }
  bTR.addEventListener("click",function(){location.hash="tr";apply("tr");});
  bEN.addEventListener("click",function(){location.hash="en";apply("en");});
  window.addEventListener("hashchange",function(){
    var h=location.hash.replace("#","").toLowerCase();
    if(h==="tr")apply("tr");else if(h==="en")apply("en");
  });
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