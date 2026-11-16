# Paperclip 3D Ofis

Paperclip ekiplerini canlı bir 3D ofiste gösteren bağımsız topluluk eklentisi.
Her şirketin kendi ajanlarını, görevlerini ve sorularını otomatik kullanır.

![Örnek ekiple 3D ofis](docs/preview.png)

- Geniş 44×30 ofis, kullanıcının ayrı odası ve cam bölmeler.
- Karşılıklı iki üçlü koltuk ve sehpa bulunan lobi; boşta ajanlar oturarak sohbet eder.
- Görev başladığında lobiden ayrılan ajanlar ve görsel görev devirleri.
- Gerçek sorulardan oluşan bekleme sırası ve numaralı konuşma balonları.
- Kullanıcı tıklamasıyla tam sayfa soru konuşması ve yanıt gönderme.
- Canlı ana görev, Kanban ve kayan durum satırı bulunan panoramik televizyon.
- Ajanın üstüne tıklayınca gerçek durum ve kayıtlı prompt/yanıt geçmişi.
- Gerçek görev bağımlılığı varsa bloklanan ajan bloklayanın masasına gider.
- Şirketler arasında geçiş ve kat başına beş ajan.

## Hazır eklentiyi kur

ZIP'i açıp `paperclip-office3d` klasörünü Paperclip sunucusunun erişebildiği kalıcı bir yere taşıyın. Bu klasörün bir üstünde:

```sh
npx paperclipai@2026.1023.0 plugin install ./paperclip-office3d --local --api-base http://127.0.0.1:3100
```

CLI'niz zaten kuruluysa ve sunucunuzla aynı sürümdeyse `npx paperclipai@2026.1023.0` yerine `paperclipai` kullanabilirsiniz. Sunucunuz farklı adresteyse `--api-base` değerini değiştirin. Yönetici oturumunu CLI'nin normal giriş yöntemiyle açın.

Paperclip'i yenileyin, bir şirket seçin ve **3D Ofis** sayfasını açın. `dist/` hazırdır; kurulum için `npm install` veya derleme gerekmez. Klasörü sonradan taşımayın veya silmeyin.

**Doğrulanan Paperclip / SDK:** 2026.1023.0. **Node.js:** 24.11+. **Tarayıcı:** WebGL destekli güncel tarayıcı.

Ayrıntılar: [KURULUM.md](KURULUM.md). Diğer Paperclip sürümlerinde bu API'lerin bulunması gerekir; tüm sürümler için uyumluluk iddiası yoktur.

## Git'e koy ve geliştir

Bu klasör depo kökü olacak şekilde kaynak dosyaları ve hazır `dist/` çıktısını birlikte Git'e koyabilirsiniz. Kilit dosyası, lisanslar ve kullanılan sahne kaynağı dahildir.

```sh
npm ci
npm run build
npm test
npm run verify:package
```

Derleme, bu depodaki `vendor/roving-office` kaynağını kullanır; başka bir yerel checkout veya kişiye özel dosya yolu gerekmez. `dist/` Git'te tutulur, böylece depoyu indiren kişi eklentiyi doğrudan kurabilir. `npm pack` yalnızca hazır çalışma dosyalarını ve kullanıcı belgelerini paketler; kaynak ZIP'i geliştirme dosyalarını da içerir.

GitHub için örnek doğrulama akışı `.github/workflows/ci.yml` dosyasında bulunur.

## Paperclip olmadan görsel önizleme

```sh
npm run preview
```

[http://127.0.0.1:4173](http://127.0.0.1:4173) adresinde örnek ajanlarla sahneyi açar. Bu yalnızca görsel demodur; görev, soru yanıtı ve prompt geçmişi entegrasyonları gerçek Paperclip'te çalışır. `PORT` ortam değişkeniyle önizleme portu değiştirilebilir. Hazır `dist/` ile önizleme için yalnızca Node gerekir.

## Entegrasyon sınırı

Eklenti kendi model çağrısını yapmaz; ek bir OpenAI/Claude anahtarı istemez. Ajanların nasıl çalıştırıldığı Paperclip'in kendi ayarıdır. Soru yanıtlamak, Paperclip'in normal işleyişinde ilgili ajanı devam ettirebilir.

Paket şirket veritabanı, kullanıcı oturumu, API anahtarı veya yerel Codex bağlantı düzenlemesi içermez. Tüm sahne dosyaları kendi Paperclip sunucunuzdan yüklenir. Eklenti, Roving Office'in çevrim içi hizmetine şirket verisi göndermez.

Mimari ve izinler: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License / attribution

Independent community integration; not an official Paperclip or Atlassian product.
Scene based on [The Roving Office](https://github.com/atlassian-labs/roving-office), revision `f3c51c85d04c13ae32a4b929c7488847980c3851`, Apache-2.0. Excluded brand artwork was removed. Three.js and bundled Paperclip SDK components retain their MIT notices.

Keep `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.txt` and the vendor notices when redistributing. See `vendor/roving-office/PROVENANCE.json` for the source scope and adaptations.

## Quick install (English)

Extract or clone into a permanent `paperclip-office3d` directory on the Paperclip server. Run the install command above from its parent directory using a CLI version matching your server. Reload Paperclip and open **3D Ofis** in any company. The prebuilt plugin needs no npm install or build. For source development, use `npm ci`, `npm run build`, `npm test`, and `npm run verify:package` with Node 24.11+.
