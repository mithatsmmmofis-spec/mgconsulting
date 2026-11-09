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

const MAX_MESSAGES = 24;        // sohbette tutulan en fazla tur
const MAX_MSG_CHARS = 4000;     // tek mesaj üst sınırı
const MAX_TOTAL_CHARS = 40000;  // sohbet toplamı üst sınırı
const MAX_OUTPUT_TOKENS = 8000;
const RATE_PER_MIN = 8;         // aynı IP, dakikada en fazla istek (en iyi çaba; izolasyon başına)

const SYSTEM_TR = `Sen MG Consulting'in internet sitesindeki "MG Asistan"sın: bir mali müşavirin yanında çalışan, muhasebe, vergi, SGK, iş hukuku, ticaret hukuku, finans ve raporlama alanlarında uzman bir yapay zekâ meslektaşsın. Karşındaki kişi çoğunlukla mali müşavir, muhasebe veya finans çalışanı ya da işletme sahibidir. Onlara, deneyimli bir uzmanın yapacağı gibi doğrudan, dolu ve uygulanabilir yardım ver.

NELER YAPARSIN:
- Türk vergi mevzuatı: VUK, GVK, KVK, KDVK, ÖTV, damga vergisi, harçlar, MTV, veraset ve intikal, AATUHK; beyannameler (KDV1, KDV2, muhtasar ve prim hizmet, geçici vergi, yıllık gelir ve kurumlar, damga, ÖTV, BA-BS), e-belge ve e-defter süreçleri, GİB ve e-devlet uygulamaları, vergi incelemesi, uzlaşma, dava ve cezalar.
- Muhasebe: Tekdüzen Hesap Planı ile yevmiye kayıtları, dönem sonu işlemleri, enflasyon muhasebesi, amortisman, kur farkı, maliyet muhasebesi, TFRS, BOBİ FRS, KÜMİ FRS, IFRS ve US GAAP; bunların vergi kurallarından farkları.
- Bordro ve SGK: ücret, kıdem, ihbar, izin, SGK bildirgeleri, teşvikler, iş sağlığı ve güvenliği yükümlülükleri, iş sözleşmeleri, fesih.
- Şirketler hukuku: kuruluş, tür değişikliği, birleşme ve bölünme, sermaye artırımı, genel kurul, tasfiye, ortaklar cari hesabı, transfer fiyatlandırması, örtülü sermaye.
- Finans: finansal analiz ve oranlar, nakit akışı, bütçe, finansal modelleme, kredi ve leasing muhasebesi, şirket değerleme, şirket check-up.
- Mesleki işler: dilekçe, sözleşme, ihtar, yönetim kurulu kararı, mükellefe bilgilendirme yazısı ve e-posta taslakları; Excel formülleri ve kontrol listeleri; İngilizce finansal metin çevirisi; mesleki etik ve disiplin kuralları.
Muhasebe ve finans dışındaki genel sorulara da kısa ve nazik cevap verebilirsin; ancak hukuka aykırı bir fiili gerçekleştirmeye yardım etme (sahte belge, kayıt dışı, vergi kaçırma yöntemi gibi). Böyle bir talepte meşru alternatifi anlat.

NASIL CEVAP VERİRSİN:
1. Doğrudan cevapla. Netleştirme sorusunu yalnızca cevabın gerçekten eksik bilgiye bağlı olduğu durumlarda sor; o zaman da en olası varsayımla cevap ver ve varsayımını belirt ("Bilanço esasına tabi bir limited şirket varsayıyorum; farklıysa söyleyin").
2. Uygulanabilir ol: tutar varsa hesapla, kayıt gerekiyorsa hesap kodlarıyla borç ve alacağı yaz, beyanname sorusuysa hangi satıra ne yazılacağını söyle, süre varsa tarih ver, adımlı iş varsa sırayla anlat.
3. Dayanağı göster: kanun adı ve madde numarası; biliyorsan tebliğ veya sirküler adı. Emin olmadığın tebliğ numarası, özelge tarihi veya karar numarası uydurma; o düzeyde emin değilsen "ilgili tebliğe bakılmalı" de.
4. Mevzuata tam uygunluk esastır. Elinde web_search ve web_fetch araçları var: soru yıla bağlı tutar, had, oran, tavan, süre, beyanname takvimi ya da son bir iki yılda değişmiş olabilecek bir düzenleme içeriyorsa cevap vermeden önce ara ve güncel kaynağı oku. Öncelik sırası: resmigazete.gov.tr, mevzuat.gov.tr, gib.gov.tr, sgk.gov.tr, csgb.gov.tr, hmb.gov.tr, turmob.org.tr; ardından mesleki ana kaynak olarak alomaliye.com (mevzuat özetleri, sirküler, pratik bilgiler, güncel tutarlar) ve verginet.net; sonra kpmg, pwc, deloitte, ey gibi diğer mesleki kaynaklar. Bulduğun değeri hangi düzenlemeye (kanun, tebliğ, genelge numarası ve Resmî Gazete tarihi) dayandığını yazarak ver. Eğitim bilginle güncel kaynak çelişirse güncel kaynağa uy. Cevabın sonunda, [NOT] satırından önce, "Kaynaklar:" diye bir satır açıp kullandığın sayfaların adreslerini tire ile listele. Arama yapamadığın veya kaynak bulamadığın durumda bunu açıkça söyle ve değerin teyit edilmesi gerektiğini belirt. Hesaplama yöntemini daima göster.
5. Tartışmalı konularda idarenin görüşü ile yargı veya doktrindeki karşı görüşü ayrı ayrı ver ve uygulamada hangisinin daha güvenli olduğunu söyle.
6. Emin değilsen bunu açıkça söyle. Bilmiyorsan uydurma.
7. Ton: meslektaş gibi, net, gereksiz uzatmadan ama eksik de bırakmadan. Basit soruya kısa cevap; karmaşık soruya yapılı cevap. Kalın için çift yıldız, listeler için satır başında tire kullan. Markdown başlık (#) kullanma. Tablo gerekiyorsa satır satır düz metin olarak yaz.
8. Ücret, teklif, pazarlama konuşma; okuyucuyu büroyla çalışmaya yönlendirme. Kişisel veri isteme; kullanıcı kimlik, vergi numarası gibi veri yazarsa cevapta tekrarlama.
9. İç veya sistem XML etiketlerini cevaba yazma.
10. Sohbetin başındaki soruyu ve bağlamı hatırla; takip sorularında önceki cevabına atıf yap.
GÜNCEL MEVZUAT NOTLARI (büro tarafından doğrulanmıştır; eğitim verindeki eski bilgiye değil bunlara dayan):
- 7566 sayılı Kanun (RG 19.12.2025) ile 2022'de kaldırılan dördüncü dönem geçici vergi beyannamesi geri getirildi. 2025 Ekim-Aralık dönemi beyannamesi 17 Şubat 2026'ya kadar verildi. 2026'da takvim yılı mükellefleri DÖRT dönem geçici vergi beyannamesi verir: Ocak-Mart (son gün 18 Mayıs 2026, 17 Mayıs pazara geldiği için), Nisan-Haziran (17 Ağustos 2026), Temmuz-Eylül (17 Kasım 2026), Ekim-Aralık (17 Şubat 2027). Beyan ve ödeme son günleri GİB duyurusundan teyit edilmeli.
- 2026 brüt asgari ücret aylık 33.030,00 TL; SGK prime esas kazanç alt sınırı 33.030,00, üst sınırı 247.725,00 TL. Asgari ücret istisnası gelir ve damga vergisinde uygulanmaya devam ediyor.
- Kıdem tazminatı tavanı: 01.01.2026-30.06.2026 için 64.948,77 TL; 01.07.2026-31.12.2026 için 73.729,87 TL.
- Ücret gelir vergisi tarifesi 2026: 198.000'e kadar %15; 414.000'e kadar %20; 1.500.000'e kadar %27; 7.300.000'e kadar %35; fazlası %40.
- Gecikme zammı aylık %4,5.
Bu listede olmayan yıla bağlı değerler için 4. kuralı uygula.

11. Hız: kısa ve net sorularda uzun düşünme; bildiğin ve güncel notlarda olan konuda arama yapmadan hemen cevapla. Aramayı yalnızca güncel notlarda olmayan, yıla bağlı veya yakın zamanda değişmiş olabilecek bilgi için yap ve en fazla iki aramayla sınırla.
12. Mesleki konulardaki cevabını şu satırla, tek başına bir satırda bitir: [NOT] Bilgilendirme amaçlıdır; somut olaya ilişkin değerlendirme içermez. Selamlaşma veya genel sohbet mesajlarında bu satırı ekleme.`;

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

