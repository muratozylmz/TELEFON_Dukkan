import * as React from 'react';
import { useEffect, useState, JSX } from 'react';
import CategoryBar from '../components/CategoryBar';

interface Telefon {
  id: number;
  marka: string;
  model: string;
  fiyat: number;
  aciklama?: string;
  kategori?: string;
  foto_url?: string;
  stok?: number;
  renk?: string;
}

interface HomeProps {
  selectedCategory?: string | null;
}

const kategoriBilgi: Record<string, { renk: string; icon: JSX.Element }> = {
  apple: { renk: 'bg-gradient-to-r from-gray-900 to-gray-700 text-white', icon: <i className="bi bi-apple" /> },
  samsung: { renk: 'bg-gradient-to-r from-blue-400 to-blue-700 text-white', icon: <i className="bi bi-phone" /> },
  xiaomi: { renk: 'bg-gradient-to-r from-orange-400 to-yellow-500 text-white', icon: <i className="bi bi-lightning" /> },
  oppo: { renk: 'bg-gradient-to-r from-green-400 to-green-700 text-white', icon: <i className="bi bi-phone" /> },
  diger: { renk: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white', icon: <i className="bi bi-grid" /> },
};

const kategoriler = [
  { name: 'Apple', value: 'apple' },
  { name: 'Samsung', value: 'samsung' },
  { name: 'Xiaomi', value: 'xiaomi' },
  { name: 'Oppo', value: 'oppo' },
  { name: 'Diğer', value: 'diger' },
];

const Home: React.FC<HomeProps> = ({ selectedCategory }) => {
  const [telefonlar, setTelefonlar] = useState<Telefon[]>([]);
  const [loading, setLoading] = useState(true);
  const [aktifKategori, setAktifKategori] = useState<string | null>(selectedCategory || null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/telefonlar')
      .then(res => res.json())
      .then(data => {
        setTelefonlar(data);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    setAktifKategori(selectedCategory || null);
  }, [selectedCategory]);

  const filtered = aktifKategori && aktifKategori !== 'diger'
    ? telefonlar.filter(t => t.kategori?.toLowerCase() === aktifKategori)
    : aktifKategori === 'diger'
      ? telefonlar.filter(t => !['apple','samsung','xiaomi','oppo'].includes((t.kategori||'').toLowerCase()))
      : telefonlar;

  return (
    <>
      <CategoryBar aktifKategori={aktifKategori} onKategoriSec={setAktifKategori} />
      <div className="container py-4">
        <div className="flex flex-col items-center mb-4 mt-3">
          <h1 className="text-4xl font-extrabold mb-2 text-blue-700 drop-shadow">TelefonDünyası</h1>
          <p className="text-lg text-gray-600">En popüler ve güncel telefon modellerini keşfet!</p>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{height:120}}>
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Yükleniyor...</span></div>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.length === 0 ? (
              <div className="col-12 text-center text-gray-400 fs-4">Ürün bulunamadı.</div>
            ) : filtered.map(tel => (
              <div key={tel.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  {tel.foto_url && <img src={`http://localhost:5000${tel.foto_url}`} alt="Telefon" className="card-img-top object-fit-cover" style={{height:180, objectFit:'cover'}} />}
                  <div className="card-body">
                    <h5 className="card-title">{tel.marka} {tel.model}</h5>
                    <div className="mb-2">
                      <span className={`badge ${kategoriBilgi[tel.kategori?.toLowerCase()||'diger']?.renk || 'bg-secondary'} me-2`}>{tel.kategori || 'Diğer'}</span>
                      <span className="badge bg-info me-2">Stok: {tel.stok}</span>
                      <span className="badge bg-warning text-dark">Renk: {tel.renk}</span>
                    </div>
                    <p className="card-text mb-1"><b>Fiyat:</b> {tel.fiyat} TL</p>
                    {tel.aciklama && <p className="card-text text-muted small">{tel.aciklama}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home; 