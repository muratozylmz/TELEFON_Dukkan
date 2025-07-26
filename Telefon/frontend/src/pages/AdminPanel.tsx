import * as React from 'react';
import { useEffect, useState, ChangeEvent } from 'react';

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

const kategoriler = [
  'Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Diğer'
];

const renkler = [
  'Siyah', 'Beyaz', 'Gri', 'Mavi', 'Kırmızı', 'Yeşil', 'Altın', 'Mor', 'Diğer'
];

const AdminPanel: React.FC = () => {
  const [telefonlar, setTelefonlar] = useState<Telefon[]>([]);
  const [form, setForm] = useState({ marka: '', model: '', fiyat: '', aciklama: '', kategori: '', stok: '', renk: '' });
  const [foto, setFoto] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [mesajTip, setMesajTip] = useState<'success' | 'error' | null>(null);

  const fetchTelefonlar = () => {
    fetch('http://localhost:5000/api/telefonlar')
      .then(res => res.json())
      .then(data => setTelefonlar(data));
  };

  useEffect(() => {
    fetchTelefonlar();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMesaj(null);
    setMesajTip(null);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (foto) formData.append('foto', foto);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5000/api/telefonlar/${editId}` : 'http://localhost:5000/api/telefonlar';
    fetch(url, {
      method,
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          setMesaj(data.error || 'Bir hata oluştu!');
          setMesajTip('error');
          return;
        }
        setMesaj(editId ? 'Başarıyla güncellendi!' : 'Başarıyla eklendi!');
        setMesajTip('success');
        setForm({ marka: '', model: '', fiyat: '', aciklama: '', kategori: '', stok: '', renk: '' });
        setFoto(null);
        setEditId(null);
        fetchTelefonlar();
      })
      .catch(() => {
        setMesaj('Sunucuya ulaşılamadı!');
        setMesajTip('error');
      });
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5000/api/telefonlar/${id}`, { method: 'DELETE' })
      .then(() => fetchTelefonlar());
  };

  const handleEdit = (tel: Telefon) => {
    setForm({
      marka: tel.marka,
      model: tel.model,
      fiyat: String(tel.fiyat),
      aciklama: tel.aciklama || '',
      kategori: tel.kategori || '',
      stok: tel.stok ? String(tel.stok) : '',
      renk: tel.renk || '',
    });
    setEditId(tel.id);
    setFoto(null);
  };

  return (
    <div className="container py-4">
      <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>
      {mesaj && (
        <div className={`alert ${mesajTip === 'success' ? 'alert-success' : 'alert-danger'} fw-bold`}>{mesaj}</div>
      )}
      <form onSubmit={handleSubmit} className="mb-6 row g-3 bg-white p-4 rounded shadow-lg">
        <div className="col-md-4">
          <label className="form-label">Marka</label>
          <input name="marka" value={form.marka} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Model</label>
          <input name="model" value={form.model} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Fiyat (TL)</label>
          <input name="fiyat" value={form.fiyat} onChange={handleChange} type="number" className="form-control" required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Kategori</label>
          <select name="kategori" value={form.kategori} onChange={handleChange} className="form-select" required>
            <option value="">Seçiniz</option>
            {kategoriler.map(kat => <option key={kat} value={kat.toLowerCase()}>{kat}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Stok</label>
          <input name="stok" value={form.stok} onChange={handleChange} type="number" className="form-control" required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Renk</label>
          <select name="renk" value={form.renk} onChange={handleChange} className="form-select" required>
            <option value="">Seçiniz</option>
            {renkler.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="col-md-12">
          <label className="form-label">Açıklama</label>
          <textarea name="aciklama" value={form.aciklama} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-12">
          <label className="form-label">Fotoğraf</label>
          <input type="file" accept="image/*" onChange={handleFotoChange} className="form-control" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100 py-2">
            {editId ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>
      <div className="row g-4">
        {telefonlar.map(tel => (
          <div key={tel.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              {tel.foto_url && <img src={`http://localhost:5000${tel.foto_url}`} alt="Telefon" className="card-img-top object-fit-cover" style={{height:180, objectFit:'cover'}} />}
              <div className="card-body">
                <h5 className="card-title">{tel.marka} {tel.model}</h5>
                <p className="card-text mb-1"><b>Kategori:</b> {tel.kategori}</p>
                <p className="card-text mb-1"><b>Fiyat:</b> {tel.fiyat} TL</p>
                <p className="card-text mb-1"><b>Stok:</b> {tel.stok}</p>
                <p className="card-text mb-1"><b>Renk:</b> {tel.renk}</p>
                {tel.aciklama && <p className="card-text text-muted small">{tel.aciklama}</p>}
              </div>
              <div className="card-footer d-flex gap-2">
                <button onClick={() => handleEdit(tel)} className="btn btn-warning btn-sm flex-fill">Düzenle</button>
                <button onClick={() => handleDelete(tel.id)} className="btn btn-danger btn-sm flex-fill">Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel; 