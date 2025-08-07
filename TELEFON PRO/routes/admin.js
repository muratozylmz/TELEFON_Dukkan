const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { body, validationResult, param } = require('express-validator');
require('dotenv').config();
const db = require('../database');

const router = express.Router();

// Resim boyutlandırma ve optimizasyon fonksiyonu
const processImage = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .resize({
                width: 800,
                height: 600,
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ 
                quality: 85,
                progressive: true 
            })
            .toFile(outputPath);

        // Orijinal dosyayı sil (async olarak)
        if (inputPath !== outputPath) {
            setTimeout(() => {
                try {
                    fs.unlinkSync(inputPath);
                } catch (err) {
                    console.log('⚠️ Geçici dosya silinemedi (normal):', err.message);
                }
            }, 100);
        }
        
        return true;
    } catch (error) {
        console.error('🖼️ Resim işleme hatası:', error);
        return false;
    }
};

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
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Admin doğrulama middleware
const requireAuth = (req, res, next) => {
    if (req.session.adminId) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Admin giriş sayfası
router.get('/login', (req, res) => {
    if (req.session.adminId) {
        return res.redirect('/admin');
    }
    res.render('admin/login', { 
        title: 'Admin Girişi - GaziTech Mobile',
        success: req.flash('success'),
        error: req.flash('error')
    });
});

// Admin giriş işlemi - input validation ile
router.post('/login', [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Kullanıcı adı 3-30 karakter arası olmalıdır')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Kullanıcı adı sadece harf, rakam ve _ içerebilir'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Şifre en az 6 karakter olmalıdır')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Geçersiz giriş bilgileri');
        return res.redirect('/admin/login');
    }
    
    const { username, password } = req.body;
    
    db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
        if (err) {
            req.flash('error', 'Veritabanı hatası');
            return res.redirect('/admin/login');
        }
        
        if (!user || !bcrypt.compareSync(password, user.password)) {
            req.flash('error', 'Kullanıcı adı veya şifre hatalı');
            return res.redirect('/admin/login');
        }
        
        req.session.adminId = user.id;
        res.redirect('/admin');
    });
});

// Admin çıkış
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Admin ana panel
router.get('/', requireAuth, (req, res) => {
    // İstatistikler
    const stats = {};
    
    db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
        stats.totalProducts = result ? result.count : 0;
        
        db.get('SELECT COUNT(*) as count FROM categories', (err, result) => {
            stats.totalCategories = result ? result.count : 0;
            
            db.all('SELECT * FROM products ORDER BY created_at DESC LIMIT 5', (err, recentProducts) => {
                res.render('admin/dashboard', {
                    title: 'Admin Panel - GaziTech Mobile',
                    stats: stats,
                    recentProducts: recentProducts || []
                });
            });
        });
    });
});

