const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Veritabanı dosyasının yolu
const dbPath = path.join(__dirname, process.env.DB_PATH || 'telefon_pro.db');

// Veritabanı bağlantısı oluştur
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlandı.');
    }
});

// Tabloları oluştur
const initDatabase = () => {
    // Kategoriler tablosu
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Mevcut kategoriler tablosuna image_url alanını ekle (eğer yoksa)
    db.run(`ALTER TABLE categories ADD COLUMN image_url TEXT`, (err) => {
        // Bu hata normal - alan zaten varsa hata verir
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Kategori tablosu güncelleme hatası:', err.message);
        }
    });

    // Ürünler tablosu
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        category_id INTEGER,
        image_url TEXT,
        specifications TEXT,
        colors TEXT,
        stock INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )`);

    // Admin kullanıcıları tablosu
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Başlangıç kategorilerini ekle
    insertInitialData();
};

const insertInitialData = () => {
    const categories = [
        'Powerbank',
        'Şarj Kablosu',
        'Wireless Charger',
        'Araba Aksesuarları',
        'Kulaklık',
        'Telefon',
        'Akıllı Saat',
        'Bilgisayar Aksesuarları',
        'Depolama',
        'Ekran Koruyucu',
        'Ev Elektroniği',
        'Tablet',
        'Telefon Kılıfı',
        'Kamera',
        'Diğer'
    ];

    categories.forEach(category => {
        db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [category]);
    });

    // Varsayılan admin kullanıcısı
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!Secure';
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    
    const hashedPassword = bcrypt.hashSync(adminPassword, bcryptRounds);
    db.run('INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)', 
           [adminUsername, hashedPassword]);
    
    console.log('⚠️ GÜVENLIK UYARISI: Varsayılan admin şifresini değiştirin!');
    console.log('🔐 Admin kullanıcı adı:', adminUsername);
};

// Veritabanını başlat
initDatabase();

module.exports = db;