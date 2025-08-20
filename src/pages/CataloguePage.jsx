import React, { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';
import SearchBar from '../components/SearchBar'; // 1. Impor komponen SearchBar

export default function CataloguePage({ onSelectCar }) {
  const [carData, setCarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 2. Tambahkan state baru untuk menyimpan query pencarian
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/cars');
        const result = await response.json();

        if (result.status === 'success' && result.data.cars) {
          const groupedCars = result.data.cars.reduce((acc, car) => {
            const type = car.vehicle.split(' ')[0];
            if (!acc[type]) acc[type] = [];
            acc[type].push(car);
            return acc;
          }, {});
          setCarData(groupedCars);
        } else {
          throw new Error(result.message || 'Gagal mengambil data katalog.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-white font-porsche rounded-b-xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-wider text-porscheBlack">MODELS</h1>
        <p className="text-porscheGray-dark mt-2">Find your perfect Porsche.</p>
      </header>
      
      {/* 3. Tampilkan SearchBar di sini */}
      <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      
      {loading && <p className="text-center text-lg">Loading catalogue...</p>}
      {error && <p className="text-center text-lg text-porscheRed">Error: {error}</p>}

      {!loading && !error && (
        <div className="space-y-16">
          {Object.entries(carData).map(([type, models]) => {
            
            // --- 4. LOGIKA FILTER DITAMBAHKAN DI SINI ---
            const filteredModels = models.filter(car => 
              car.commnr.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Jika setelah difilter tidak ada mobil di kategori ini, jangan tampilkan seksinya
            if (filteredModels.length === 0) {
              return null;
            }
            // --- AKHIR LOGIKA FILTER ---

            return (
              <section key={type}>
                <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-porscheBlack">The {type} models</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {/* Gunakan 'filteredModels' untuk me-render kartu */}
                  {filteredModels.map(car => (
                    <CarCard key={car.id} car={car} onSelect={onSelectCar} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}