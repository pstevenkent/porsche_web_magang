import React, { useState, useEffect } from 'react';

// SVG Icon
const ArrowLeftIcon = () => ( <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg> );

// Komponen helper untuk menampilkan detail
const DetailSection = ({ title, data }) => {
    // Jangan tampilkan seksi ini jika datanya tidak ada atau kosong
    if (!data || (Array.isArray(data) && data.length === 0) || data === "") {
        return null;
    }

    return (
        <div>
            <h3 className="text-sm font-bold text-porscheGray-dark mb-3">{title}</h3>
            {Array.isArray(data) ? (
                <ul className="list-disc list-inside space-y-1 text-porscheBlack">
                    {data.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-porscheBlack">{data}</p>
            )}
        </div>
    );
};


export default function DetailPage({ car, onBack }) {
    const carImages = car?.images || [];
    const [mainImage, setMainImage] = useState(carImages.length > 0 ? carImages[0] : 'https://via.placeholder.com/1280x720?text=No+Image');

    // Update gambar utama jika mobil yang dipilih berubah
    useEffect(() => {
        if (carImages.length > 0) {
            setMainImage(carImages[0]);
        }
    }, [car]);

  return (
    <div className="font-porsche">
      <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto">
        {/* Kolom Kiri: Galeri Gambar (Tidak Berubah) */}
        <div className="w-full lg:w-2/3 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
                 <button onClick={onBack} className="flex items-center space-x-2 text-porscheGray-dark hover:text-porscheBlack transition-colors">
                    <ArrowLeftIcon />
                    <span className="text-sm font-bold">Change model</span>
                </button>
            </div>
            <div className="aspect-w-16 aspect-h-9 bg-porscheGray-light rounded-lg flex items-center justify-center">
                <img 
                    src={mainImage} 
                    alt="Main car view" 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/1280x720?text=Image+Error"; }}
                />
            </div>
            <div className="mt-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {carImages.map((img, index) => (
                        <div key={index} onClick={() => setMainImage(img)} className={`flex-shrink-0 w-24 h-16 rounded-md cursor-pointer border-2 transition-all duration-200 ${mainImage === img ? 'border-porscheRed' : 'border-transparent'}`}>
                            <img 
                                src={img} 
                                alt={`Thumbnail ${index + 1}`} 
                                className="w-full h-full object-cover rounded"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=Error"; }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Kolom Kanan: Panel Opsi (Diubah Total untuk Menampilkan Detail) */}
        <div className="w-full lg:w-1/3 p-6">
            <div className="sticky top-20">
                <h1 className="text-3xl font-bold text-porscheBlack">{car?.vehicle} <span className="text-lg font-normal text-porscheGray-dark">{car?.modelyear}</span></h1>
                <p className="text-sm text-porscheGray-dark border-b pb-4 mb-4">
                    Comm. Nr: {car?.commnr}
                </p>
                
                {/* --- BAGIAN DETAIL MOBIL --- */}
                <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
                    <h2 className="text-2xl font-bold text-porscheBlack mt-4">Technical Data</h2>
                    
                    <DetailSection title="Price (IDR)" data={new Intl.NumberFormat('id-ID').format(car?.price || 0)} />
                    <DetailSection title="Exterior Colour" data={car?.exteriorcolour} />
                    <DetailSection title="Interior Colours" data={car?.interiorcolours} />
                    <DetailSection title="Wheels" data={car?.wheels} />
                    <DetailSection title="Painted Wheels" data={car?.paintedwheels} />
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