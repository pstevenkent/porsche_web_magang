import React from 'react';

// Komponen untuk setiap tombol navigasi
const NavButton = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    // Ukuran font dan padding dikembalikan ke ukuran semula
    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${
      isActive
        ? 'bg-porscheRed text-white shadow-md'
        : 'text-black hover:bg-white/80'
    }`}
  >
    {children}
  </button>
);

export default function Header({ page, setPage }) {
  return (
    <header className="w-full backdrop-blur-sm p-7 rounded-t-xl">
      <div className="flex items-center justify-between">
        
        {/* Kolom Kiri: Judul (ukuran font dikembalikan) */}
        <div className="text-left flex-shrink-0">
        <img 
            src="/images/Porsche_wordmark_black_rgb.png"
            alt="Porsche Logo" 
            className="h-5" // Tinggi logo tetap kecil
          />
        </div>
        {/* Kolom Kanan: Tombol Navigasi (jarak antar tombol dikembalikan) */}
        <nav className="flex items-center space-x-8">
          <NavButton onClick={() => setPage('baca')} isActive={page === 'baca'}>
            View CSV
          </NavButton>
          <NavButton onClick={() => setPage('banding')} isActive={page === 'banding'}>
            Compare CSV
          </NavButton>
          <NavButton onClick={() => setPage('viewcatalogue')} isActive={page === 'viewcatalogue'}>
            View Catalogue
          </NavButton>
          <NavButton onClick={() => setPage('manageproducts')} isActive={page === 'manageproducts'}>
            Manage Products
          </NavButton>
          <NavButton onClick={() => setPage('addproduct')} isActive={page === 'addproduct'}>
            Add Product
          </NavButton>
        </nav>

      </div>
    </header>
  );
}