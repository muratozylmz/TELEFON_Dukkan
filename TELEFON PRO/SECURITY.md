# Güvenlik Rehberi - GaziTech Mobile

## 🔒 Uygulanan Güvenlik Önlemleri

### 1. Input Validation & Sanitization
- ✅ **Express Validator** ile tüm form girişleri doğrulanıyor
- ✅ **XSS koruması** için input sanitization
- ✅ **SQL Injection koruması** için parameterized queries
- ✅ **File upload güvenliği** (dosya tipi ve boyut kontrolü)

### 2. Authentication & Session Security
- ✅ **Bcrypt** ile güvenli şifre hashleme (12 rounds)
- ✅ **Session güvenliği** (httpOnly, sameSite, secure cookies)
- ✅ **Rate limiting** (genel: 100/15dk, admin: 5/15dk)
- ✅ **Admin paneli** ayrı rate limiting ile korunuyor

### 3. Security Headers
- ✅ **Helmet.js** ile güvenlik başlıkları
- ✅ **Content Security Policy (CSP)**
- ✅ **X-Frame-Options** (clickjacking koruması)
- ✅ **X-Content-Type-Options** (MIME sniffing koruması)
- ✅ **X-XSS-Protection**
- ✅ **Referrer Policy**

### 4. CORS & Network Security
- ✅ **CORS ayarları** (production'da kısıtlı)
- ✅ **Server signature gizleme**
- ✅ **Environment variables** (.env ile)

### 5. File Upload Security
- ✅ **Dosya tipi kontrolü** (sadece resim dosyaları)
- ✅ **Dosya boyutu limiti** (5MB)
- ✅ **Resim optimizasyonu** (Sharp ile)
- ✅ **Güvenli dosya isimlendirme**

### 6. Error Handling
- ✅ **Merkezi error handling**
- ✅ **Güvenli error mesajları** (sistem bilgilerini ifşa etmez)
- ✅ **Multer error handling**

## ⚠️ Production'da Yapılması Gerekenler

### 1. Environment Variables
```bash
# .env dosyasını güncelleyin:
SESSION_SECRET=your-very-secure-random-string-here
DEFAULT_ADMIN_PASSWORD=VerySecurePassword123!
NODE_ENV=production
```

### 2. HTTPS Setup
- SSL sertifikası yapılandırın
- HTTP'den HTTPS'e yönlendirme ekleyin
- `secure: true` cookie ayarını aktifleştirin

### 3. Database Security
- Veritabanı dosyasının izinlerini kısıtlayın
- Düzenli backup alın
- Hassas verileri şifreleyin

### 4. Server Security
- Firewall yapılandırın
- Sadece gerekli portları açın
- Düzenli güvenlik güncellemeleri yapın

### 5. Monitoring & Logging
- Access logları yapılandırın
- Güvenlik olaylarını izleyin
- Performans monitoring ekleyin

## 🛡️ Güvenlik Kontrol Listesi

- [x] SQL Injection koruması
- [x] XSS koruması
- [x] CSRF koruması (session sameSite)
- [x] Clickjacking koruması
- [x] File upload güvenliği
- [x] Rate limiting
- [x] Input validation
- [x] Error handling
- [x] Security headers
- [x] Session security
- [ ] HTTPS (production için)
- [ ] Database encryption (isteğe bağlı)
- [ ] Monitoring (production için)

## 📞 Güvenlik İhlali Bildirimi

Güvenlik açığı tespit ederseniz lütfen:
1. Hemen rapor edin
2. Detayları güvenli şekilde paylaşın
3. Genel açıklama yapmayın

Bu uygulamada modern güvenlik standartları uygulanmıştır ancak %100 güvenlik yoktur. Düzenli güvenlik denetimleri yapılması önerilir.
