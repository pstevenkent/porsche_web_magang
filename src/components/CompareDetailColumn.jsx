import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/carUtils';

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

const getOptimizedImageUrl = (url) => {
    if (!url) return '';
    if (url.includes('gateway.pinata.cloud')) return url.replace('gateway.pinata.cloud', 'ipfs.io');
    if (url.includes('cloudflare-ipfs.com')) return url.replace('cloudflare-ipfs.com', 'ipfs.io');
    return url;
};

export default function CompareDetailColumn({ car, otherCar }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [car?.id]);

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

    // Fungsi untuk mengecek apakah ada perbedaan dengan mobil di slot sebelah
    const isDifferent = (field) => {
        if (!otherCar) return false;
        const val1 = String(car[field] || "").trim().toLowerCase();
        const val2 = String(otherCar[field] || "").trim().toLowerCase();
        return val1 !== val2;
    };

    // Komponen internal untuk merender baris spesifikasi
    const RenderSpecRow = ({ title, field, data }) => {
        const different = isDifferent(field);
        return (
            <div className={`transition-all duration-300 ${different ? 'bg-yellow-50/50 p-2 -mx-2 rounded-lg border-l-4 border-yellow-400' : ''}`}>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
                <p className={`text-sm leading-relaxed ${different ? 'font-bold text-porscheBlack' : 'text-gray-600'}`}>
                    {data || "-"}
                </p>
            </div>
        );
    };

    let images = car.images || [];
    const fallbackImage = '/images/Porsche_wordmark_black_rgb.png';
    if (images.length === 0) images = [fallbackImage];
    const hasMultipleImages = images.length > 1;

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
            <div className="relative h-56 sm:h-72 bg-gray-100 flex items-center justify-center overflow-hidden group select-none">
                {images.map((imgUrl, index) => (
                    <img 
                        key={`${car.id}-${index}`}
                        src={getOptimizedImageUrl(imgUrl)}
                        alt={`${car.vehicle} view ${index + 1}`} 
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out
                            ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                        `}
                        onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-20" />
                {hasMultipleImages && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-30"><ChevronLeft /></button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-30"><ChevronRight /></button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                            {images.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${currentImageIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-porscheBlack leading-tight">{car.vehicle}</h2>
                    <div className="flex items-center mt-2">
                        <span className="bg-porscheBlack text-white text-xs px-2 py-1 rounded font-semibold">MY {car.modelyear}</span>
                        <span className="text-gray-400 text-xs ml-2">{car.commnr}</span>
                    </div>
                </div>

                <div className="mb-6">
                    {car.specialprice && car.specialprice > 0 ? (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col">
                            <span className="text-xs font-bold text-red-400 uppercase mb-1">Special Price</span>
                            <span className="text-2xl font-bold text-porscheRed mb-1">{formatPrice(car.specialprice)}</span>
                            <span className="text-sm font-medium text-gray-500 line-through">{formatPrice(car.price)}</span>
                        </div>
                    ) : (
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase mb-1 block">Starting Price</span>
                            <p className="text-2xl font-bold text-porscheBlack">{formatPrice(car.price)}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar relative">
                    <h3 className="text-sm font-bold text-porscheBlack uppercase tracking-wider border-b border-gray-200 pb-3 sticky top-0 bg-white z-10 flex justify-between items-center">
                        Technical Specs
                        {otherCar && <span className="text-[10px] text-yellow-600 font-normal normal-case italic">* Bold items are different</span>}
                    </h3>
                    
                    <div className="pt-2 space-y-6">
                        <RenderSpecRow title="Exterior Colour" field="exteriorcolour" data={car.exteriorcolour} />
                        <RenderSpecRow title="Interior Colours" field="interiorcolours" data={car.interiorcolours} />
                        <RenderSpecRow title="Powertrain & Performance" field="powertrainperformance" data={car.powertrainperformance} />
                        <RenderSpecRow title="Wheels" field="wheels" data={car.wheels} />
                        <RenderSpecRow title="Assistance Systems" field="assistancesystems" data={car.assistancesystems} />
                        <RenderSpecRow title="Comfort & Usability" field="comfortnusability" data={car.comfortnusability} />
                        <RenderSpecRow title="Infotainment" field="infotainment" data={car.infotainment} />
                    </div>
                </div>
            </div>
        </div>
    );
}