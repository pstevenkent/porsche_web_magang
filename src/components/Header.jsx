import React from 'react';

// Komponen untuk setiap tombol navigasi (Kembali ke Desain Awal Kamu)
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
    /* PERUBAHAN DI SINI: bg-gray-50/90 membuat boks background header ini menjadi abu-abu yang jauh lebih terang, bersih, dan memantulkan efek blur */
    <header className="w-full bg-gray-50/90 backdrop-blur-md p-8 rounded-t-xl border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Kolom Kiri: Logo Porsche */}
        <div className="flex-shrink-0 transition-opacity duration-300 hover:opacity-80">
          <img 
            src="/images/Porsche_wordmark_black_rgb.png"
            alt="Porsche Logo" 
            className="h-5 md:h-6" 
          />
        </div>

        {/* Kolom Kanan: Navigasi */}
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavButton onClick={() => changePage('viewcatalogue')} isActive={page === 'viewcatalogue' || page === 'detail' || page === 'compare'}>
            View Catalogue
          </NavButton>
          <NavButton onClick={() => changePage('manageproducts')} isActive={page === 'manageproducts' || page === 'editproduct' || page === 'archive'}>
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