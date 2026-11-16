# Yerel Codex CLI ile ChatGPT oturumu

Bu kurulumda Paperclip 2026.1023.0 kullanılıyor. Asıl yerel kurulumda ajanlar, bilgisayarda ChatGPT ile giriş yapılmış Codex CLI üzerinden çalışacak şekilde ayarlanmıştır. Bu pakette giriş bilgileri veya ajan veritabanı bulunmaz. OpenAI API bağlantısı devre dışı; ajanların yönetilen `aiConnection` seçimi kaldırıldı. API anahtarları boş ve `forced_login_method="chatgpt"` seçeneği açık. Aboneliğin Codex kullanım sınırları geçerlidir.

Değişiklik yalnızca yerel operatörün `codex_local` / `cli` ayarında `runtimeConfig.localCliAuth: true` seçmesini sağlar. Uzak ortamlar, ajan çağrıları, API anahtarı içeren ayarlar ve aynı anda yönetilen bağlantı seçimi reddedilir. Kimlik doğrulaması Codex CLI tarafından yapılır; giriş veya MFA denetimi kaldırılmaz. Kimlik bilgileri kopyalanmaz. Ajanların çalışma klasörleri, talimatları ve modelleri korunur.

`apply-local-cli-auth.mjs`, sunucunun ajan güncelleme yolunda yönetilen bağlantının otomatik olarak geri konulmasını bu açık yerel seçim için önler. İlk uygulamadan önce asıl dosya `agents.js.original` olarak saklanır. CLI bağdaştırıcısı zaten yönetilen bağlantı olmadan yerel oturum çalıştırmayı destekler.

Kurulum kökünde:

```sh
runtime/node_modules/node/bin/node local-patches/apply-local-cli-auth.mjs
runtime/node_modules/node/bin/node --test local-patches/local-cli-auth.test.mjs
runtime/node_modules/node/bin/node control.mjs stop
runtime/node_modules/node/bin/node control.mjs start --no-browser
```

Paperclip güncellemesi bu yerel sunucu değişikliğini silebilir. Güncellemeden sonra yeniden uygulanmalı ve bağlantı test edilmelidir. Betik beklediği kaynak bloğunu bulamazsa değişikliği durdurur; yeni sürüm gözden geçirilmelidir. Eski sürümün yedek dosyası yeni sürüme kopyalanmamalıdır.

Doğrulama: Her ajanın kayıtlı ayarıyla Paperclip'in `test-environment` denetimi çalıştırılır. `codex_native_auth_present` ve `codex_hello_probe_passed` beklenir; `codex_openai_api_key_present` bulunmamalıdır. Ajanın gerçek görev geçmişi silinmez. Bu sunucu değişikliği 3D ofis eklentisinin dağıtım paketine dahil değildir.