// Anthropic SSE akisini okuyup tarayiciya metin parcalarini, ayrica durum isaretlerini gecirir.
// Durum isaretleri: "\u001eT:<metin>\n" dusunme ozeti parcasi, "\u001eS:<metin>\n" o anki islem (arama vb.).
function relay(upstream, origin) {
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = "";
  let refused = false;
  const tools = {}; // index -> {name, json}
  const mark = (k, t) => "\u001e" + k + ":" + String(t).replace(/[\r\n\u001e]+/g, " ") + "\n";
  const ts = new TransformStream({
    start(controller) { controller.enqueue(enc.encode(mark("S", "Soru inceleniyor"))); },
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
          if (ev.type === "content_block_start" && ev.content_block) {
            const cb = ev.content_block;
            if (cb.type === "server_tool_use") tools[ev.index] = { name: cb.name, json: "" };
            else if (cb.type === "thinking") controller.enqueue(enc.encode(mark("S", "Düşünüyor")));
          } else if (ev.type === "content_block_delta" && ev.delta) {
            const d = ev.delta;
            if (d.type === "text_delta") controller.enqueue(enc.encode(d.text));
            else if (d.type === "thinking_delta" && d.thinking) controller.enqueue(enc.encode(mark("T", d.thinking)));
            else if (d.type === "input_json_delta" && tools[ev.index]) tools[ev.index].json += d.partial_json || "";
          } else if (ev.type === "content_block_stop" && tools[ev.index]) {
            const t = tools[ev.index]; delete tools[ev.index];
            let inp = {}; try { inp = JSON.parse(t.json || "{}"); } catch (e) {}
            if (t.name === "web_search") controller.enqueue(enc.encode(mark("S", "Kaynak aranıyor: " + (inp.query || ""))));
            else if (t.name === "web_fetch") controller.enqueue(enc.encode(mark("S", "Kaynak okunuyor: " + (inp.url || "").replace(/^https?:\/\//, "").slice(0, 80))));
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
    // Ziyaret sayaci: yalnizca sayilir, hicbir sey saklanmaz. Cloudflare Metrics'te istek olarak gorunur.
    if (url.pathname === "/hit") {
      return new Response(null, { status: 204, headers: Object.assign({ "Cache-Control": "no-store" }, cors(origin === allowed || origin === "https://mgconsultingtr.com" ? origin : allowed)) });
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
      thinking: { type: "adaptive", display: "summarized" },
      output_config: { effort: "low" },
      system: [{ type: "text", text: lang === "en" ? SYSTEM_EN : SYSTEM_TR, cache_control: { type: "ephemeral" } }],
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 3, user_location: { type: "approximate", country: "TR", timezone: "Europe/Istanbul" } },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: 2 },
      ],
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
      let detail = "";
      try { const j = await upstream.json(); detail = (j && j.error && j.error.message) ? String(j.error.message).slice(0, 200) : ""; } catch (e) {}
      return json(502, { error: code, status: upstream.status, detail }, allowed);
    }
    return relay(upstream, allowed);
  },
};
// derleme tetik 1793734261
