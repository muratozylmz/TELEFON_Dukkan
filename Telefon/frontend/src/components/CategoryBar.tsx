import * as React from 'react';
import { JSX } from 'react';

const kategoriBilgi: Record<string, { renk: string; icon: JSX.Element }> = {
  apple: { renk: 'bg-gradient-to-br from-gray-900 to-gray-700 text-white', icon: <i className="bi bi-apple" style={{fontSize:48}} /> },
  samsung: { renk: 'bg-gradient-to-br from-blue-400 to-blue-700 text-white', icon: <i className="bi bi-phone" style={{fontSize:48}} /> },
  xiaomi: { renk: 'bg-gradient-to-br from-orange-400 to-yellow-500 text-white', icon: <i className="bi bi-lightning" style={{fontSize:48}} /> },
  oppo: { renk: 'bg-gradient-to-br from-green-400 to-green-700 text-white', icon: <i className="bi bi-phone" style={{fontSize:48}} /> },
  diger: { renk: 'bg-gradient-to-br from-purple-400 to-pink-500 text-white', icon: <i className="bi bi-grid" style={{fontSize:48}} /> },
};

const kategoriler = [
  { name: 'Apple', value: 'apple' },
  { name: 'Samsung', value: 'samsung' },
  { name: 'Xiaomi', value: 'xiaomi' },
  { name: 'Oppo', value: 'oppo' },
  { name: 'Diğer', value: 'diger' },
];

interface CategoryBarProps {
  aktifKategori: string | null;
  onKategoriSec: (kategori: string | null) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ aktifKategori, onKategoriSec }) => (
  <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4 mb-8">
    <div
      className={`flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 transition-all duration-200 ${aktifKategori === null ? 'border-green-500 scale-105 shadow-green-200' : 'border-transparent hover:border-green-300 hover:scale-105'}`}
      onClick={() => onKategoriSec(null)}
    >
      <div className="flex items-center justify-center mb-3">
        <i className="bi bi-list" style={{fontSize:48, color: aktifKategori === null ? '#16a34a' : '#888'}} />
      </div>
      <span className={`text-lg font-semibold ${aktifKategori === null ? 'text-green-700' : 'text-gray-700'}`}>Tümü</span>
    </div>
    {kategoriler.map(kat => (
      <div
        key={kat.value}
        className={`flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 transition-all duration-200 ${aktifKategori === kat.value ? 'border-blue-500 scale-105 shadow-blue-200' : 'border-transparent hover:border-blue-300 hover:scale-105'}`}
        onClick={() => onKategoriSec(kat.value)}
      >
        <div className="flex items-center justify-center mb-3">
          {kategoriBilgi[kat.value].icon}
        </div>
        <span className={`text-lg font-semibold ${aktifKategori === kat.value ? 'text-blue-700' : 'text-gray-700'}`}>{kat.name}</span>
      </div>
    ))}
  </div>
);

export default CategoryBar; 