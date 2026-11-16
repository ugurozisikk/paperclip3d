# Entegrasyon ve geliştirme

## Dosyalar

- `src/manifest.js`: eklenti kimliği, yetkiler, sayfa ve menü kaydı.
- `src/worker.js`: seçili şirketin ajanlarını, görevlerini, soru etkileşimlerini ve görev bağımlılıklarını SDK üzerinden okur.
- `src/model.js`: yalnızca görselleştirmede gereken alanları taşıyan şirket kapsamlı veri modeli.
- `src/index.js`: Paperclip UI köprüsü; şirket değişimi, yenileme ve tam sayfa pencereler.
- `src/scene.js`: üç boyutlu sahne, oturma, yürüyüş ve bekleme sırası.
- `src/office-layout.js`, `src/office-props.js`: plan, lobi, oda, dekor ve televizyon.
- `src/question-chat.js`, `src/agent-inspector.js`, `src/television.js`: konuşma, gerçek geçmiş ve büyütülmüş yayın.
- `vendor/roving-office`: sabit upstream sürümünden kullanılan, marka görselleri çıkarılmış kaynak ve Three.js.
- `build.mjs`: geçici vendor kopyasına sahne uyarlamalarını uygular ve `dist/` üretir.

Eklenti kimliği `local.office3d`, rota `office3d` olarak korunur. Buradaki `local` şirket veya bilgisayar kimliği değildir. Başka kullanıcılar aynı paketi kendi şirketlerinde kurabilir. Aynı kimlikle kurulu eski eklenti varsa yeni bir kopya kurmak yerine yükseltme yapılmalıdır.

## İzinler

Manifest: `companies.read`, `agents.read`, `issues.read`, `issue.interactions.read`, `issue.relations.read`, `ui.page.register`, `ui.sidebar.register`.

Arka plan yalnızca okur. Etkileşim pencereleri, mevcut Paperclip yönetici oturumuyla aynı kaynaktaki normal uç noktaları kullanır. Yanıt yalnızca kullanıcı gönderdiğinde yazılır. Ajan geçmişi yalnızca ilgili pencere açıldığında okunur. Bu UI işlemleri manifestte arka plan yazma yetkisi tanımlamaz.

`postMessage` iletileri kaynak, pencere ve şirket kimliğiyle doğrulanır. Snapshot, çalışma ve konuşma şirketleri kontrol edilir. Ortam değişkenleri ve bağlantı sırları prompt geçmişi penceresine taşınmaz.

## API / uyumluluk

Paperclip ve SDK 2026.1023.0 üzerinde doğrulandı. Eklentinin worker veri kaydı, UI köprüsü, statik `/_plugins/…/ui/` dosyaları, görev etkileşimleri ve bağımlılık okuyucusu gerekir. Ajan geçmişi, görev konuşması ve yanıt uç noktaları bu Paperclip sürümünün board API'sini kullanır. Yeni sürümlerde kontrol edilmelidir.

`dist/worker.js` SDK'nın kullanılan çalışma kodunu paketler. `react`, `react-dom` ve SDK'nın UI köprüsü host tarafından sağlanır. Three.js kendi sunucunuzdan sunulur. Bilgisayara veya örnek şirkete bağlı çalışma yolu yoktur.

## Test ve dağıtım

`npm test`: şirket izolasyonu, alan filtreleme, soru seçimi, görev durumları, Kanban ve bağımlılıklar dahil 15 birim/SDK testi. Testler gerçek görev oluşturmaz.

`npm run verify:package`: manifest/sürüm, gerekli çıktı ve lisans dosyaları, taşınabilir yollar ve temel paket sınırları. Bu bir tam güvenlik denetimi değildir.

`npm run preview`: yalnızca sahneyi örnek verilerle gösterir. Gerçek entegrasyon denemesi kendi Paperclip ortamınızda yapılmalıdır.

Hazır `dist/` dosyalarını kaynakla birlikte depoda tutun. Yayın öncesinde `npm ci`, `npm run build`, `npm test`, `npm run verify:package` ve `npm pack --dry-run` çalıştırın. Derleme npm kayıt deposuna yalnızca bağımlılık kurulurken ihtiyaç duyar; sahne kaynağını GitHub'dan indirmez.
