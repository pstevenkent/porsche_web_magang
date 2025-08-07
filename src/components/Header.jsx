import React from 'react';

function Header({ page, setPage }) {
  const navLinkBaseStyles = "font-bold text-sm uppercase tracking-wider transition-colors duration-300 pb-1";
  const activeLinkStyles = "text-porscheRed border-b-2 border-porscheRed";
  const inactiveLinkStyles = "text-porscheGray-dark hover:text-porscheBlack border-b-2 border-transparent";

  return (
    <header className="flex justify-between items-center w-full py-4 border-b border-porscheGray">
      <div className="flex-1 text-left">
         <h1 className="text-xl font-bold text-porscheBlack tracking-wide">
           CSV UTILITY
         </h1>
         <p className="text-xs text-porscheGray-dark -mt-1">The Media Portal by Porsche Interns</p>
      </div>
      <div className="flex-shrink-0 hidden md:block">
        <div className="font-porsche text-4xl font-bold tracking-[0.25em] text-porscheBlack">
          PORSCHE
        </div>
      </div>
      <div className="flex-1 flex justify-end items-center space-x-6">
        <button
          onClick={() => setPage("baca")}
          className={`${navLinkBaseStyles} ${page === "baca" ? activeLinkStyles : inactiveLinkStyles}`}
        >
          Baca CSV
        </button>
        <button
          onClick={() => setPage("banding")}
          className={`${navLinkBaseStyles} ${page === "banding" ? activeLinkStyles : inactiveLinkStyles}`}
        >
          Bandingkan CSV
        </button>
        <button
          onClick={() => setPage("history")}
          className={`${navLinkBaseStyles} ${page === "history" ? activeLinkStyles : inactiveLinkStyles}`}
        >
          History
        </button>
      </div>
    </header>
  );
}

export default Header;