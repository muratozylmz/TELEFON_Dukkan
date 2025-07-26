const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Veritabanı bağlantısı ve tablo oluşturma
const db = new sqlite3.Database(path.join(__dirname, 'telefonlar.db'), (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
  } else {
    console.log('SQLite veritabanına bağlanıldı.');
    db.run(`CREATE TABLE IF NOT EXISTS telefonlar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marka TEXT NOT NULL,
      model TEXT NOT NULL,
      fiyat INTEGER NOT NULL,
      aciklama TEXT,
      kategori TEXT,
      foto_url TEXT,
      stok INTEGER,
      renk TEXT
    )`);
  }
});

// Tüm telefonları getir
app.get('/api/telefonlar', (req, res) => {
  db.all('SELECT * FROM telefonlar', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Yeni telefon ekle (fotoğraf ile)
app.post('/api/telefonlar', upload.single('foto'), (req, res) => {
  const { marka, model, fiyat, aciklama, kategori, stok, renk } = req.body;
  const foto_url = req.file ? `/uploads/${req.file.filename}` : null;
  console.log('Yeni telefon ekleme:', { marka, model, fiyat, aciklama, kategori, stok, renk, foto_url });
  db.run(
    'INSERT INTO telefonlar (marka, model, fiyat, aciklama, kategori, foto_url, stok, renk) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [marka, model, fiyat, aciklama, kategori, foto_url, stok, renk],
    function (err) {
      if (err) {
        console.error('EKLEME HATASI:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, marka, model, fiyat, aciklama, kategori, foto_url, stok, renk });
    }
  );
});

// Telefon sil
app.delete('/api/telefonlar/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM telefonlar WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Telefon güncelle (fotoğraf opsiyonel)
app.put('/api/telefonlar/:id', upload.single('foto'), (req, res) => {
  const { id } = req.params;
  const { marka, model, fiyat, aciklama, kategori, stok, renk } = req.body;
  let sql, params;
  if (req.file) {
    const foto_url = `/uploads/${req.file.filename}`;
    sql = 'UPDATE telefonlar SET marka = ?, model = ?, fiyat = ?, aciklama = ?, kategori = ?, foto_url = ?, stok = ?, renk = ? WHERE id = ?';
    params = [marka, model, fiyat, aciklama, kategori, foto_url, stok, renk, id];
  } else {
    sql = 'UPDATE telefonlar SET marka = ?, model = ?, fiyat = ?, aciklama = ?, kategori = ?, stok = ?, renk = ? WHERE id = ?';
    params = [marka, model, fiyat, aciklama, kategori, stok, renk, id];
  }
  console.log('Telefon güncelle:', { id, marka, model, fiyat, aciklama, kategori, stok, renk });
  db.run(sql, params, function (err) {
    if (err) {
      console.error('GÜNCELLEME HATASI:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ updated: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
}); 