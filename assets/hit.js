/* Ziyaret sayaci: sayfa yolu Cloudflare Worker'a bir kez bildirilir. Cerez yok, kimlik yok, veri saklanmaz; yalnizca istek sayisi Cloudflare olcumlerinde gorunur. */
(function(){
  try{
    var u="https://mgconsulting.mithat-smmm-ofis.workers.dev/hit?p="+encodeURIComponent(location.pathname)+"&r="+encodeURIComponent((document.referrer||"").split("/").slice(0,3).join("/"));
    if(navigator.sendBeacon){navigator.sendBeacon(u);}else{fetch(u,{method:"POST",keepalive:true,mode:"cors"}).catch(function(){});}
  }catch(e){}
})();
