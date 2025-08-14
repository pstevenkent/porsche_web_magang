import React from 'react';

export default function CarCard({ car, onSelect }) {
  // 1. Ambil array gambar dari properti 'car'.
  //    Ini akan menjadi array kosong jika car.images tidak ada.
  const carImages = car?.images || [];

  // 2. Ambil URL gambar pertama dari array tersebut.
  //    Jika array kosong, gunakan URL placeholder.
  //    Logika ini mengasumsikan carImages[0] adalah URL LENGKAP.
  const imageUrl = carImages.length > 0 
    ? carImages[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  // 3. Format harga ke dalam mata uang Rupiah.
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(car.price || 0);

  return (
    <div className="bg-porscheGray-light rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="bg-white h-48 flex items-center justify-center p-4">
        <img 
          src={imageUrl} 
          alt={car.vehicle || 'Porsche Model'} 
          className="max-h-full max-w-full object-contain"
          // Fallback jika URL gambar error
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300?text=Image+Error"; }}
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-porscheBlack">{car.vehicle}</h3>
        <p className="text-porscheGray-dark text-sm mt-1">Mulai dari {formattedPrice}</p>
        <button 
          onClick={() => onSelect(car)}
          className="w-full mt-4 bg-porscheBlack text-white py-3 rounded-md font-bold text-sm uppercase tracking-wider group-hover:bg-porscheRed transition-colors duration-300">
          Configure
        </button>
      </div>
    </div>
  );
}