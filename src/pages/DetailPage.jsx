import React, { useState, useEffect } from 'react';

// SVG Icon dan komponen DetailSection
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>);
const DetailSection = ({ title, data }) => {
    if (!data || (Array.isArray(data) && data.length === 0) || data === "") return null;
    return (
        <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{title}</h3>
            {Array.isArray(data) ? (
                <ul className="list-disc list-inside space-y-1 text-neutral-300 text-sm">{data.map((item, index) => (<li key={index}>{item}</li>))}</ul>
            ) : (<p className="text-neutral-300 text-sm">{data}</p>)}
        </div>
    );
};

// --- FUNGSI HELPER UNTUK FORMAT HARGA ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Math.round(price || 0));
};

export default function DetailPage({ car, onBack }) {
    const carImages = car?.images || [];
    const [mainImage, setMainImage] = useState(carImages.length > 0 ? carImages[0] : 'https://via.placeholder.com/1280x720?text=No+Image');

    useEffect(() => {
        if (carImages.length > 0) setMainImage(carImages[0]);
    }, [car]);

    return (
        <div className="font-porsche text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto gap-8">
                
                {/* KOLOM KIRI: Galeri Gambar (Tetap Putih Bersih Transparan) */}
                <div className="w-full lg:w-2/3 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl text-black">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={onBack} className="flex items-center space-x-2 text-neutral-500 hover:text-black transition-colors">
                            <ArrowLeftIcon />
                            <span className="text-sm font-bold">Change model</span>
                        </button>
                    </div>
                    <div className="aspect-w-16 aspect-h-9 bg-neutral-100 rounded-xl flex items-center justify-center p-4">
                        <img src={mainImage} alt="Main car view" className="max-h-[500px] max-w-full object-contain mx-auto" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/1280x720?text=Image+Error"; }} />
                    </div>
                    <div className="mt-4">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {carImages.map((img, index) => (
                                <div key={index} onClick={() => setMainImage(img)} className={`flex-shrink-0 w-24 h-16 rounded-md cursor-pointer border-2 transition-all duration-200 ${mainImage === img ? 'border-porscheRed' : 'border-transparent'}`}>
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Error"; }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: Data Spesifikasi */}
                <div className="w-full lg:w-1/3 p-2">
                    <div className="sticky top-20">
                        {/* 🌟 UBAH: warna teks tahun diganti dari text-neutral-400 ke text-neutral-200 (lebih terang) */}
                        <h1 className="text-3xl font-bold text-white">{car?.vehicle} <span className="text-lg font-normal text-neutral-200">{car?.modelyear}</span></h1>

                        {/* DETAIL INFO HARGA */}
                        <div className="border-b border-white/10 pb-4 my-4">
                            {car?.specialprice && car.specialprice > 0 ? (
                                <>
                                    <div>
                                        {/* 🌟 UBAH: warna label original price diganti ke text-neutral-200 agar coretannya terang */}
                                        <p className="text-sm font-medium text-neutral-200 line-through">Original Price (IDR)</p>
                                        <p className="text-xl font-bold text-neutral-200 line-through">
                                            {formatPrice(car.price)}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm font-bold text-porscheRed">Special Price (IDR)</p>
                                        <p className="text-3xl font-bold text-porscheRed">
                                            {formatPrice(car.specialprice)}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    {/* 🌟 UBAH: warna label price diganti ke text-neutral-200 dan teks nominal diganti ke text-white murni */}
                                    <p className="text-sm font-medium text-neutral-200">Price (IDR)</p>
                                    <p className="text-2xl font-bold text-white">
                                        {formatPrice(car.price)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 🌟 UBAH: warna teks Comm Nr diganti dari text-neutral-400 ke text-neutral-200 murni */}
                        <p className="text-xs tracking-wider uppercase text-neutral-200 mb-4">Comm. Nr: {car?.commnr}</p>

                        {/* TOMBOL PDF FULL SPEC */}
                        {car?.pdf && (
                            <div className="mb-6">
                                <a href={car.pdf} target="_blank" rel="noopener noreferrer" className="w-full block text-center rounded-xl bg-white/10 border border-white/20 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-porscheRed hover:border-transparent shadow-md">
                                    View Full Specs (PDF)
                                </a>
                            </div>
                        )}

                        {/* LIST SPESIFIKASI TEKNIS */}
                        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1">Technical Data</h2>
                            <DetailSection title="Exterior Colour" data={car?.exteriorcolour} />
                            <DetailSection title="Interior Colours" data={car?.interiorcolours} />
                            <DetailSection title="Wheels" data={car?.wheels} />
                            <DetailSection title="Painted Wheels" data={car?.paintedwheels} />
                            <DetailSection title="Wheel Colours" data={car?.wheelcolours} />
                            <DetailSection title="Wheel Accessories" data={car?.wheelaccesories} />
                            <DetailSection title="Seats" data={car?.seats} />
                            <DetailSection title="Seatbelts & Seat Design" data={car?.seatbeltsseatdesign} />
                            <DetailSection title="Lettering & Decals" data={car?.letteringdecals} />
                            <DetailSection title="Roof Transport System" data={car?.rooftransport} />
                            <DetailSection title="Powertrain & Performance" data={car?.powertrainperformance} />
                            <DetailSection title="Exterior Design" data={car?.exteriordesign} />
                            <DetailSection title="Interior Design" data={car?.interiordesign} />
                            <DetailSection title="Assistance Systems" data={car?.assistancesystems} />
                            <DetailSection title="Comfort & Usability" data={car?.comfortnusability} />
                            <DetailSection title="Lights & Vision" data={car?.lightsvision} />
                            <DetailSection title="Infotainment" data={car?.infotainment} />
                            <DetailSection title="Equipment Packages" data={car?.equipmentpackages} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}