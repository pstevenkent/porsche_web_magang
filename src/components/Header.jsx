import React from 'react';

// Komponen untuk setiap tombol navigasi
const NavButton = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-md transition-all duration-500 ${
      isActive
        ? 'bg-porscheRed text-white shadow-lg'
        : 'text-black hover:bg-gray-100/50'
    }`}
  >
    {children}
  </button>
);

export default function Header({ page, setPage }) {
  // Fungsi helper untuk proteksi halaman yang dinonaktifkan
  const changePage = (newPage) => {
    const disabledPages = ['baca', 'banding'];
    if (!disabledPages.includes(newPage)) {
      setPage(newPage);
    }
  };

  return (
    <header className="w-full backdrop-blur-md p-8 rounded-t-xl border-b border-gray-100/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Kolom Kiri: Logo Porsche */}
        <div className="flex-shrink-0 transition-opacity duration-300 hover:opacity-80">
          <img 
            src="/images/Porsche_wordmark_black_rgb.png"
            alt="Porsche Logo" 
            className="h-5 md:h-6" // Sedikit lebih besar agar tegas
          />
        </div>

        {/* Kolom Kanan: Navigasi dengan jarak yang lebih lega (space-x-12) */}
        <nav className="flex items-center space-x-6 lg:space-x-12">
          {/* Tombol CSV disembunyikan sepenuhnya dari aliran dokumen */}
          {/* <NavButton onClick={() => changePage('baca')} isActive={page === 'baca'}>
            View CSV
          </NavButton>
          <NavButton onClick={() => changePage('banding')} isActive={page === 'banding'}>
            Compare CSV
          </NavButton> 
          */}

          <NavButton onClick={() => changePage('viewcatalogue')} isActive={page === 'viewcatalogue'}>
            View Catalogue
          </NavButton>
          <NavButton onClick={() => changePage('manageproducts')} isActive={page === 'manageproducts'}>
            Manage Products
          </NavButton>
          <NavButton onClick={() => changePage('addproduct')} isActive={page === 'addproduct'}>
            Add Product
          </NavButton>
        </nav>

      </div>
    </header>
  );
}