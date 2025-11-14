import React, { useState, useEffect } from 'react';

// SVG Icon dan komponen DetailSection
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>);
const DetailSection = ({ title, data }) => {
    if (!data || (Array.isArray(data) && data.length === 0) || data === "") return null;
    return (
        <div>
            <h3 className="text-sm font-bold text-porscheGray-dark mb-2">{title}</h3>
            {Array.isArray(data) ? (
                <ul className="list-disc list-inside space-y-1 text-porscheBlack">{data.map((item, index) => (<li key={index}>{item}</li>))}</ul>
            ) : (<p className="text-porscheBlack">{data}</p>)}
        </div>
    );
};

// --- FUNGSI HELPER BARU UNTUK FORMAT HARGA ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Math.round(price || 0));
};
// ---------------------------------------------

export default function DetailPage({ car, onBack }) {
    const carImages = car?.images || [];
    const [mainImage, setMainImage] = useState(carImages.length > 0 ? carImages[0] : 'https://via.placeholder.com/1280x720?text=No+Image');

    useEffect(() => {
        if (carImages.length > 0) setMainImage(carImages[0]);
    }, [car]);

    return (
        <div className="font-porsche">
            <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto">
                <div className="w-full lg:w-2/3 bg-white p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={onBack} className="flex items-center space-x-2 text-porscheGray-dark hover:text-porscheBlack transition-colors"><ArrowLeftIcon /><span className="text-sm font-bold">Change model</span></button>
                    </div>
                    <div className="aspect-w-16 aspect-h-9 bg-porscheGray-light rounded-lg flex items-center justify-center">
                        <img src={mainImage} alt="Main car view" className="max-h-full max-w-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/1280x720?text=Image+Error"; }} />
                    </div>
                    <div className="mt-4">
                        <div className="flex space-x-2 overflow-x-auto pb-2">{carImages.map((img, index) => (<div key={index} onClick={() => setMainImage(img)} className={`flex-shrink-0 w-24 h-16 rounded-md cursor-pointer border-2 transition-all duration-200 ${mainImage === img ? 'border-porscheRed' : 'border-transparent'}`}><img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Error"; }} /></div>))}</div>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 p-6">
                    <div className="sticky top-20">
                        <h1 className="text-3xl font-bold text-porscheBlack">{car?.vehicle} <span className="text-lg font-normal text-porscheGray-dark">{car?.modelyear}</span></h1>

                        {/* --- PERUBAHAN LOGIKA HARGA DI SINI --- */}
                        <div className="border-b border-porscheGray pb-4 my-4">
                            {car?.specialprice && car.specialprice > 0 ? (
                                // Jika ADA harga spesial
                                <>
                                    <div>
                                        <p className="text-sm font-bold text-porscheGray-dark line-through">Original Price (IDR)</p>
                                        <p className="text-2xl font-bold text-porscheGray-dark line-through">
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
                                // Jika TIDAK ADA harga spesial (harga normal)
                                <div>
                                    <p className="text-sm font-bold text-porscheGray-dark">Price (IDR)</p>
                                    <p className="text-2xl font-bold text-porscheBlack">
                                        {formatPrice(car.price)}
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* --- AKHIR PERUBAHAN --- */}

                        <p className="text-sm text-porscheGray-dark mb-4">Comm. Nr: {car?.commnr}</p>

                        {/* --- TOMBOL PDF (sudah ada) --- */}
                        {car?.pdf && (
                            <div className="mb-6">
                                <a href={car.pdf} target="_blank" rel="noopener noreferrer" className="w-full block text-center rounded-lg bg-gray-700 py-3 text-base font-bold uppercase tracking-wider text-white transition hover:bg-red-600">View Full Specs (PDF)</a>
                            </div>
                        )}

                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                            <h2 className="text-xl font-bold text-porscheBlack">Technical Data</h2>
                            <DetailSection title="Exterior Colour" data={car?.exteriorcolour} />
                            <DetailSection title="Interior Colours" data={car?.interiorcolours} />
                            <DetailSection title="Wheels" data={car?.wheels} />
                            <DetailSection title="Painted Wheels" data={car?.paintedwheels} />
                            <DetailSection title="Wheel Colours" data={car?.wheelcolours} />
                            <DetailSection title="Wheel Accesories" data={car?.wheelaccesories} />
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