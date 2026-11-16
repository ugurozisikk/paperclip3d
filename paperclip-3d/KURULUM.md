# Paperclip 3D Ofis — kurulum

Bu paket, Paperclip içindeki şirketleri canlı bir 3D ofis olarak gösterir.
Her şirketin ajanlarını, yönetici ilişkilerini ve görevlerini kendisi okur.
Yeni şirket için ayrıca kod veya API anahtarı girmeniz gerekmez.

## Gereksinimler

- Çalışır durumda bir Paperclip sunucusu ve eklenti yükleyebilen yönetici hesabı.
- Node.js 24.11 veya üzeri.
- WebGL destekleyen güncel bir tarayıcı.
- Doğrulanan Paperclip sürümü: **2026.1023.0**. Diğer sürümler için uyumluluk garantisi yoktur.

## Yerel bilgisayar

1. ZIP'i açın. İçindeki `paperclip-office3d` klasörünü kalıcı bir yere taşıyın.
2. Bu klasörün bulunduğu üst klasörde terminal açın.
3. Çalışan Paperclip sunucunuza eklentiyi yükleyin:

```sh
npx paperclipai@2026.1023.0 plugin install ./paperclip-office3d --local --api-base http://127.0.0.1:3100
```

Paperclip CLI'niz kuruluysa `npx paperclipai` yerine `paperclipai` kullanabilirsiniz.
Eklentiyi yükleyen CLI sürümünün sunucunuzun sürümüyle eşleşmesi önerilir.
Oturum gerektiren kurulumlarda CLI'nin normal yönetici giriş akışını tamamlayın.

4. Paperclip sayfasını yenileyin ve bir şirket seçin.
5. Sol menüden **3D Ofis** ekranını açın.

Paket derlenmiştir; `npm install` veya derleme yapmanız gerekmez.
Yerel klasör üzerinden yüklendiği için klasörü kurulumdan sonra silmeyin veya taşımayın.
Paperclip'i farklı bir adreste çalıştırıyorsanız `--api-base` değerini değiştirin.

## Docker veya başka sunucu

Klasör, Paperclip sunucusunun dosya sisteminde bulunmalıdır. Docker kullanıyorsanız
klasörü konteynere bağlayın ve yükleme sırasında konteyner içindeki yolu kullanın.
Kendi bilgisayarınızdaki yol uzak sunucuda geçerli değildir.
Yönetilen/hosted Paperclip hizmetleri üçüncü taraf eklenti kurulumunu kısıtlayabilir.

## Kullanım