// Ürünler listesi
router.get('/products', requireAuth, (req, res) => {
    const query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.created_at DESC
    `;
    
    db.all(query, (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Veritabanı hatası');
        }
        
                        res.render('admin/products-simple', {
                    title: 'Ürün Yönetimi - GaziTech Mobile Admin',
                    products: products,
                    success: req.flash('success'),
                    error: req.flash('error')
                });
    });
});

// Yeni ürün ekleme sayfası
router.get('/products/new', requireAuth, (req, res) => {
    db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
                    res.render('admin/product-form', {
                title: 'Yeni Ürün Ekle - GaziTech Mobile Admin',
                product: null,
                categories: categories || [],
                action: 'create',
                success: req.flash('success'),
                error: req.flash('error')
            });
    });
});

// Ürün düzenleme sayfası - input validation ile
router.get('/products/edit/:id', requireAuth, [
    param('id').isInt().withMessage('Geçersiz ürün ID').toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Geçersiz ürün ID');
        return res.redirect('/admin/products');
    }
    
    const productId = req.params.id;
    
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).send('Ürün bulunamadı');
        }
        
        db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
                                        res.render('admin/product-form', {
                                title: 'Ürün Düzenle - GaziTech Mobile Admin',
                                product: product,
                                categories: categories || [],
                                action: 'edit',
                                success: req.flash('success'),
                                error: req.flash('error')
                            });
        });
    });
});

// Ürün ekleme işlemi - input validation ile
router.post('/products', requireAuth, [
    body('name')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Ürün adı 2-200 karakter arası olmalıdır')
        .escape(),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Açıklama maksimum 1000 karakter olabilir')
        .escape(),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Fiyat geçerli bir sayı olmalıdır'),
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Geçerli bir kategori seçiniz'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stok miktarı geçerli bir sayı olmalıdır'),
    body('specifications')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Özellikler maksimum 2000 karakter olabilir')
        .escape(),
    body('colors')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Renkler maksimum 500 karakter olabilir')
        .escape()
], upload.single('image'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg).join(', '));
        return res.redirect('/admin/products/new');
    }
    try {
        const { name, description, price, category_id, specifications, colors, stock, featured } = req.body;
        let image_url = null;
        
        console.log('📝 Ürün ekleme isteği:', {
            name,
            hasFile: !!req.file,
            file: req.file ? req.file.filename : 'No file'
        });
        
        // Resim işleme
        if (req.file) {
            const originalPath = req.file.path;
            const optimizedPath = path.join('public/uploads', `opt-${req.file.filename}`);
            
            console.log('🖼️ Resim işleniyor...', {
                original: originalPath,
                optimized: optimizedPath
            });
            
            try {
                const success = await processImage(originalPath, optimizedPath);
                if (success) {
                    image_url = `/uploads/opt-${req.file.filename}`;
                    console.log('✅ Resim işlendi:', image_url);
                } else {
                    image_url = `/uploads/${req.file.filename}`;
                    console.log('⚠️ Resim işlenemedi, orijinal kullanılıyor');
                }
            } catch (imageError) {
                console.error('❌ Resim işleme hatası:', imageError);
                image_url = `/uploads/${req.file.filename}`;
                console.log('⚠️ Hata nedeniyle orijinal resim kullanılıyor');
            }
        }
        
        const query = `
            INSERT INTO products (name, description, price, category_id, image_url, specifications, colors, stock, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [name, description, price, category_id, image_url, specifications, colors, stock || 0, featured ? 1 : 0], function(err) {
            if (err) {
                console.error('❌ Database hatası:', err);
                req.flash('error', 'Ürün eklenirken hata oluştu');
                return res.redirect('/admin/products/new');
            }
            
            console.log('✅ Ürün başarıyla eklendi:', name);
            req.flash('success', `"${name}" ürünü başarıyla eklendi!`);
            res.redirect('/admin/products');
        });
        
    } catch (error) {
        console.error('❌ Genel hata:', error);
        req.flash('error', 'Beklenmeyen bir hata oluştu');
        res.redirect('/admin/products/new');
    }
});

// Ürün güncelleme işlemi
router.post('/products/edit/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category_id, specifications, colors, stock, featured } = req.body;
        
        console.log('✏️ Ürün güncelleme isteği alındı:', {
            productId,
            name,
            hasFile: !!req.file,
            file: req.file ? req.file.filename : 'No file'
        });
        
        let query, params;
        
        if (req.file) {
            // Yeni resim yüklendi - işle
            const originalPath = req.file.path;
            const optimizedPath = path.join('public/uploads', `opt-${req.file.filename}`);
            
            console.log('🖼️ Resim güncelleniyor ve işleniyor...', {
                original: originalPath,
                optimized: optimizedPath
            });
            
            let image_url;
            
            try {
                const success = await processImage(originalPath, optimizedPath);
                if (success) {
                    image_url = `/uploads/opt-${req.file.filename}`;
                    console.log('✅ Resim işlendi:', image_url);
                } else {
                    image_url = `/uploads/${req.file.filename}`;
                    console.log('⚠️ Resim işlenemedi, orijinal kullanılıyor');
                }
            } catch (imageError) {
                console.error('❌ Resim işleme hatası:', imageError);
                image_url = `/uploads/${req.file.filename}`;
                console.log('⚠️ Hata nedeniyle orijinal resim kullanılıyor');
            }
            
            query = `
                UPDATE products 
                SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, 
                    specifications = ?, colors = ?, stock = ?, featured = ?
                WHERE id = ?
            `;
            params = [name, description, price, category_id, image_url, specifications, colors, stock || 0, featured ? 1 : 0, productId];
        } else {
            // Resim değişmedi
            console.log('📝 Sadece metin bilgileri güncelleniyor...');
            query = `
                UPDATE products 
                SET name = ?, description = ?, price = ?, category_id = ?, 
                    specifications = ?, colors = ?, stock = ?, featured = ?
                WHERE id = ?
            `;
            params = [name, description, price, category_id, specifications, colors, stock || 0, featured ? 1 : 0, productId];
        }
        
        db.run(query, params, function(err) {
            if (err) {
                console.error('❌ Database güncelleme hatası:', err);
                req.flash('error', 'Ürün güncellenirken hata oluştu');
                return res.redirect('/admin/products/edit/' + productId);
            }
            
            console.log('✅ Ürün başarıyla güncellendi:', name);
            req.flash('success', `"${name}" ürünü başarıyla güncellendi!`);
            res.redirect('/admin/products');
        });
        
    } catch (error) {
        console.error('❌ Güncelleme genel hatası:', error);
        req.flash('error', 'Beklenmeyen bir hata oluştu');
        res.redirect('/admin/products/edit/' + req.params.id);
    }
});

