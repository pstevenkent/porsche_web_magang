import React, { useState, useEffect } from 'react';
import CarCard from '../components/CarCard';

// -------------------------------------------------------------

// 🔍 Komponen Icon
const SearchIcon = () => (
  <svg
    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-porscheGray-dark"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CompareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" /><path d="M4 19l6-6" /><path d="M21 3l-6 6" /><path d="M3 16v5h5" /><path d="M10 10l6 6" />
    </svg>
);

// 🔍 Komponen SearchBar + Dropdown + Compare Button
function SearchBarWithFilter({
  query,
  onQueryChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  onCompare
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
      {/* SearchBar */}
      <div className="relative w-full md:flex-grow md:max-w-lg">
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by Comm. Nr..."
          className="w-full rounded-full border border-porscheGray bg-white py-3 pl-12 pr-4 text-porscheBlack transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50"
        />
      </div>

      {/* Right Side: Dropdown & Compare Button */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        {/* Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full sm:w-52 rounded-full border border-porscheGray bg-white py-3 px-4 text-porscheBlack cursor-pointer transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50"
        >
          <option value="">All models</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Compare Button */}
        <button
            onClick={onCompare}
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-porscheBlack px-6 py-3 text-white font-bold transition hover:bg-porscheRed hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-porscheRed/50 whitespace-nowrap"
        >
            <CompareIcon />
            <span>Compare</span>
        </button>
      </div>
    </div>
  );
}

export default function CataloguePage({ onSelectCar, onCompare }) {
  const [carData, setCarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // State untuk Filter Mode (All / Special)
  const [filterMode, setFilterMode] = useState('all');

  // Scroll handling
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Fetch Data Mobil
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/cars');
        const result = await response.json();

        if (result.status === 'success' && result.data.cars) {
          // Kelompokkan mobil berdasarkan tipe (kata pertama dari nama mobil)
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

  // Restore Scroll Position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem("catalogueScroll", window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      const savedScroll = sessionStorage.getItem("catalogueScroll");
      if (savedScroll) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, parseInt(savedScroll, 10));
          });
        });
      }
    }
  }, [loading, error]);

  return (
    <div className="p-4 sm:p-8 bg-white font-porsche rounded-b-xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-wider text-porscheBlack">MODELS</h1>
        <p className="text-porscheGray-dark mt-2">Find your perfect Porsche.</p>
      </header>

      <SearchBarWithFilter
        query={searchQuery}
        onQueryChange={setSearchQuery}
        categories={Object.keys(carData)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onCompare={onCompare}
      />

      {/* --- TOMBOL SPECIAL PRICE (TANPA FIREWORKS) --- */}
      <div className="mb-12 flex justify-center gap-4">
        <button
          onClick={() => setFilterMode('all')}
          className={`rounded-lg px-6 py-2 text-sm font-bold transition ${
            filterMode === 'all'
              ? 'bg-porscheBlack text-white shadow-md'
              : 'bg-porscheGray-light text-porscheBlack hover:bg-porscheGray'
          }`}
        >
          All Models
        </button>

        <button
          onClick={() => setFilterMode('special')}
          className={`rounded-lg px-6 py-2 text-sm font-bold transition ${
            filterMode === 'special'
              ? 'bg-porscheRed text-white shadow-md'
              : 'bg-porscheGray-light text-porscheBlack hover:bg-porscheGray'
          }`}
        >
          Special Price Cars
        </button>
      </div>
      {/* ------------------------------------------- */}

      {loading && <p className="text-center text-lg">Loading catalogue...</p>}
      {error && <p className="text-center text-lg text-porscheRed">Error: {error}</p>}

      {!loading && !error && (
        <div className="space-y-16">
          {Object.entries(carData)
            .filter(([type]) => !selectedCategory || selectedCategory === type)
            .map(([type, models]) => {

              // 1. Filter berdasarkan Search Query
              const searchedModels = models.filter(car =>
                car.commnr.toLowerCase().includes(searchQuery.toLowerCase())
              );

              // 2. Filter berdasarkan Mode (All / Special)
              const finalDisplayedModels = searchedModels.filter(car => {
                if (filterMode === 'all') return true;
                if (filterMode === 'special') return car.specialprice && car.specialprice > 0;
                return true;
              });

              // Jangan render section jika tidak ada mobil yang cocok
              if (finalDisplayedModels.length === 0) return null;

              return (
                <section key={type} id={`section-${type}`}>
                  <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-porscheBlack">
                    The {type} models
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                    {finalDisplayedModels.map(car => (
                      <CarCard 
                        key={car.id}
                        car={car}
                        onSelect={onSelectCar}
                        filterMode={filterMode} // Pass filterMode untuk styling harga
                      />
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