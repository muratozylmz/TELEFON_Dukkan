import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

const categories = [
  { name: 'Apple', value: 'apple' },
  { name: 'Samsung', value: 'samsung' },
  { name: 'Xiaomi', value: 'xiaomi' },
  { name: 'Oppo', value: 'oppo' },
  { name: 'Diğer', value: 'diger' },
];

const Navbar: React.FC<{ onCategorySelect?: (cat: string) => void }> = ({ onCategorySelect }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-700 shadow text-white sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-3">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="bg-white rounded-full p-1"><svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#6366f1"/><text x="16" y="22" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">T</text></svg></span>
          TelefonDünyası
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className={location.pathname === '/' ? 'underline' : 'hover:underline'}>Ana Sayfa</Link>
          <div className="relative group">
            <button className="hover:underline">Kategoriler</button>
            <div className="absolute left-0 mt-2 bg-white text-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto min-w-[140px]">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                  onClick={() => onCategorySelect && onCategorySelect(cat.value)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'underline' : 'hover:underline'}>Admin Paneli</Link>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </nav>
      {/* Mobil Menü */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-700 to-purple-700 px-4 pb-4 flex flex-col gap-2 animate-fade-in-down">
          <Link to="/" className="py-2" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link>
          <div className="flex flex-col">
            <span className="font-semibold">Kategoriler</span>
            {categories.map(cat => (
              <button
                key={cat.value}
                className="text-left px-2 py-1 hover:bg-blue-100 hover:text-blue-700 rounded"
                onClick={() => { onCategorySelect && onCategorySelect(cat.value); setMenuOpen(false); }}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <Link to="/admin" className="py-2" onClick={() => setMenuOpen(false)}>Admin Paneli</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar; 