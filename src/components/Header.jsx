import React from 'react';

function Header({ page, setPage }) {
  const navLinkBaseStyles =
    "font-bold text-sm uppercase tracking-wider transition-colors duration-300 pb-1";
  const activeLinkStyles = "text-porscheRed border-b-2 border-porscheRed";
  const inactiveLinkStyles =
    "text-porscheGray-dark hover:text-porscheBlack border-b-2 border-transparent";

  return (
    <header className="flex justify-between items-center w-full py-4 border-b border-porscheGray">
      {/* Kiri */}

      <div className="flex-1 text-left">
        <h1 className="text-xl font-bold text-porscheBlack tracking-wide">
          CSV UTILITY
        </h1>
        <p className="text-xs text-porscheGray-dark -mt-1">
          The Media Portal by Porsche Interns
        </p>
        
      </div>
      

      {/* Tengah (Logo Porsche) */}
      <div className="flex-shrink-0 hidden md:block">
        <img
          src="/images/Porsche_wordmark_black_rgb.png"
          alt="Porsche Logo"
          className="h-4 w-auto object-contain"
        />
      </div>

      {/* Kanan */}
      <div className="flex-1 flex justify-end items-center space-x-6">
        <button
          onClick={() => setPage("baca")}
          className={`${navLinkBaseStyles} ${
            page === "baca" ? activeLinkStyles : inactiveLinkStyles
          }`}
        >
          View CSV
          {/* </button>
        <button
          onClick={() => setPage("banding")}
          className={`${navLinkBaseStyles} ${
            page === "banding" ? activeLinkStyles : inactiveLinkStyles
          }`}
        >
          Porsche Centre Surabaya */}
        </button>
        <button
          onClick={() => setPage("banding")}
          className={`${navLinkBaseStyles} ${
            page === "banding" ? activeLinkStyles : inactiveLinkStyles
          }`}
        >
          Compare CSV
        </button>
        <button
          onClick={() => setPage("viewcatalogue")}
          className={`${navLinkBaseStyles} ${page === "viewcatalogue" ? activeLinkStyles : inactiveLinkStyles}`}
        >
          View Catalogue
          
          </button>
        {/* Tombol Baru Ditambahkan di Sini */}
        <button
          onClick={() => setPage("addproduct")}
          className={`${navLinkBaseStyles} ${page === "addproduct" ? activeLinkStyles : inactiveLinkStyles}`}
        >
          Add Product
          
        </button>
      </div>
    </header>
  );
}

export default Header;
