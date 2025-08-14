import React, { useState, useEffect } from 'react';
import { configuratorDetails } from '../data/CarData'; // Pastikan path ini benar

// SVG Icons
const ArrowLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg> );
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> );

export default function ConfiguratorPage({ car, onBack }) {
    // Langsung gunakan URL gambar dari properti `car` yang diterima.
    // Ini diasumsikan `car.images` adalah array berisi URL lengkap dari Pinata/Cloudinary.
    const carImages = car?.images || [];

    const [mainImage, setMainImage] = useState(carImages.length > 0 ? carImages[0] : 'https://via.placeholder.com/1280x720?text=No+Image');
    const [selectedColor, setSelectedColor] = useState(configuratorDetails.colors.Dreams[0]);

    // Update gambar utama jika mobil yang dipilih berubah
    useEffect(() => {
        if (carImages.length > 0) {
            setMainImage(carImages[0]);
        }
    }, [car]);


    const ColorSwatch = ({ color, selected, onClick }) => (
        <div className="flex flex-col items-center space-y-2 cursor-pointer" onClick={onClick}>
            <div className={`w-16 h-16 rounded-md border-2 transition-all duration-200 ${selected ? 'border-porscheRed' : 'border-transparent'}`} style={{ backgroundColor: color.hex }} />
            <div className="text-center">
                <p className="text-xs font-bold">{color.name}</p>
                {color.price && <p className="text-xs text-porscheGray-dark">{color.price}</p>}
            </div>
        </div>
    );

  return (
    <div className="font-porsche">
      <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto">
        {/* Kolom Kiri: Galeri Gambar */}
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

        {/* Kolom Kanan: Panel Opsi */}
        <div className="w-full lg:w-1/3 p-6">
            <div className="sticky top-20">
                <h1 className="text-3xl font-bold text-porscheBlack">{car?.vehicle} <span className="text-lg font-normal text-porscheGray-dark">{car?.modelyear}</span></h1>
                <p className="text-sm text-porscheGray-dark border-b pb-4 mb-4">Technical data and standard equipment</p>
                
                <div className="space-y-6">
                    <h2 className="text-lg font-bold">Exterior Colours</h2>
                    {Object.entries(configuratorDetails.colors).map(([category, colors]) => (
                        <div key={category}>
                            <h3 className="text-sm font-bold text-porscheGray-dark mb-3">{category}</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {colors.map(color => (
                                    <ColorSwatch 
                                        key={color.name} 
                                        color={color} 
                                        selected={selectedColor.name === color.name} 
                                        onClick={() => setSelectedColor(color)} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}