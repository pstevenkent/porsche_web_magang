import React, { useState, useEffect } from "react";
import { getAllCarsFromBackend } from "../utils/carUtils"; 
// HAPUS BARIS INI: import { Link } from "react-router-dom"; 

// Icon Restore (Undo)
const RestoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
);

// Icon Back
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

// TERIMA PROPS onBack DI SINI
export default function ArchivePage({ onBack }) {
  const [archivedCars, setArchivedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArchivedCars = async () => {
    try {
      const allCars = await getAllCarsFromBackend();
      const archived = allCars.filter(car => car.is_archived === true);
      setArchivedCars(archived);
    } catch (error) {
      console.error("Failed to fetch cars", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedCars();
  }, []);

  const handleUnarchive = async (id) => {
    if (!window.confirm("Kembalikan mobil ini ke katalog aktif?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/cars/${id}/archive`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        fetchArchivedCars(); 
        alert("Berhasil dikembalikan ke katalog.");
      } else {
        alert("Gagal mengembalikan produk.");
      }
    } catch (error) {
      console.error("Error restoring car:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-porsche text-porscheBlack">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            {/* GANTI Link DENGAN button onClick={onBack} */}
            <button onClick={onBack} className="rounded-full bg-white p-2 shadow hover:bg-gray-100">
                <ArrowLeftIcon />
            </button>
            <div>
                <h1 className="text-3xl font-bold">Archived Products</h1>
                <p className="text-gray-500">Daftar produk yang disembunyikan.</p>
            </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10">Loading archives...</div>
      ) : archivedCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-xl">Tidak ada produk yang diarsipkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {archivedCars.map((car) => (
            <div key={car.id} className="relative overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg opacity-80 hover:opacity-100">
              <div className="h-48 w-full bg-gray-200 relative">
                <img
                  src={car.preview || "https://via.placeholder.com/300"}
                  alt={car.vehicle}
                  className="h-full w-full object-cover" 
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Archived</div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{car.vehicle}</h3>
                <p className="text-sm text-gray-500 mb-4">{car.commnr}</p>
                <button 
                    onClick={() => handleUnarchive(car.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                >
                    <RestoreIcon /> Restore to Catalogue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}