import React, { useState } from 'react';
import Header from './components/header';
import ReadCSVPage from './pages/ReadCSVPage';
import CompareCSVPage from './pages/comparecsvpage';
import HistoryPage from './pages/HistoryPage';
import CataloguePage from './pages/CataloguePage';
import ConfiguratorPage from './pages/ConfiguratorPage';
import AddProductPage from './pages/AddProductPage'; // <-- Impor halaman baru
import BackgroundCarousel from './components/BackgroundCarousel';
import './index.css';

export default function App() {
  const [page, setPage] = useState("baca");
  const [selectedCar, setSelectedCar] = useState(null);

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setPage('configurator');
  };

  const handleBackToCatalogue = () => {
    setSelectedCar(null);
    setPage('viewcatalogue');
  };

  return (
    <div className="min-h-screen font-porsche">
      <BackgroundCarousel />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <main className="app-container w-full max-w-7xl p-6 sm:p-8 rounded-xl shadow-lg">
          
          <Header page={page} setPage={setPage} />
          
          <div className="mt-8">
            {page === "baca" && <ReadCSVPage />}
            {page === "banding" && <CompareCSVPage />}
            {page === "history" && <HistoryPage />}
            {page === "viewcatalogue" && <CataloguePage onSelectCar={handleSelectCar} />}
            {page === "configurator" && <ConfiguratorPage car={selectedCar} onBack={handleBackToCatalogue} />}
            {/* Tambahkan render kondisional untuk halaman baru */}
            {page === "addproduct" && <AddProductPage />}
          </div>

        </main>
        <footer className="text-center py-4 mt-4">
          <p className="text-xs text-white drop-shadow-md">
            &copy; {new Date().getFullYear()} Dr. Ing. h.c. F. Porsche AG. Font Software provided under license.
          </p>
        </footer>
      </div>
    </div>
  );
}
