import React from 'react';

// SVG Icon untuk pencarian
const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-porscheGray-dark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="relative w-full max-w-lg mx-auto mb-12">
      <SearchIcon />
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search by Comm. Nr..."
        className="w-full rounded-full border border-porscheGray bg-white py-3 pl-12 pr-4 text-porscheBlack transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50"
      />
    </div>
  );
}