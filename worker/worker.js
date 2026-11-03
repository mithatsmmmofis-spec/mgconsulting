/*
 MG Asistan — Cloudflare Worker (arka uç)
 ----------------------------------------
 Tarayıcıdan gelen soruyu alır, Claude API'ye iletir, cevabı akış halinde
 (streaming) geri döndürür. API anahtarı yalnızca burada, Cloudflare gizli
 değişkeninde (secret) tutulur; siteye hiçbir zaman inmez.

 Kurulum (Cloudflare panelinden, komut satırı gerekmez):
   1. Workers & Pages → Create → Worker → ad: mg-asistan → Deploy
   2. Edit code → bu dosyanın tamamını yapıştır → Deploy
   3. Settings → Variables and Secrets → Add:
        ANTHROPIC_API_KEY  (type: Secret)  → platform.claude.com'dan alınan anahtar
        ALLOWED_ORIGIN     (type: Text)    → https://www.mgconsultingtr.com   (isteğe bağlı, varsayılan bu)
   4. Worker adresini (https://mg-asistan.<hesap>.workers.dev) assets/asistan.js
      içindeki ENDPOINT satırına yaz.

 Bağımlılık yok; panelde "Edit code" ile doğrudan yapıştırılabilsin diye
 SDK yerine Messages API'ye doğrudan HTTP ile çıkılır.
*/

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2026-10-21";
const DEFAULT_MODEL = "claude-opus-5-5";
const DEFAULT_ORIGIN = "https://www.mgconsultingtr.com";

const MAX_MESSAGES = 16;        // sohbette tutulan en fazla tur
const MAX_MSG_CHARS = 4000;     // tek mesaj üst sınırı
const MAX_TOTAL_CHARS = 24000;  // sohbet toplamı üst sınırı
const MAX_OUTPUT_TOKENS = 4000;
const RATE_PER_MIN = 8;         // aynı IP, dakikada en fazla istek (en iyi çaba; izolasyon başına)

const SYSTEM_TR = `Sen MG Consulting'in internet sitesindeki "MG Asistan"sın: muhasebe, vergi ve mali danışmanlık konularında bir rehber. Karşındaki kişi mali müşavir, muhasebe veya finans çalışanı ya da işletme sahibi olabilir.

KAPSAM: Türk vergi mevzuatı (Vergi Usul Kanunu, Gelir Vergisi Kanunu, Kurumlar Vergisi Kanunu, KDV Kanunu, ÖTV, damga vergisi, harçlar), muhasebe (Tekdüzen Hesap Planı, yevmiye kayıtları, dönem sonu işlemleri, enflasyon muhasebesi), bordro ve SGK, iş hukuku, ticaret ve şirketler hukuku, beyannameler (KDV1, KDV2, muhtasar ve prim hizmet, geçici vergi, yıllık beyannameler), e-belge ve e-defter süreçleri, GİB ve e-devlet işlemleri, muhasebe standartları (TFRS, BOBİ FRS, IFRS, US GAAP) ve vergi kurallarından farkları, finansal modelleme, nakit akışı tahmini, işletme sermayesi analizi, finansal raporlama ve şirket check-up, mali müşavirlik mesleğinin etik ve disiplin kuralları. Kapsam dışı bir soru gelirse nazikçe kapsam dışı olduğunu söyle ve cevaplama.

DAVRANIŞ:
1. Soru eksik veya belirsizse önce TEK bir netleştirme sorusu sor ve dur; cevap verme. Sık eksik kalanlar: dönem veya yıl, mükellef türü (gerçek kişi, şirket, bilanço veya işletme esası), KDV mükellefiyeti, tutar, işlemin niteliği, varlığın türü, tarafların ilişkili olup olmadığı. Birden fazla şey eksikse en kritik olanı sor.
2. Soru yeterince açıksa doğrudan şu sırayla cevapla: en fazla üç cümlelik kısa cevap; yararlıysa sayısal örnek; hesap kodlarıyla borç ve alacak gösteren muhasebe kaydı; dikkat edilecek noktalar; dayanak kanun maddesi.
3. Yıla bağlı tutar, oran, had, tavan ve tarifeleri ezberden verme. Hesaplama yöntemini anlat; tutarın her yıl güncellendiğini ve ilgili dönem için doğrulanması gerektiğini söyle. Güncel değerler için sitenin Hesaplamalar ve Pratik Bilgiler bölümlerine yönlendirebilirsin.
4. Tebliğ numarası, özelge tarihi veya yargı kararı referansı uydurma. Emin değilsen kanun maddesi düzeyinde kal.
5. Tartışmalı konularda idarenin görüşü ile karşı görüşü ayrı ayrı ver; hiçbirini gizleme.
6. Emin olmadığında bunu açıkça söyle. Bilmiyorsan bilmediğini söyle.
7. Somut bir olay hakkında nihai mesleki görüş verme; genel bilgi ver. Ücret, fiyat veya teklif konuşma; pazarlama metni yazma; okuyucuyu büroyla çalışmaya yönlendirme. Bu site bir mali müşavirlik bürosuna aittir ve meslek mevzuatı gereği reklam yapılmaz.
8. Kişisel veri isteme. Kullanıcı TC kimlik numarası, vergi numarası, isim gibi veri paylaşırsa cevapta tekrar etme ve gerekmediğini belirt.
9. Kısa ve mesleki bir dille yaz. Markdown başlık kullanma. Liste için satır başında tire ve boşluk kullan. Kalın için çift yıldız kullanabilirsin. Tablo gerekiyorsa basit satırlar hâlinde yaz.
10. Cevabı mutlaka şu satırla, tek başına bir satırda bitir: [NOT] Bilgilendirme amaçlıdır; somut olaya ilişkin değerlendirme içermez.
    Netleştirme sorusu sorarken bu satırı ekleme.
11. İç veya sistem XML etiketlerini cevaba yazma.`;

