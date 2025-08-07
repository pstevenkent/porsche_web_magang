import React, { useState } from 'react';
import Header from './components/Header';
import ReadCSVPage from './pages/ReadCSVPage';
import CompareCSVPage from './pages/CompareCSVPage';
import HistoryPage from './pages/HistoryPage';
import BackgroundCarousel from './components/BackgroundCarousel'; // Impor komponen baru
import './index.css';

function App() {
  const [page, setPage] = useState("baca");

  return (
    <div className="min-h-screen font-porsche flex flex-col items-center justify-center p-4 sm:p-8">
      <BackgroundCarousel />

      {/* Tambahkan kelas 'app-container' untuk efek transparan */}
      <main className="app-container w-full max-w-7xl p-6 sm:p-8 rounded-xl shadow-lg">
        <Header page={page} setPage={setPage} />
        
        <div className="mt-8">
          {page === "baca" && <ReadCSVPage />}
          {page === "banding" && <CompareCSVPage />}
          {page === "history" && <HistoryPage />}
        </div>
      </main>

       <footer className="text-center py-4 mt-4">
        <p className="text-xs text-white drop-shadow-md">
          &copy; {new Date().getFullYear()} Dr. Ing. h.c. F. Porsche AG. Font Software provided under license.
        </p>
      </footer>
    </div>
  );
}

export default App;