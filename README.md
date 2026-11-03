# MG Consulting — yayına hazır site paketi

Tek klasör, statik dosyalar. Sunucu tarafı kod yok, veritabanı yok, derleme adımı yok.
Dosyaları olduğu gibi yükleyince site çalışır.

---

## 1. Klasördeki dosyalar

| Dosya | Ne |
|---|---|
| `index.html` | Ana sayfa: çalışma düzeni, hizmetler, şirket check-up, sektörler, takvim ve hesaplama listesi, künye, iletişim |
| `hesaplamalar.html` | Çalışan hesaplayıcılar: bordro (brütten nete, netten brüte), kıdem ve ihbar, gecikme zammı, süre hesabı, amortisman, nakit dönüşüm süresi, binek oto kısıtı |
| `check-up.html` | Mizan yükleyip risk puanlı rapor üreten ön-inceleme aracı |
| `kvkk.html` | Aydınlatma metni ve çerez politikası **(taslak)** |
| `kullanim-sartlari.html` | Site kullanım şartları **(taslak)** |
| `404.html` | Sayfa bulunamadı |
| `favicon.svg` | Sekme simgesi |
| `robots.txt`, `sitemap.xml` | Arama motorları |
| `sonra/` | Henüz yayına girmeyecek sayfalar: pratik bilgiler tabloları, sirküler ve özelge arşivi |

`sonra/` klasörünü **yüklemeyin**. İçerik dolduğunda ana klasöre taşınır.

---

## 2. Yayına alma — Cloudflare Pages (ücretsiz, önerilen)

1. `cloudflare.com` → ücretsiz hesap aç (Google hesabıyla girebilirsin).
2. **Workers & Pages → Create → Pages → Upload assets.**
3. Bu klasördeki dosyaları sürükle bırak (`sonra/` hariç). Proje adı: `mgconsulting`.
4. Yayınla. Geçici bir adres verir, orada kontrol et.
5. **Custom domains → Set up a domain** → `www.mgconsultingtr.com` ve `mgconsultingtr.com`.
6. Cloudflare sana iki **nameserver** verir. GoDaddy'de: **My Products → Domains → DNS → Nameservers → Change → I'll use my own nameservers** → Cloudflare'in verdiği ikisini yaz.
7. 1–24 saat içinde yayılır. HTTPS otomatik gelir, ayrıca SSL satın alman gerekmez.

**Alan adı GoDaddy'de kalır.** Sadece DNS yönetimi Cloudflare'e geçer.

### Alternatif: GoDaddy hosting paketin varsa
cPanel → **File Manager** → `public_html` → dosyaları yükle. SSL'i cPanel'den Let's Encrypt ile aç.

---

## 3. E-posta — info@mgconsultingtr.com

Sitede bu adres yazılı; gerçekten çalışır olması gerekiyor.

