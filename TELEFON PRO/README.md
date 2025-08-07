# 📱 GaziTech Mobile - Vitrin Websitesi

Modern, güvenli ve mobil uyumlu teknoloji mağazası vitrin websitesi.

## ✨ Özellikler

### 🎯 Frontend
- ✅ **Tamamen mobil uyumlu** responsive tasarım
- ✅ **Modern UI/UX** Bootstrap 5 ile
- ✅ **Animasyonlar** ve smooth geçişler
- ✅ **Touch-friendly** mobil arayüz
- ✅ **Lazy loading** resimler için
- ✅ **PWA hazır** yapı

### 🔒 Güvenlik
- ✅ **Input validation** tüm formlarda
- ✅ **SQL injection** koruması
- ✅ **XSS koruması** 
- ✅ **CSRF koruması**
- ✅ **Rate limiting** (DDoS koruması)
- ✅ **Secure headers** (Helmet.js)
- ✅ **File upload güvenliği**
- ✅ **Session güvenliği**

### 📱 Mobil Optimizasyon
- ✅ **Responsive grid** system
- ✅ **Touch gestures** desteği
- ✅ **Mobile-first** yaklaşım
- ✅ **Optimized images** Sharp ile
- ✅ **Fast loading** performance
- ✅ **Mobile navbar** responsive menü

### 🛡️ Admin Paneli
- ✅ **Güvenli giriş** sistemi
- ✅ **Ürün yönetimi** (CRUD)
- ✅ **Kategori yönetimi**
- ✅ **Resim yükleme** ve optimizasyon
- ✅ **Dashboard** istatistikler

## 🚀 Kurulum

### 1. Depoyu klonlayın
```bash
git clone <repo-url>
cd gazitech-mobile
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Environment ayarlarını yapın
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

### 4. Uygulamayı başlatın
```bash
# Development
npm run dev

# Production
npm start
```

## 🔧 Environment Variables

```env
# Güvenlik
SESSION_SECRET=your-very-secure-secret-key
NODE_ENV=production

# Admin
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!

# Database
DB_PATH=./telefon_pro.db

# File Upload
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📱 Mobil Uyumluluk

### Desteklenen Cihazlar
- ✅ **Smartphones** (320px+)
- ✅ **Tablets** (768px+)
- ✅ **Desktops** (1200px+)
- ✅ **Large screens** (1400px+)

### Mobil Özellikler
- **Touch-friendly** 44px minimum touch targets
- **Responsive navigation** collapsed menu
- **Optimized images** different sizes for different screens
- **Fast loading** lazy loading and optimizations
- **Gestures** swipe, tap, pinch support

## 🔒 Güvenlik

### Uygulanan Korunmalar
- **Input Validation** - Express Validator ile
- **SQL Injection** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CSRF Protection** - SameSite cookies
- **Rate Limiting** - Brute force koruması
- **File Upload Security** - Type ve size validation
- **Security Headers** - Helmet.js ile

### Production Güvenlik Checklist
- [ ] SSL sertifikası yükleyin
- [ ] Environment variables güncelleyin
- [ ] Admin şifresini değiştirin
- [ ] Firewall yapılandırın
- [ ] Monitoring ekleyin

## 🛠️ NPM Scripts

```bash
npm start           # Production başlatma
npm run dev         # Development (nodemon ile)
npm run security-check  # Güvenlik tarama
npm run security-fix    # Güvenlik düzeltmeleri
npm test            # Test çalıştırma (TODO)
```

## 📁 Proje Yapısı

```
GAZITECH MOBILE/
├── app.js              # Ana uygulama
├── database.js         # Veritabanı ayarları
├── .env               # Environment variables
├── routes/
│   └── admin.js       # Admin panel rotaları
├── views/
│   ├── layout.ejs     # Ana layout
│   ├── index.ejs      # Ana sayfa
│   ├── product-detail.ejs
│   ├── category.ejs
│   └── admin/         # Admin paneli views
├── public/
│   ├── css/style.css  # Ana stil dosyası
│   ├── js/main.js     # Frontend JavaScript
│   └── uploads/       # Yüklenen resimler
└── SECURITY.md        # Güvenlik rehberi
```

## 👤 Admin Paneli

### Varsayılan Giriş
- **URL**: `/admin`
- **Kullanıcı**: `admin`
- **Şifre**: `.env` dosyasında tanımlı

### Admin Özellikleri
- Dashboard ve istatistikler
- Ürün ekleme/düzenleme/silme
- Kategori yönetimi
- Resim yükleme ve optimizasyon
- Güvenli oturum yönetimi

## 🔧 Teknik Detaylar

### Backend
- **Node.js** + Express.js
- **SQLite3** veritabanı
- **EJS** template engine
- **Bcrypt** şifre hashleme
- **Sharp** resim optimizasyon
- **Helmet** güvenlik headers

### Frontend
- **Bootstrap 5** responsive framework
- **Font Awesome** iconlar
- **Vanilla JavaScript** (dependency-free)
- **CSS Grid & Flexbox** layout
- **CSS Variables** theming

### Güvenlik Paketleri
- **express-validator** input validation
- **express-rate-limit** rate limiting
- **helmet** security headers
- **cors** CORS ayarları
- **dotenv** environment variables

## 📧 Destek

Sorunlar için:
1. GitHub Issues kullanın
2. Güvenlik açıkları için özel olarak bildirin
3. Detaylı açıklama ve adımlar ekleyin

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

---

**⚠️ Önemli**: Production'da kullanmadan önce güvenlik ayarlarını kontrol edin ve güncelleyin!

---

🏢 **GaziTech Mobile** - Modern teknoloji çözümlerinin adresi
