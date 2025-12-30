import React, { useState, useEffect } from 'react';
import { DetailSection, formatPrice } from '../utils/carUtils';

// --- ICONS ---
const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export default function CompareDetailColumn({ car }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false); // State untuk tracking error gambar

    useEffect(() => {
        setCurrentImageIndex(0);
        setImageError(false); // Reset error saat mobil berubah
    }, [car?.id]);

    // Reset error saat index gambar berubah
    useEffect(() => {
        setImageError(false);
    }, [currentImageIndex]);

    if (!car) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-porscheGray min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mb-3"></div>
                    <p className="text-sm font-medium">Slot Empty</p>
                </div>
            </div>
        );
    }

    const images = car.images || [];
    const hasMultipleImages = images.length > 1;
    
    // Gunakan placeholder lokal jika terjadi error atau tidak ada gambar
    // Pastikan file '/images/Porsche_wordmark_black_rgb.png' ada di public folder Anda, atau ganti dengan gambar lain
    const fallbackImage = '/images/Porsche_wordmark_black_rgb.png'; 
    
    let displayImage;
    if (images.length > 0 && !imageError) {
        displayImage = images[currentImageIndex];
    } else {
        displayImage = fallbackImage;
    }

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-full animate-fadeIn border border-gray-100 transition-all hover:shadow-2xl">
            {/* --- GAMBAR MOBIL CAROUSEL --- */}
            <div className="relative h-56 sm:h-72 bg-gray-100 flex items-center justify-center overflow-hidden group select-none">
                <img 
                    src={displayImage} 
                    alt={`${car.vehicle} view ${currentImageIndex + 1}`} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageError ? 'object-contain p-8 opacity-50' : ''}`}
                    onError={() => setImageError(true)} // Set state error, jangan ganti src langsung
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Navigasi hanya muncul jika gambar > 1 DAN tidak sedang error */}
                {hasMultipleImages && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 focus:outline-none"
                        >
                            <ChevronLeft />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 focus:outline-none"
                        >
                            <ChevronRight />
                        </button>
                        
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* --- DETAIL TEKNIS (Tidak Berubah) --- */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-porscheBlack leading-tight">{car.vehicle}</h2>
                    <div className="flex items-center mt-2">
                        <span className="bg-porscheBlack text-white text-xs px-2 py-1 rounded font-semibold">
                            MY {car.modelyear}
                        </span>
                        <span className="text-gray-400 text-xs ml-2">
                             {car.commnr}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    {car.specialprice && car.specialprice > 0 ? (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col">
                            <span className="text-xs font-bold text-red-400 uppercase mb-1">Special Price</span>
                            <span className="text-2xl font-bold text-porscheRed leading-none mb-1">
                                {formatPrice(car.specialprice)}
                            </span>
                             <span className="text-sm font-medium text-gray-500 line-through">
                                {formatPrice(car.price)}
                            </span>
                        </div>
                    ) : (
                        <div>
                             <span className="text-xs font-bold text-gray-500 uppercase mb-1 block">Starting Price</span>
                            <p className="text-2xl font-bold text-porscheBlack leading-none">
                                {formatPrice(car.price)}
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar relative">
                     <h3 className="text-sm font-bold text-porscheBlack uppercase tracking-wider border-b border-gray-200 pb-3 sticky top-0 bg-white z-10">
                        Technical Specs
                    </h3>
                    
                    <div className="pt-2 space-y-6">
                        <DetailSection title="Exterior Colour" data={car.exteriorcolour} />
                        <DetailSection title="Interior Colours" data={car.interiorcolours} />
                        <DetailSection title="Powertrain & Performance" data={car.powertrainperformance} />
                        <DetailSection title="Wheels" data={car.wheels} />
                        <DetailSection title="Painted Wheels" data={car.paintedwheels} />
                        <DetailSection title="Exterior Design" data={car.exteriordesign} />
                        <DetailSection title="Interior Design" data={car.interiordesign} />
                        <DetailSection title="Seats" data={car.seats} />
                        <DetailSection title="Assistance Systems" data={car.assistancesystems} />
                        <DetailSection title="Comfort & Usability" data={car.comfortnusability} />
                        <DetailSection title="Lights & Vision" data={car.lightsvision} />
                        <DetailSection title="Infotainment" data={car.infotainment} />
                        <DetailSection title="Equipment Packages" data={car.equipmentpackages} />
                    </div>
                </div>
            </div>
        </div>
    );
}