// Ürün silme işlemi
router.post('/products/delete/:id', requireAuth, (req, res) => {
    const productId = req.params.id;
    
    // Önce ürün adını al
    db.get('SELECT name FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) {
            req.flash('error', 'Ürün bulunamadı veya silinirken hata oluştu');
            return res.redirect('/admin/products');
        }
        
        // Ürünü sil
        db.run('DELETE FROM products WHERE id = ?', [productId], function(err) {
            if (err) {
                console.error(err);
                req.flash('error', 'Ürün silinirken hata oluştu');
            } else {
                req.flash('success', `"${product.name}" ürünü başarıyla silindi!`);
            }
            res.redirect('/admin/products');
        });
    });
});

// Kategoriler yönetimi
router.get('/categories', requireAuth, (req, res) => {
    db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
        res.render('admin/categories-simple', {
            title: 'Kategori Yönetimi - GaziTech Mobile Admin',
            categories: categories || [],
            success: req.flash('success'),
            error: req.flash('error')
        });
    });
});

// Kategori ekleme
router.post('/categories', requireAuth, upload.single('image'), (req, res) => {
    const { name, description } = req.body;
    let imageUrl = null;
    
    // Resim yüklendi mi kontrol et
    if (req.file) {
        imageUrl = '/uploads/' + req.file.filename;
    }
    
    db.run('INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)', [name, description, imageUrl], function(err) {
        if (err) {
            req.flash('error', 'Kategori eklenirken hata oluştu');
        } else {
            req.flash('success', 'Kategori başarıyla eklendi');
        }
        res.redirect('/admin/categories');
    });
});

// Kategori düzenleme GET (modal için)
router.get('/categories/edit/:id', requireAuth, (req, res) => {
    const categoryId = req.params.id;
    
    db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, category) => {
        if (err || !category) {
            req.flash('error', 'Kategori bulunamadı');
            return res.redirect('/admin/categories');
        }
        
        res.json(category);
    });
});

// Kategori düzenleme POST
router.post('/categories/edit/:id', requireAuth, upload.single('image'), (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    
    // Önce mevcut kategoriyi al
    db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, category) => {
        if (err || !category) {
            req.flash('error', 'Kategori bulunamadı');
            return res.redirect('/admin/categories');
        }
        
        let imageUrl = category.image_url; // Mevcut resmi koru
        
        // Yeni resim yüklendi mi kontrol et
        if (req.file) {
            imageUrl = '/uploads/' + req.file.filename;
        }
        
        db.run('UPDATE categories SET name = ?, description = ?, image_url = ? WHERE id = ?', 
               [name, description, imageUrl, categoryId], function(err) {
            if (err) {
                req.flash('error', 'Kategori güncellenirken hata oluştu');
            } else {
                req.flash('success', 'Kategori başarıyla güncellendi');
            }
            res.redirect('/admin/categories');
        });
    });
});

// Kategori silme
router.post('/categories/delete/:id', requireAuth, (req, res) => {
    const categoryId = req.params.id;
    
    // Önce bu kategoride ürün var mı kontrol et
    db.get('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [categoryId], (err, result) => {
        if (result && result.count > 0) {
            req.flash('error', 'Bu kategoride ürünler bulunuyor. Önce ürünleri silin veya başka kategoriye taşıyın.');
            return res.redirect('/admin/categories');
        }
        
        db.run('DELETE FROM categories WHERE id = ?', [categoryId], function(err) {
            if (err) {
                req.flash('error', 'Kategori silinirken hata oluştu');
            } else {
                req.flash('success', 'Kategori başarıyla silindi');
            }
            res.redirect('/admin/categories');
        });
    });
});

module.exports = router;