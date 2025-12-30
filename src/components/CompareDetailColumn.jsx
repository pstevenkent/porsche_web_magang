import React from 'react';
import { DetailSection, formatPrice } from '../utils/carUtils';

export default function CompareDetailColumn({ car }) {
    // 1. Jika belum ada mobil yang dipilih (atau data masih loading), tampilkan state kosong/loading
    if (!car) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-porscheGray min-h-[300px]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-4 bg-gray-300 rounded-full mb-2"></div>
                    <p className="text-sm">Waiting for selection...</p>
                </div>
            </div>
        );
    }

    // 2. Ambil gambar pertama dengan aman
    // Backend Anda mengembalikan array strings di 'images'
    const images = car.images || [];
    const mainImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/600x400?text=No+Image';

    return (
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full animate-fadeIn border border-gray-100">
            {/* --- GAMBAR MOBIL --- */}
            <div className="relative h-48 sm:h-64 bg-gray-50 flex items-center justify-center overflow-hidden group">
                <img 
                    src={mainImage} 
                    alt={car.vehicle || "Porsche"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Error"; }}
                />
                {/* Overlay gradient halus */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50" />
            </div>

            {/* --- DETAIL TEKNIS --- */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Header: Nama & Tahun */}
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-porscheBlack leading-tight">{car.vehicle}</h2>
                    <p className="text-porscheGray-dark text-sm font-semibold mt-1">
                        Model Year {car.modelyear}
                    </p>
                </div>

                {/* Harga */}
                <div className="mb-6">
                    {car.specialprice && car.specialprice > 0 ? (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <p className="text-xs font-bold text-gray-500 uppercase line-through mb-1">
                                Original: {formatPrice(car.price)}
                            </p>
                            <p className="text-xl font-bold text-porscheRed">
                                {formatPrice(car.specialprice)}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Price</p>
                            <p className="text-xl font-bold text-porscheBlack">
                                {formatPrice(car.price)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Spesifikasi (Scrollable) */}
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                    <h3 className="text-sm font-bold text-porscheBlack uppercase tracking-wider border-b border-gray-200 pb-2 mb-3">
                        Technical Specs
                    </h3>
                    
                    {/* List Detail Menggunakan Helper DetailSection */}
                    <DetailSection title="Exterior Colour" data={car.exteriorcolour} />
                    <DetailSection title="Interior Colours" data={car.interiorcolours} />
                    <DetailSection title="Wheels" data={car.wheels} />
                    <DetailSection title="Painted Wheels" data={car.paintedwheels} />
                    <DetailSection title="Powertrain" data={car.powertrainperformance} />
                    <DetailSection title="Seats" data={car.seats} />
                    <DetailSection title="Exterior Design" data={car.exteriordesign} />
                    <DetailSection title="Interior Design" data={car.interiordesign} />
                    <DetailSection title="Assistance Systems" data={car.assistancesystems} />
                    <DetailSection title="Comfort & Usability" data={car.comfortnusability} />
                    <DetailSection title="Lights & Vision" data={car.lightsvision} />
                    <DetailSection title="Infotainment" data={car.infotainment} />
                    <DetailSection title="Equipment Packages" data={car.equipmentpackages} />
                    
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Comm. Nr: {car.commnr}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}