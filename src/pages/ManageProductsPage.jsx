import React, { useState, useEffect } from "react";
import AddProductForm from "../components/AddProductForm";
import { getAllCarsFromBackend } from "../utils/carUtils"; 

// --- ICONS ---
const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-porscheGray-dark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const ArchiveIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>);

export default function ManageProductsPage({ onEdit, onOpenArchive }) {
  const [carData, setCarData] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); 

  const fetchCars = async () => {
    setLoading(true);
    try {
        const data = await getAllCarsFromBackend();
        const activeCars = data.filter(car => !car.is_archived);
        
        const groupedCars = activeCars.reduce((acc, car) => {
          const type = car.vehicle ? car.vehicle.split(' ')[0] : "Unknown";
          if (!acc[type]) acc[type] = [];
          acc[type].push(car);
          return acc;
        }, {});

        setCarData(groupedCars);
    } catch (error) {
        console.error("Failed to fetch cars", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product PERMANENTLY?")) return;
    try {
      await fetch(`http://localhost:8080/api/v1/cars/${id}`, { method: "DELETE" });
      fetchCars(); 
    } catch (error) {
      console.error("Failed to delete car", error);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Arsipkan produk ini?")) return;
    try {
        const response = await fetch(`http://localhost:8080/api/v1/cars/${id}/archive`, {
            method: 'PATCH'
        });
        if (response.ok) {
            fetchCars(); 
        }
    } catch (error) {
        console.error("Failed to archive car", error);
    }
  };

  // JALUR DATA EDIT: Mengirimkan data ke App.jsx agar navigasi sinkron
  const handleEdit = (car) => {
    if (onEdit) {
        onEdit(car);
    } else {
        setEditingCar(car);
        setIsAdding(true);
    }
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingCar(null);
    fetchCars();
  };

  if (isAdding) {
    return (
      <div className="min-h-screen bg-white p-8">
        <button onClick={handleCloseForm} className="mb-4 text-sm font-bold text-porscheGray-dark hover:text-porscheBlack">&larr; Back to List</button>
        <AddProductForm initialData={editingCar} onSave={handleCloseForm} />
      </div>
    );
  }

  let totalDisplayedItems = 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-porsche text-porscheBlack">
      {/* HEADER AREA */}
      <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
        <div>
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <p className="text-gray-500">Manage your vehicle inventory.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            
            {/* SEARCH BAR INPUT */}
            <div className="relative w-full md:w-80">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Name or Comm. Nr..."
                  className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-porscheBlack transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50 shadow-sm"
                />
            </div>

            {/* DROPDOWN KATEGORI */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-52 rounded-full border border-gray-300 bg-white py-3 px-4 text-porscheBlack cursor-pointer transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50 shadow-sm"
            >
              <option value="">All models</option>
              {Object.keys(carData).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
                <button 
                    onClick={onOpenArchive}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-bold text-gray-600 transition hover:bg-gray-100 shadow-sm whitespace-nowrap w-full md:w-auto"
                >
                    <ArchiveIcon /> History-Archives
                </button>
            </div>
        </div>
      </div>

      {loading && <p className="text-center text-lg py-10">Loading inventory...</p>}

      {/* RENDER LIST BERDASARKAN KATEGORI DAN PENCARIAN */}
      {!loading && (
        <div className="space-y-12">
          {Object.entries(carData)
            .filter(([type]) => !selectedCategory || selectedCategory === type)
            .map(([type, models]) => {
              
              const searchedModels = models.filter((car) => {
                const query = searchQuery.toLowerCase();
                const matchName = car.vehicle && car.vehicle.toLowerCase().includes(query);
                const matchComm = car.commnr && car.commnr.toLowerCase().includes(query);
                return matchName || matchComm;
              });

              if (searchedModels.length === 0) return null;
              totalDisplayedItems += searchedModels.length;

              return (
                <section key={type} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-porscheBlack">
                    The {type} models ({searchedModels.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {searchedModels.map((car) => (
                      <div key={car.id} className="overflow-hidden rounded-xl bg-gray-50 border border-gray-200 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                        <div>
                          <div className="h-44 w-full bg-gray-200 relative">
                            <img src={car.preview || "https://via.placeholder.com/300"} alt={car.vehicle} className="h-full w-full object-cover" />
                            {car.specialprice > 0 && (
                              <span className="absolute top-3 right-3 bg-porscheRed text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                Special Price
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold line-clamp-1 text-porscheBlack">{car.vehicle}</h3>
                            <p className="text-xs font-mono text-gray-400 mt-1">{car.commnr}</p>
                            
                            <div className="mt-3">
                              {car.specialprice > 0 ? (
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 line-through">Rp {car.price?.toLocaleString('id-ID')}</span>
                                  <span className="text-sm font-bold text-porscheRed">Rp {car.specialprice?.toLocaleString('id-ID')}</span>
                                </div>
                              ) : (
                                <span className="text-sm font-bold text-gray-700">Rp {car.price?.toLocaleString('id-ID') || "-"}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Button Action Group */}
                        <div className="p-4 pt-0">
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => handleEdit(car)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 py-2 text-sm font-bold text-porscheBlack hover:bg-gray-100 transition">
                                <EditIcon /> Edit
                            </button>
                            <button onClick={() => handleArchive(car.id)} className="flex items-center justify-center rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-yellow-600 hover:bg-yellow-100 transition" title="Archive to History">
                                <ArchiveIcon />
                            </button>
                            <button onClick={() => handleDelete(car.id)} className="flex items-center justify-center rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-red-600 hover:bg-red-100 transition" title="Permanently Delete">
                                <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}

      {/* FEEDBACK JIKA SELURUH HASIL FILTER KOSONG */}
      {!loading && totalDisplayedItems === 0 && (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-lg">No vehicles found matching criteria.</p>
        </div>
      )}
    </div>
  );
}