- Ofis sayfası yalnızca oyunu gösterir; Paperclip menüleri ve yan paneller görünmez.
- Sol alttaki ok Paperclip'e döner; ev düğmesi odanıza, kahve düğmesi lobiye gider; son düğme kamerayı sıfırlar.
- Şirket değiştirdiğinizde o şirketin ekibi ve görevleri gelir.
- Ajanın üstüne tıklayın: durumu, görevi, yöneticisi ve gerçek çalışma/prompt geçmişi tam sayfa pencerede açılır. Son 30 çalışma listelenir; daha eskilerini yükleyebilirsiniz. Gönderilen prompt ve kayıtlı ajan yanıtları gösterilir; ortam değişkenleri ve bağlantı ayarları gösterilmez. Geçmiş kaydı tutulmamışsa bu durum belirtilir.
- Gerçek, çözülmemiş görev bağımlılığı varsa bloklanan ajan bloklayan ajanın masasının karşısına gider. Birden fazla kişi aynı masada sıraya girer. Bağımlılık kalkınca ayrılır. Size yöneltilmiş soru önceliklidir. Farklı kattaki bloklanan kişi, bloklayanın katında görünür. Sadece “blocked” etiketi, açık bir bağımlılık olmadan başka ajanı bloklayan ilan etmez.
- Kat başına beş ajan gösterilir; büyük ekipler için küçük kat seçici görünür.
- Sizin karakteriniz kendi masasında her zaman oturur.
- Size yöneltilmiş gerçek, bekleyen Paperclip soruları olduğunda ajanlar masanızın önünde sıraya girer. Başka kattaki soru sahipleri de gelir.
- Başlarının üzerindeki 1, 2, 3 numaralı balonlara tıklayın: ilgili görev geçmişi ve soruları içeren konuşma penceresi tüm sayfayı kaplar.
- Tekli/çoklu seçim ve metin soruları desteklenir. “Yanıtı gönder” düğmesi, açık oturumunuzla Paperclip'in normal soru yanıtlama işlemini yapar. Eklenti kendiliğinden yanıt vermez.
- Bir soruyu kapatmak veya pencereyi kapatmak soruyu yanıtlamaz. ESC konuşmayı kapatır.
- Bir ajanın tüm soruları yanıtlandığında sıradan ayrılır. Başka yerden verilen yanıtlar da yenilemede algılanır.
- Paperclip'e soru kaydı olarak gönderilmemiş sıradan hata/engelli görevler, soru balonu oluşturmaz.
- Veriler yaklaşık üç saniyede bir yenilenir; yeni soru keşfi, önbellek nedeniyle yaklaşık 13 saniyeyi bulabilir.
- Ofis 44×30 boyutuna genişletildi. Boşta olan ajanlar lobide, aralarında sehpa bulunan karşılıklı iki üçlü koltuğa oturur. Sırayla el hareketi ve konuşma balonuyla sohbet ederler. Çalışmaya başlayan veya soru bekleyen ajanlar koltuktan kalkar. Kullanıcının cam bölmeli ayrı odası ve açık bir giriş koridoru vardır; soru sırası bu odaya gelir. Bu, görsel bir animasyondur; ek model konuşması başlatmaz.
- Duvar boyunca uzanan yüksek çözünürlüklü televizyon aktif ana görevi ve alt görevlerin tamamlanma sayısını gösterir. Kanban tahtası, bekleyen/geliştirilen/incelenen/tamamlanan görevleri dört sütunda gösterir. Engelli görevler inceleme sütununda işaretlenir; iptal edilenler tahtadan çıkarılır. Televizyonda her sütunun ilk iki kartı ve toplam sayısı, büyütülmüş görünümde tüm kartlar bulunur. Alttaki kayan satır ve dönen alt görev bilgileri gerçek Paperclip durumlarıyla güncellenir. Televizyona veya üzerindeki büyütme simgesine tıklayarak yayını okunaklı yazılarla tam sayfa açabilirsiniz; ESC ile ofise dönersiniz.
- Ana görev, aktif görevin en üst ebeveynidir. Birden fazla aktif ana görev varsa güncel aktif iş seçilir; hiç görev yoksa bekleme ekranı gösterilir.
- Görev devirleri ve tamamlamalar sahnede canlandırılır; görev tahtası ofisin içindedir.

### 1.1.0'dan güncelleme

1.2.0 gerçek soru sırası için **issue.interactions.read**, 1.5.0 görev bağımlılıkları için **issue.relations.read** izni ekler. Bunlar yalnızca okuma yetkileridir; onay kayıtlarını okumaz.
Paperclip sürümünüz yeni izinle yükseltmeyi reddederse, eklentiyi **verilerini silmeden** normal şekilde kaldırıp yeni klasörden yeniden kurun. “Purge / verileri kalıcı sil” seçeneğini kullanmayın. Bu yöntem aynı eklenti kaydını ve ayarlarını korur.

Arka plan işçisi seçili şirketin ajanlarını, görevlerini, açık görev bağımlılıklarını ve soru etkileşimlerini okur.
Konuşma açılınca görev geçmişi mevcut yönetici oturumuyla yüklenir; yanıt yalnızca kullanıcı gönderdiğinde aynı oturumla kaydedilir.
Görselleştirme ek model çağrısı yapmaz. Gerçek bir yanıt göndermek, Paperclip'in normal işleyişi gereği ilgili ajanın devam etmesini sağlayabilir.
Uzak Roving Office hizmetine veri göndermez; sahne ve veriler Paperclip sunucunuzdan gelir.

## Kapatma

Paperclip'in eklenti ayarlarından **3D Ofis** eklentisini devre dışı bırakabilirsiniz.
Bu işlem şirketlerinizi veya görevlerinizi silmez.

## Lisans ve destek

Bağımsız bir topluluk uyarlamasıdır. Apache-2.0 altında dağıtılır; üçüncü taraf
lisans ve atıfları paket içindeki `LICENSE`, `NOTICE` ve `THIRD_PARTY_NOTICES.txt`
dosyalarında bulunur. Bunları yeniden dağıtılan kopyalarda koruyun.
Görsel temel: https://github.com/atlassian-labs/roving-office

Bu bağımsız topluluk eklentisidir. Sorun bildirirken Paperclip sürümünüzü, tarayıcınızı ve
hata ekranını paylaşın; API anahtarı veya hassas şirket verisi paylaşmayın.
