import React from 'react';

function CarCard({ car, onSelect }) {
  return (
    <div className="bg-porscheGray-light rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="bg-white h-48 flex items-center justify-center p-4">
        <img src={car.image} alt={car.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-porscheBlack">{car.name}</h3>
        <p className="text-porscheGray-dark text-sm mt-1">Mulai dari {car.price}</p>
        <button 
          onClick={() => onSelect(car)}
          className="w-full mt-4 bg-porscheBlack text-white py-3 rounded-md font-bold text-sm uppercase tracking-wider group-hover:bg-porscheRed transition-colors duration-300">
          Configure
        </button>
      </div>
    </div>
  );
}

export default CarCard;