# Paperclip — Tüm Proje

Paperclip ile yönetilen ajan ekibi, 3D ofis ve React/.NET blog demosunun tek depoluk kaynak paketi.

## Klasörler

| Klasör | İçerik |
| --- | --- |
| `paperclip/` | Paperclip 2026.1023.0 ve Node 24.22.2 kurulum manifestleri/kilitleri, başlatma-durdurma aracı, yerel Codex CLI bağlantı düzenlemesi |
| `paperclip-3d/` | 3D ofisin tüm özelleştirme kaynakları, kullanılan Roving Office kaynakları, Three.js, hazır eklenti, testler, önizleme ve lisanslar |
| `blog-demo/frontend/` | React 19 + Vite blog arayüzü |
| `blog-demo/backend/` | .NET 10 blog API'si ve JSON depolama kodu |
| `blog-demo/qa/` | Playwright testleri ve ayrı test sunucuları |
| `team/` | Müdür → Product Owner → Backend, Frontend, QA düzeni ve beş ajan için taşınabilir talimat şablonları |
| `scripts/` | Ortak kurulum, eklenti yükleme ve paket kontrolü |

Bu klasör Git deposunun kökü olarak kullanılabilir. İçinde ayrı/nested Git depoları yoktur. `paperclip-3d/dist/` bilerek pakettedir ve Git'e eklenmelidir; diğer kullanıcılar hazır eklentiyi derlemeden kurabilir.

## Gereksinimler

- Node.js 24.11+ ve npm.
- Blog için .NET 10 SDK.
- 3D ekran için WebGL destekli tarayıcı.
- İlk bağımlılık kurulumu için internet erişimi.
- Yerel başlatma araçları macOS/Linux içindir. Windows'ta Paperclip CLI, `dotnet run` ve frontend npm komutları doğrudan kullanılabilir.

## Kurulum

Depo kökünde:

```sh
npm run setup
```

Bu komut Paperclip'in ve blogun sabitlenmiş bağımlılıklarını kurar; .NET restore yapar. Üstteki `paperclip/` kurulum klasörüdür: üçüncü taraf Paperclip dağıtımı `npm ci` ile kilitli sürümden kurulur; büyük `node_modules` dizinleri Git'e konmaz.

Blogu şimdilik kurmadan yalnızca Paperclip kullanmak için `npm run setup -- --skip-blog`.
Yerel Codex bağlantı düzenlemesini de uygulamak için `npm run setup -- --local-codex`.
3D kaynak geliştirme bağımlılıklarını kurmak için `npm run setup -- --dev-office`.

İlk Paperclip ayarlarını oluşturun:

```sh
node paperclip/app/node_modules/paperclipai/dist/index.js onboard --data-dir ./paperclip/data --no-install-service
npm run paperclip:start
```

Kurulumda yerel portu **3100** seçin. Paperclip adresi: [http://127.0.0.1:3100](http://127.0.0.1:3100).
Mevcut Paperclip zaten bu portta çalışıyorsa ikinci bir sunucu başlatmanız gerekmez; aşağıdaki eklenti yükleme komutunu mevcut yerel sunucu için kullanabilirsiniz.

3D ofisi kurun:

```sh
npm run office:install
```

Paperclip'te şirket seçin ve **3D Ofis** sayfasını açın. Farklı sunucu adresi için `PAPERCLIP_API_BASE` ortam değişkenini ayarlayın. Uzak sunucuda eklenti klasörünün o sunucunun erişebildiği dosya sisteminde bulunması gerekir. Ayrıntılar: [paperclip-3d/KURULUM.md](paperclip-3d/KURULUM.md).

Blogu başlatın:

```sh
npm run blog:start
```

Frontend: [http://127.0.0.1:5185](http://127.0.0.1:5185). API: [http://127.0.0.1:5270/api/health](http://127.0.0.1:5270/api/health).

Durdurma:

```sh
npm run blog:stop
npm run paperclip:stop
```

## Playwright ve geliştirme

İlk Playwright kullanımı için:

```sh
cd blog-demo/qa
npx playwright install chromium
cd ../..
npm run blog:test
```

QA, 5186/5271 portlarında ayrı sunucular ve geçici veriler kullanır; demo verilerine yazmaz. Uygulama derlemeleri:

```sh
npm --prefix blog-demo/frontend run build
dotnet build blog-demo/backend/Blog.Api.csproj
```

3D kaynak geliştirme ve kontrol:

```sh
npm --prefix paperclip-3d ci
npm --prefix paperclip-3d run build
npm --prefix paperclip-3d test
npm --prefix paperclip-3d run verify:package
npm run verify
```

Bağımsız görsel demo: `npm run office:preview` → [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Ajan ekibi

[team/README.md](team/README.md) şirket ve ajanları kendi Paperclip kurulumunuzda nasıl eşleştireceğinizi açıklar. `team/team-template.json` native veritabanı veya otomatik import dosyası değildir; taşınabilir ekip tarifidir. Ajan kimlikleri yeni kurulumda yeniden oluşur.

## Paket kapsamı

Özgün çalışan kurulum ve masaüstündeki eski klasörler korunmuştur. Bu klasör kaynak ve yeniden kurulum paketidir; mevcut Paperclip veritabanının, görev/chat geçmişinin veya oturumların yedeği değildir. Şirket veritabanı, API anahtarları, giriş belgeleri, kişisel blog yazıları, büyük bağımlılık dizinleri, derleme önbellekleri ve eski test raporları pakete alınmaz. Blog API, ilk çalıştırmada örnek yazılarını kendisi oluşturur.

Yerel Codex bağlantı düzenlemesi `paperclip/local-patches/` altındadır. 3D eklentinin çalışması bu düzenlemeye bağlı değildir. Alıcı, kendi ajan sağlayıcısını ve girişini ayarlar.

## Git'e yükleme

Bu ana klasörün tamamını tek depo olarak ekleyin. Özellikle `blog-demo/frontend`, `backend`, `qa` ve `paperclip-3d/dist` kaynaklarının eklendiğini kontrol edin. Önceki blog klasörünün alt projeleri dışlayan ignore kuralları bu pakette düzeltilmiştir. Paket kendiliğinden commit veya push yapmaz.

Lisanslar ve bileşen kapsamı: [docs/LISANSLAR.md](docs/LISANSLAR.md).
