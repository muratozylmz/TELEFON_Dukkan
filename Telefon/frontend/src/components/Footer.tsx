import * as React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-8 mt-12">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white rounded-full p-1"><svg width="28" height="28" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#6366f1"/><text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">T</text></svg></span>
          <span className="font-bold text-lg">TelefonDünyası</span>
        </div>
        <p className="text-sm text-gray-200">En güncel ve popüler telefon modelleri burada!<br/>Sadece incele, karşılaştır, karar ver.</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="font-semibold">İletişim</span>
        <a href="mailto:info@telefondunyasi.com" className="text-gray-200 hover:underline">info@telefondunyasi.com</a>
        <div className="flex gap-3 mt-2">
          <a href="#" aria-label="Instagram" className="hover:text-pink-300"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm4.25 2.75a5.75 5.75 0 1 1 0 11.5a5.75 5.75 0 0 1 0-11.5Zm0 1.5a4.25 4.25 0 1 0 0 8.5a4.25 4.25 0 0 0 0-8.5Zm5.25 1.25a1 1 0 1 1 0 2a1 1 0 0 1 0-2Z"/></svg></a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-300"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475a8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 11.03 9.03a12.72 12.72 0 0 1-9.24-4.684a4.48 4.48 0 0 0 1.39 5.98a4.47 4.47 0 0 1-2.03-.56v.057a4.48 4.48 0 0 0 3.59 4.39a4.5 4.5 0 0 1-2.02.077a4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78c0-.19-.01-.38-.02-.57A9.1 9.1 0 0 0 22 5.924Z"/></svg></a>
          <a href="#" aria-label="Facebook" className="hover:text-blue-400"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.692v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788c1.325 0 2.463.099 2.797.143v3.24l-1.92.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
        </div>
      </div>
      <div className="text-xs text-gray-200 mt-4 md:mt-0">&copy; {new Date().getFullYear()} TelefonDünyası. Tüm hakları saklıdır.</div>
    </div>
  </footer>
);

export default Footer; 