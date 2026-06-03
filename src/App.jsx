import React, { useState } from 'react';
import Header from './components/header'; 
import ReadCSVPage from './pages/ReadCSVPage';
import CompareCSVPage from './pages/CompareCSVPage';
import HistoryPage from './pages/HistoryPage';
import CataloguePage from './pages/CataloguePage';
import DetailPage from './pages/DetailPage';
import AddProductPage from './pages/AddProductPage';
import ManageProductsPage from './pages/ManageProductsPage';
import BackgroundCarousel from './components/BackgroundCarousel';
import AddProductForm from './components/AddProductForm';
import CompareCarsPage from './pages/CompareCarsPage';
import ArchivePage from './pages/ArchivePage';
import './index.css';

export default function App() {
  const [page, setPage] = useState("viewcatalogue"); 
  const [selectedCar, setSelectedCar] = useState(null);
  const [carToEdit, setCarToEdit] = useState(null);

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setPage('detail');
  };

  const handleBackToCatalogue = () => {
    setSelectedCar(null);
    setPage('viewcatalogue');
  };

  const handleEditCar = (car) => {
    setCarToEdit(car);
    setPage('editproduct');
  };

  const handleSave = () => {
    setCarToEdit(null);
    setPage('manageproducts');
  };

  return (
    <div className="min-h-screen font-porsche">
      <BackgroundCarousel />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <main className="app-container w-full max-w-7xl p-6 sm:p-8 rounded-xl shadow-lg bg-gray-50 text-porscheBlack">
          <Header page={page} setPage={setPage} />
          
          <div className="mt-8">
            {page === "history" && <HistoryPage />}
            
            {page === "viewcatalogue" && (
              <CataloguePage 
                onSelectCar={handleSelectCar} 
                onCompare={() => setPage('compare')} 
              />
            )}

            {page === "detail" && <DetailPage car={selectedCar} onBack={handleBackToCatalogue} />}
            {page === "compare" && <CompareCarsPage />}
            {page === "addproduct" && <AddProductPage />}
            
            {page === "manageproducts" && (
                <ManageProductsPage 
                    onEdit={handleEditCar} 
                    onOpenArchive={() => setPage('archive')} 
                />
            )}
            
            {page === "archive" && (
                <ArchivePage 
                    onBack={() => setPage('manageproducts')} 
                />
            )}

            {/* 🛠️ FIX PROTEKSI ANTI-BLANK: Mengamankan render agar AddProductForm tidak crash saat data transisi */}
            {page === "editproduct" && (
              <div className="w-full bg-white p-6 sm:p-8 rounded-xl border border-gray-200">
                <button 
                  onClick={handleSave} 
                  className="mb-6 text-sm font-bold text-porscheGray-dark hover:text-porscheBlack transition-colors flex items-center gap-2"
                >
                  &larr; Back to Management List
                </button>
                
                {carToEdit ? (
                  <AddProductForm initialData={carToEdit} onSave={handleSave} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="loader mb-4"></div>
                    <p className="text-sm text-gray-500 font-bold">Loading configuration data...</p>
                  </div>
                )}
              </div>
            )}
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