import React, { useState, useEffect, useMemo } from 'react';
import CompareDetailColumn from '../components/CompareDetailColumn';
import CarCard from '../components/CarCard';
import { getAllCarsFromBackend } from '../utils/carUtils';

// --- ICONS ---
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SearchIcon = () => (
    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-porscheGray-dark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// --- COMPONENT: SEARCH & FILTER BAR ---
function SearchBarWithFilter({
    query,
    onQueryChange,
    categories = [],
    selectedCategory,
    onCategoryChange
}) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* SearchBar */}
            <div className="relative w-full sm:max-w-md">
                <SearchIcon />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search by model name..."
                    className="w-full rounded-full border border-porscheGray bg-gray-50 py-2 pl-12 pr-4 text-porscheBlack transition focus:bg-white focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/20"
                    autoFocus
                />
            </div>

            {/* Dropdown Category */}
            <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full sm:w-48 rounded-full border border-porscheGray bg-white py-2 px-4 text-porscheBlack cursor-pointer transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/20"
            >
                <option value="">All Models</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
        </div>
    );
}

// --- COMPONENT: MODAL SELECTION ---
const CarSelectionModal = ({ isOpen, onClose, onSelect, cars }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filterMode, setFilterMode] = useState('all');

    useEffect(() => {
        if (isOpen) {
            setSearchTerm("");
            setSelectedCategory("");
            setFilterMode('all');
        }
    }, [isOpen]);

    const categories = useMemo(() => {
        const cats = cars.map(car => car.vehicle.split(' ')[0]);
        return [...new Set(cats)].sort();
    }, [cars]);

    const filteredCars = cars.filter(car => {
        const modelName = (car.vehicle || "").toLowerCase();
        const searchMatch = modelName.includes(searchTerm.toLowerCase());
        const categoryMatch = selectedCategory ? modelName.startsWith(selectedCategory.toLowerCase()) : true;
        let specialMatch = true;
        if (filterMode === 'special') {
            specialMatch = car.specialprice && car.specialprice > 0;
        }
        return categoryMatch && searchMatch && specialMatch;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden relative">

                {/* Modal Header */}
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-porscheBlack">Select a Model</h2>
                        <p className="text-sm text-gray-500">Choose a vehicle to fill the slot</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                    <div className="flex flex-col gap-4 mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
                        <SearchBarWithFilter
                            query={searchTerm}
                            onQueryChange={setSearchTerm}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setFilterMode('all')}
                                className={`rounded-lg px-6 py-2 text-sm font-bold transition ${filterMode === 'all'
                                        ? 'bg-porscheBlack text-white shadow-md'
                                        : 'bg-gray-100 text-porscheBlack hover:bg-gray-200'
                                    }`}
                            >
                                All Models
                            </button>

                            <button
                                onClick={() => {
                                    setFilterMode('special');
                                    playFireworks();
                                }}
                                className={`rounded-lg px-6 py-2 text-sm font-bold transition ${filterMode === 'special'
                                        ? 'bg-porscheRed text-white shadow-md'
                                        : 'bg-gray-100 text-porscheBlack hover:bg-gray-200'
                                    }`}
                            >
                                Special Price Cars
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                            {filteredCars.map(car => (
                                <div key={car.id} onClick={() => onSelect(car)} className="cursor-pointer transform transition-transform hover:scale-105 group">
                                    <div className="pointer-events-none">
                                        <CarCard car={car} filterMode={filterMode} />
                                    </div>
                                </div>
                            ))}
                            {filteredCars.length === 0 && (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-400 text-lg">No models found matching your criteria.</p>
                                    <button
                                        onClick={() => { setSearchTerm(""); setSelectedCategory(""); setFilterMode('all'); }}
                                        className="mt-4 text-porscheRed font-bold hover:underline"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: SELECTOR SLOT (UPDATED) ---
const CarSelectorSlot = ({ label, selectedCar, onOpenModal, onRemove }) => {
    if (selectedCar) {
        return (
            <div className="relative group w-full h-full animate-fadeIn">
                {/* 1. Detail Column diletakkan DULUAN agar button dirender DI ATASNYA */}
                <CompareDetailColumn car={selectedCar} />

                {/* 2. Button Remove diletakkan TERAKHIR dengan z-index tinggi */}
                <button
                    onClick={onRemove}
                    className="absolute -top-3 -right-3 z-50 bg-white text-porscheRed border border-gray-200 shadow-md p-2 rounded-full hover:bg-porscheRed hover:text-white transition-all transform hover:scale-110"
                    title="Remove Car"
                >
                    <CloseIcon />
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={onOpenModal}
            className="w-full min-h-[500px] h-full bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-porscheRed hover:bg-porscheRed/5 transition-all duration-300 group shadow-sm hover:shadow-md"
        >
            <div className="p-6 bg-gray-50 rounded-full mb-4 group-hover:bg-white group-hover:scale-110 transition-transform shadow-inner">
                <div className="text-gray-400 group-hover:text-porscheRed transition-colors">
                    <PlusIcon />
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-500 group-hover:text-porscheBlack transition-colors">{label}</h3>
            <p className="text-sm text-gray-400 mt-2">Click to browse models</p>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function CompareCarsPage() {
    const [allCars, setAllCars] = useState([]);

    // State Modal & Slot
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState(null); // 1 atau 2

    // State Data Mobil Terpilih
    const [car1Detail, setCar1Detail] = useState(null);
    const [car2Detail, setCar2Detail] = useState(null);

    // Fetch Data
    useEffect(() => {
        const initCars = async () => {
            const data = await getAllCarsFromBackend();
            setAllCars(data);
        };
        initCars();
    }, []);

    const openModalForSlot = (slot) => {
        setActiveSlot(slot);
        setIsModalOpen(true);
    };

    const handleSelectCar = (car) => {
        if (activeSlot === 1) {
            setCar1Detail(car);
        } else if (activeSlot === 2) {
            setCar2Detail(car);
        }
        setIsModalOpen(false);
        setActiveSlot(null);
    };

    return (
        <div className="font-porsche w-full min-h-screen pb-20">
            <div className="flex flex-col items-center mb-10 text-center">
                <h1 className="text-4xl font-bold text-porscheBlack mb-3">Compare Models</h1>
                <p className="text-porscheGray-dark max-w-2xl">
                    Select two vehicles to compare technical specifications side-by-side.
                    Use the filters to quickly find your desired model.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* SLOT 1 */}
                    <CarSelectorSlot
                        label="Add First Car"
                        selectedCar={car1Detail}
                        onOpenModal={() => openModalForSlot(1)}
                        onRemove={() => setCar1Detail(null)}
                    />

                    {/* SLOT 2 */}
                    <CarSelectorSlot
                        label="Add Second Car"
                        selectedCar={car2Detail}
                        onOpenModal={() => openModalForSlot(2)}
                        onRemove={() => setCar2Detail(null)}
                    />
                </div>
            </div>

            {/* Modal Filter */}
            <CarSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectCar}
                cars={allCars}
            />
        </div>
    );
}