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
  const [cars, setCars] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  
  // 1. STATE UNTUK SEARCH
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCars = async () => {
    try {
        const data = await getAllCarsFromBackend();
        // Hanya ambil mobil yang TIDAK di-archive
        const activeCars = data.filter(car => !car.is_archived);
        setCars(activeCars);
    } catch (error) {
        console.error("Failed to fetch cars", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product PERMANENTLY?")) return;
    try {
      await fetch(`http://localhost:8080/api/v1/cars/${id}`, { method: "DELETE" });
      setCars((prev) => prev.filter((car) => car.id !== id));
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
            setCars((prev) => prev.filter((car) => car.id !== id));
        }
    } catch (error) {
        console.error("Failed to archive car", error);
    }
  };

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

  // ==========================================================
  // 2. LOGIKA FILTER (SUDAH DIPERBAIKI UNTUK NAMA JUGA)
  // ==========================================================
  const filteredCars = cars.filter((car) => {
    // Ubah query ke huruf kecil biar pencarian tidak case-sensitive
    const query = searchQuery.toLowerCase();
    
    // Cek Nama Mobil (car.vehicle)
    const matchName = car.vehicle && car.vehicle.toLowerCase().includes(query);
    
    // Cek Comm Number (car.commnr)
    const matchComm = car.commnr && car.commnr.toLowerCase().includes(query);

    // Kembalikan true jika salah satu cocok
    return matchName || matchComm;
  });

  if (isAdding) {
    return (
      <div className="min-h-screen bg-white p-8">
        <button onClick={handleCloseForm} className="mb-4 text-sm font-bold text-porscheGray-dark hover:text-porscheBlack">&larr; Back to List</button>
        <AddProductForm initialData={editingCar} onSave={handleCloseForm} />
      </div>
    );
  }

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

            <div className="flex gap-3">
                <button 
                    onClick={onOpenArchive}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-bold text-gray-600 transition hover:bg-gray-100 shadow-sm whitespace-nowrap"
                >
                    <ArchiveIcon /> Archives
                </button>

              
            </div>
        </div>
      </div>

      {/* RENDER LIST HASIL FILTER */}
      {filteredCars.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-lg">No vehicles found matching "{searchQuery}"</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCars.map((car) => (
              <div key={car.id} className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">
                <div className="h-48 w-full bg-gray-200">
                  <img src={car.preview || "https://via.placeholder.com/300"} alt={car.vehicle} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{car.vehicle}</h3>
                  <p className="text-sm text-gray-500">{car.commnr}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleEdit(car)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-bold text-porscheBlack hover:bg-gray-200">
                        <EditIcon /> Edit
                    </button>
                    <button onClick={() => handleArchive(car.id)} className="flex items-center justify-center rounded-lg bg-yellow-100 px-3 py-2 text-yellow-600 hover:bg-yellow-200" title="Archive">
                        <ArchiveIcon />
                    </button>
                    <button onClick={() => handleDelete(car.id)} className="flex items-center justify-center rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200" title="Delete">
                        <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}