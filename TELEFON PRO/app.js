const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const multer = require('multer');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult, param } = require('express-validator');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Güvenlik middleware'leri
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://code.jquery.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'"],
            mediaSrc: ["'self'"],
            objectSrc: ["'none'"],
            childSrc: ["'none'"],
            workerSrc: ["'none'"],
            frameSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    }
}));

// CORS ayarları
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
    credentials: true
}));

// Rate limiting - development için gevşetildi
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Development'ta 1000, production'da 100
    message: {
        error: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.',
        retryAfter: 900
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Development'ta static dosyalar için rate limit uygulama
        if (process.env.NODE_ENV !== 'production' && 
            (req.path.includes('/css/') || req.path.includes('/js/') || req.path.includes('/uploads/'))) {
            return true;
        }
        return false;
    }
});

app.use(limiter);

// Admin paneli için daha sıkı rate limiting
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: process.env.NODE_ENV === 'production' ? 5 : 50, // Development'ta 50, production'da 5
    skipSuccessfulRequests: true,
    message: {
        error: 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.'
    }
});

// Input sanitization middleware
app.use((req, res, next) => {
    // XSS koruması için basic sanitization
    for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }
    next();
});

// View engine ayarı
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware'ler
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session ayarları
app.use(session({
    secret: process.env.SESSION_SECRET || 'gazitech-mobile-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS'de true
        httpOnly: true, // XSS koruması
        maxAge: 24 * 60 * 60 * 1000, // 24 saat
        sameSite: 'strict' // CSRF koruması
    },
    name: 'sessionId' // Default session name'i gizle
}));

app.use(flash());

// Dosya yükleme ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Güvenli dosya türleri
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
        }
    },
    limits: { 
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
        files: 1 // Tek dosya
    }
});

// Global middleware - kategorileri tüm sayfalarda kullanılabilir yap
app.use((req, res, next) => {
    db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
        if (!err) {
            res.locals.categories = categories;
        }
        next();
    });
});

// Ana sayfa rotası
app.get('/', (req, res) => {
    // Öne çıkan ürünleri al
    const query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.created_at DESC 
        LIMIT 12
    `;
    
    db.all(query, (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Veritabanı hatası');
        }
        res.render('index', { 
            title: 'GaziTech Mobile - Ana Sayfa',
            products: products
        });
    });
});

// Ürün detay sayfası - input validation ile
app.get('/urun/:id', [
    param('id').isInt().withMessage('Geçersiz ürün ID').toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('404', { title: 'Geçersiz İstek' });
    }
    
    const productId = req.params.id;
    
    const query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
    `;
    
    db.get(query, [productId], (err, product) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Veritabanı hatası');
        }
        
        if (!product) {
            return res.status(404).render('404', { title: 'Ürün Bulunamadı' });
        }
        
        // Benzer ürünleri al
        db.all('SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 4', 
               [product.category_id, productId], (err, similarProducts) => {
            res.render('product-detail', { 
                title: product.name + ' - GaziTech Mobile',
                product: product,
                similarProducts: similarProducts || []
            });
        });
    });
});

// Kategori sayfası - input validation ile
app.get('/kategori/:id', [
    param('id').isInt().withMessage('Geçersiz kategori ID').toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('404', { title: 'Geçersiz İstek' });
    }
    
    const categoryId = req.params.id;
    
    // Kategori bilgisini al
    db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, category) => {
        if (err || !category) {
            return res.status(404).render('404', { title: 'Kategori Bulunamadı' });
        }
        
        // Kategorideki ürünleri al
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.category_id = ?
            ORDER BY p.name
        `;
        
        db.all(query, [categoryId], (err, products) => {
            res.render('category', { 
                title: category.name + ' - GaziTech Mobile',
                category: category,
                products: products || []
            });
        });
    });
});

// Tüm kategoriler sayfası
app.get('/kategoriler', (req, res) => {
    db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Veritabanı hatası');
        }
        res.render('categories', { 
            title: 'Tüm Kategoriler - GaziTech Mobile',
            categories: categories || []
        });
    });
});

// Admin rotaları - rate limiting ile
const adminRoutes = require('./routes/admin');
app.use('/admin', adminLimiter, adminRoutes);

// Multer error handling
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            req.flash('error', 'Dosya boyutu çok büyük (maksimum 5MB)');
        } else if (error.code === 'LIMIT_FILE_COUNT') {
            req.flash('error', 'Çok fazla dosya yüklendi');
        } else {
            req.flash('error', 'Dosya yükleme hatası: ' + error.message);
        }
        return res.redirect('back');
    } else if (error) {
        console.error('Uygulama hatası:', error);
        req.flash('error', 'Bir hata oluştu');
        return res.redirect('back');
    }
    next();
});

// Security headers middleware
app.use((req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Remove server signature
    res.removeHeader('X-Powered-By');
    
    next();
});

// 404 sayfası
app.use((req, res) => {
    res.status(404).render('404', { title: 'Sayfa Bulunamadı' });
});

// Server'ı başlat
app.listen(PORT, () => {
    console.log(`GaziTech Mobile vitrin sitesi http://localhost:${PORT} adresinde çalışıyor`);
});

module.exports = app;