**Seçenek A — Zoho Mail ücretsiz (önerilen):** `zoho.com/mail` → Forever Free plan → alan adını doğrula (Cloudflare DNS'ine birkaç kayıt eklersin) → `info@` kutusu açılır. Hem alır hem gönderir.

**Seçenek B — Cloudflare Email Routing (en hızlı):** Cloudflare → **Email → Email Routing** → `info@mgconsultingtr.com` adresine geleni Gmail'ine yönlendir. Beş dakika. Tek eksiği: cevap verirken Gmail adresin görünür.

İkisi birlikte de kullanılabilir: Zoho asıl kutu, Gmail'e yönlendirme.

---

## 4. Yayından önce tamamlanacaklar

### Hukuki
- [ ] `kvkk.html` ve `kullanim-sartlari.html` hukukçuya okutulacak, köşeli parantezli alanlar doldurulacak
- [ ] `kullanim-sartlari.html` madde 09: yetkili mahkeme yazılacak
- [ ] Her iki metne sürüm tarihi yazılacak
- [ ] Veri sorumluları siciline (VERBİS) kayıt gerekip gerekmediği teyit edilecek
- [ ] E-posta bülteni gönderilecekse İYS kaydı ve açık rıza akışı kurulacak

### Meslek mevzuatı
- [ ] Odadan yazılı görüş alınacak: marka adıyla tanıtım, künyede ad-soyad zorunluluğu, içerik imzası, mükellef verisinin yazılım üzerinde işlenmesi
- [ ] Künyeye ruhsat numarası ve bağlı olunan oda yazılacak (`index.html`, Kurumsal bölümü)
- [ ] Hizmet listesi fiilen verilen hizmetlere göre budanacak (`index.html`, Hizmetler bölümü, A–H satırları)
- [ ] Sitede fiyat, kampanya, "ücretsiz danışmanlık", "en iyi/lider/uzman" ifadesi bulunmadığı teyit edilecek — şu an yok, sonradan eklenmemeli

### İçerik
- [ ] `hesaplamalar.html` parametre paneli: asgari ücret, SGK taban-tavan, kıdem tavanı, gelir vergisi dilimleri, gecikme zammı oranı
- [ ] İletişim bilgileri son kontrol
- [ ] `sitemap.xml` ve `robots.txt` içindeki alan adı doğru mu

### Teknik
- [ ] Google Search Console'a site eklenip `sitemap.xml` gönderilecek
- [ ] Telefon numarası sitede açık duruyor; spam gelirse iletişim formuna geçilebilir

---

## 5. Bilinmesi gerekenler

**Asistan bu pakette yok.** Mevzuat asistanı claude.ai altyapısında çalışıyordu; kendi alan adında çalışması için küçük bir arka uç ve API anahtarı gerekiyor, ayrıca her soru maliyet üretiyor. İlk sürüme koymamak bilinçli bir karar.

**Araçlar tamamen tarayıcıda çalışır.** `check-up.html` yüklenen mizanı hiçbir sunucuya göndermez. Bu, meslek sırrı ve kişisel veri açısından sitenin en güçlü yanı; pazarlamada da bu şekilde anlatılmalı.

**Dil.** Site İngilizce açılır, sağ üstten TR seçilir. Gerçek sunucuda `/tr` adresi de kurulabilir; şu an `#tr` ile çalışıyor.

**Tema.** Ziyaretçinin cihaz ayarına göre açık veya koyu açılır, üstten değiştirilebilir.

---

## 6. Güvenlik

Site statiktir: form yok, giriş yok, veritabanı yok, sunucu tarafı kod yok. Saldırı
yüzeyi en baştan dar. Bunun üstüne şunlar eklendi:

**`_headers` dosyası** — Netlify ve Cloudflare Pages bu dosyayı otomatik okur:

| Başlık | Ne yapar |
|---|---|
| `Content-Security-Policy` | Sayfanın yalnızca kendi dosyalarını ve Google Fonts'u yüklemesine izin verir. Dışarıdan kod çalıştırılamaz |
| `Strict-Transport-Security` | Tarayıcıyı bir yıl boyunca yalnızca HTTPS kullanmaya zorlar |
| `X-Frame-Options` / `frame-ancestors` | Sitenin başka bir sayfaya çerçeveyle gömülmesini engeller (tıklama hırsızlığı) |
| `X-Content-Type-Options` | Tarayıcının dosya türünü tahmin etmesini engeller |
| `Referrer-Policy` | Başka siteye geçerken tam adresin sızmasını engeller |
| `Permissions-Policy` | Kamera, mikrofon, konum, ödeme ve sensör erişimini tamamen kapatır |
| `Cross-Origin-*` | Sayfanın başka kaynaklarla izolasyonunu sağlar |

**Satır içi kod kaldırıldı.** Tüm CSS ve JavaScript `assets/` klasörüne taşındı. Bu
sayede `script-src 'self'` uygulanabiliyor; siteye kod enjekte edilse bile çalışmaz.
Hiçbir sayfada satır içi `<script>`, `onclick` veya `javascript:` bağlantısı yoktur —
kontrol edildi.

**HTTPS.** Netlify ve Cloudflare'de otomatik ve ücretsiz gelir. Ayrıca sertifika
satın alınmaz.

**`.well-known/security.txt`** — güvenlik açığı bulan birinin size nasıl ulaşacağını
belirtir. Standart uygulama.

### Geriye kalan iki nokta

1. **Yazı tipleri Google Fonts üzerinden yükleniyor.** Ziyaretçinin IP adresi Google'a
   gidiyor. Kapatmak için yazı tipi dosyaları indirilip `assets/` içine konur ve
   CSS'teki `@import` yerel dosyaya çevrilir. Yayından sonra yapılabilir.
2. **`style-src` içinde `'unsafe-inline'` var.** Sayfalarda `style="..."` biçiminde
   satır içi stiller bulunduğu için gerekli. Yalnızca görünümü etkiler, kod
   çalıştırmaya izin vermez; risk düşüktür.

### Yükleme sonrası kontrol

Site yayına alındıktan sonra `securityheaders.com` adresine alan adını yazın.
Yukarıdaki başlıklarla **A veya A+** not alması beklenir. Düşük not alırsa `_headers`
dosyasının yüklendiğinden emin olun.

---

## 7. MG Asistan — yapay zekâ rehberi (Cloudflare Worker)

`asistan.html` sayfası sohbeti küçük bir arka uca gönderir; API anahtarı yalnızca orada durur, siteye hiç inmez.
Arka uç kodu `worker/worker.js` dosyasındadır. Bağımlılık yok, derleme yok; Cloudflare panelinde "Edit code" ile yapıştırılır.

### Kurulum (10 dakika, komut satırı gerekmez)

1. **API anahtarı:** `platform.claude.com` → hesap aç → **API Keys → Create key** → anahtarı kopyala (bir daha gösterilmez). Faturalandırma için kart tanımlanır; kullanım kadar ödenir.
2. **Cloudflare:** `cloudflare.com` → ücretsiz hesap → **Workers & Pages → Create → Create Worker** → ad: `mg-asistan` → **Deploy**.
3. **Edit code** → açılan editördeki her şeyi sil → `worker/worker.js` dosyasının tamamını yapıştır → **Deploy**.
4. **Settings → Variables and Secrets → Add variable:**
   - `ANTHROPIC_API_KEY` → tür **Secret** → 1. adımdaki anahtar
   - (isteğe bağlı) `ALLOWED_ORIGIN` → tür Text → `https://www.mgconsultingtr.com`
5. Worker adresini kopyala: `https://mg-asistan.<hesapadı>.workers.dev`
6. `assets/asistan.js` dosyasının başındaki `var ENDPOINT="";` satırına bu adresi yaz, siteyi yeniden yayınla.
   Tarayıcıda `asistan.html` açılınca durum rozeti **Hazır** olur.

### Güvenlik
- Worker yalnızca `https://www.mgconsultingtr.com` kaynağından gelen isteği kabul eder (Origin denetimi).
- IP başına dakikada 8 istek sınırı (en iyi çaba). Kalıcı sınır için Cloudflare **Security → WAF → Rate limiting rules** ile `/chat` yoluna kural eklenebilir.
- Mesaj boyu ve sohbet uzunluğu sınırlı; sohbet hiçbir yerde kaydedilmez.
- Sayfanın CSP'si yalnızca `*.workers.dev` adresine bağlantıya izin verir.

### Model ve maliyet
- Varsayılan model `claude-opus-5-5`; `MODEL` değişkeniyle değiştirilebilir (ör. `claude-sonnet-5-5` daha ucuz).
- Sistem talimatı önbelleğe alınır (prompt caching), her soruda yeniden ücretlendirilmez.
- Günlük harcama sınırı için `platform.claude.com` → **Limits** bölümünden aylık üst sınır konulmalıdır.
