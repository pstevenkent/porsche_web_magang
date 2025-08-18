import React from 'react';

export default function CarCard({ car, onSelect }) {
  // Prioritaskan gambar dari 'car.preview'.
  // Jika tidak ada, gunakan gambar pertama dari 'car.images' sebagai cadangan.
  // Jika keduanya tidak ada, gunakan placeholder.
  const imageUrl = car.preview || (car.images && car.images.length > 0 ? car.images[0] : 'https://via.placeholder.com/400x300?text=No+Image');

  const priceToFormat = Math.round(car.price || 0);
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(priceToFormat);
  // --- AKHIR PERBAIKAN ---

  return (
    <div className="bg-porscheGray-light rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="bg-white h-48 flex items-center justify-center p-4">
        <img 
          src={imageUrl} 
          alt={car.vehicle || 'Porsche Model'} 
          className="max-h-full max-w-full object-contain"
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300?text=Image+Error"; }}
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-porscheBlack">{car.vehicle}</h3>
        <p className="text-porscheGray-dark text-sm mt-1">Mulai dari {formattedPrice}</p>
        <button 
          onClick={() => onSelect(car)}
          className="w-full mt-4 bg-porscheBlack text-white py-3 rounded-md font-bold text-sm uppercase tracking-wider group-hover:bg-porscheRed transition-colors duration-300">
          See Details
        </button>
      </div>
    </div>
  );
}