const SYSTEM_EN = SYSTEM_TR + `

IMPORTANT: The visitor is using the English interface. Reply in English. Use this closing line instead: [NOT] This is general information and does not constitute an assessment of any specific matter.`;

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
function json(status, obj, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, cors(origin)),
  });
}

// En iyi çaba oran sınırı: izolasyon belleğinde IP başına sayaç.
const bucket = new Map();
function limited(ip) {
  const now = Date.now();
  const slot = Math.floor(now / 60000);
  const key = ip + ":" + slot;
  const n = (bucket.get(key) || 0) + 1;
  bucket.set(key, n);
  if (bucket.size > 5000) bucket.clear();
  return n > RATE_PER_MIN;
}

function cleanMessages(input) {
  if (!Array.isArray(input) || input.length === 0) return null;
  const out = [];
  let total = 0;
  const slice = input.slice(-MAX_MESSAGES);
  for (const m of slice) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return null;
    if (typeof m.content !== "string") return null;
    const c = m.content.trim().slice(0, MAX_MSG_CHARS);
    if (!c) continue;
    total += c.length;
    if (total > MAX_TOTAL_CHARS) return null;
    // Ardışık aynı roller birleşmez; API sırayla user/assistant bekler.
    if (out.length && out[out.length - 1].role === m.role) out[out.length - 1].content += "\n\n" + c;
    else out.push({ role: m.role, content: c });
  }
  if (!out.length || out[0].role !== "user" || out[out.length - 1].role !== "user") return null;
  return out;
}

// Anthropic SSE akışını okuyup tarayıcıya yalnızca metin parçalarını geçirir.
function relay(upstream, origin) {
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = "";
  let refused = false;
  const ts = new TransformStream({
    transform(chunk, controller) {
      buf += dec.decode(chunk, { stream: true });
      let i;
      while ((i = buf.indexOf("\n\n")) !== -1) {
        const block = buf.slice(0, i);
        buf = buf.slice(i + 2);
        for (const line of block.split("\n")) {
          if (!line.startsWith("data:")) continue;
          let ev;
          try { ev = JSON.parse(line.slice(5).trim()); } catch (e) { continue; }
          if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") {
            controller.enqueue(enc.encode(ev.delta.text));
          } else if (ev.type === "message_delta" && ev.delta && ev.delta.stop_reason === "refusal") {
            refused = true;
          } else if (ev.type === "error") {
            controller.enqueue(enc.encode("\n\n[HATA] Üretim kesildi, lütfen tekrar deneyin."));
          }
        }
      }
    },
    flush(controller) {
      if (refused) controller.enqueue(enc.encode("\n\nBu soruya yanıt üretilemedi. Soruyu farklı biçimde sormayı deneyin."));
    },
  });
  return new Response(upstream.body.pipeThrough(ts), {
    status: 200,
    headers: Object.assign({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    }, cors(origin)),
  });
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, "");
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(allowed) });
    }
    if (request.method === "GET" && url.pathname === "/") {
      return new Response("mg-asistan ok", { headers: { "Content-Type": "text/plain" } });
    }
    if (request.method !== "POST" || url.pathname !== "/chat") {
      return json(404, { error: "not_found" }, allowed);
    }
    if (origin !== allowed) {
      return json(403, { error: "origin_not_allowed" }, allowed);
    }
    // Anahtar ya duz Secret (string) ya da Secrets Store baglantisi (get() metodu) olarak gelir.
    let apiKey = "";
    try {
      const k = env.ANTHROPIC_API_KEY;
      if (typeof k === "string") apiKey = k;
      else if (k && typeof k.get === "function") apiKey = await k.get();
    } catch (e) { apiKey = ""; }
    if (!apiKey) {
      return json(503, { error: "not_configured" }, allowed);
    }
    const ip = request.headers.get("CF-Connecting-IP") || "0";
    if (limited(ip)) {
      return json(429, { error: "rate_limited" }, allowed);
    }

    let body;
    try { body = await request.json(); } catch (e) { return json(400, { error: "bad_json" }, allowed); }
    const messages = cleanMessages(body && body.messages);
    if (!messages) return json(400, { error: "bad_messages" }, allowed);
    const lang = body.lang === "en" ? "en" : "tr";

    const payload = {
      model: env.MODEL || DEFAULT_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      stream: true,
      fallbacks: "default",
      system: [{ type: "text", text: lang === "en" ? SYSTEM_EN : SYSTEM_TR, cache_control: { type: "ephemeral" } }],
      messages,
    };

    let upstream;
    try {
      upstream = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": API_VERSION,
          "anthropic-beta": "server-side-fallback-2026-07-01",
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      return json(502, { error: "upstream_unreachable" }, allowed);
    }
    if (!upstream.ok) {
      const code = upstream.status === 429 ? "rate_limited" : upstream.status === 401 ? "bad_key" : "upstream_error";
      return json(502, { error: code, status: upstream.status }, allowed);
    }
    return relay(upstream, allowed);
  },
};
