# Ajan ekibi

Ekip: **Müdür → Product Owner → Backend Developer, Frontend Developer, QA Developer**.

`team-template.json`, kaynak klasörlerini ve raporlama zincirini tarif eder; native Paperclip import formatı değildir.

1. Paperclip şirketinizde beş rolü oluşturun veya mevcut rollerle eşleştirin.
2. Müdürün altına Product Owner'ı, Product Owner'ın altına diğer üç ajanı bağlayın.
3. Çalışma klasörlerini bu depo içindeki `blog-demo`, `blog-demo/backend`, `blog-demo/frontend` ve `blog-demo/qa` mutlak yollarına ayarlayın.
4. `instructions/` altındaki ilgili rol talimatını seçin. Dosyalardaki `${PROJECT_ROOT}` değerini deponun mutlak yolu ile değiştirin; `${..._AGENT_ID}`, `${..._WORKSPACE_ID}` ve `${PROJECT_ID}` alanlarını kendi Paperclip kimliklerinizle doldurun. Bunlar sır değildir, ancak eski kurulumun kimlikleri taşınmamıştır.
5. QA için workspace runtime komutu kullanacaksanız kendi QA workspace'inizde `playwright-qa` komutunu tanımlayın ve talimat şablonundaki komut referanslarını eşleştirin.
6. Her ajan kendi kimlik doğrulaması ve CLI ayarıyla çalışır. 3D ofis ek model çağrısı yapmaz ve bu talimatları kendiliğinden göreve dönüştürmez.

Talepler Müdür veya Product Owner'a verilir. Product Owner geliştirme görevlerini ayırır, Backend ve Frontend teslimlerinden sonra QA ister. QA hataları ilgili geliştiriciye geri döndürür. Sonuçlar Paperclip görevlerinde tutulur.

Yerel Codex CLI seçeneği için `paperclip/local-patches/README.md` dosyasına bakın. Giriş bilgileri bu paketle taşınmaz.
