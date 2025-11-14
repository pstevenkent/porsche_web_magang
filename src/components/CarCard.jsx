import React from "react";

// Fungsi helper untuk memformat harga
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

// Gunakan onSelect, BUKAN Link
export default function CarCard({ car, onSelect }) {
  
  // onSelect(car) akan dipanggil saat div diklik
  return (
    <div 
      onClick={() => onSelect(car)} 
      className="group block cursor-pointer"
    >
      <div className="aspect-h-2 aspect-w-3 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={car.preview}
          alt={`Preview of ${car.vehicle}`}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 text-lg font-bold text-porscheBlack group-hover:text-porscheRed">
        {car.vehicle}
      </h3>
      <p className="text-sm text-porscheGray-dark">{car.modelyear}</p>
      
      {/* Logika harga spesial (ini sudah benar) */}
      <div className="mt-1 font-bold">
        {car.specialprice && car.specialprice > 0 ? (
          // Jika ADA harga spesial
          <>
            <span className="mr-2 text-porscheGray-dark line-through">
              Rp {formatPrice(car.price)}
            </span>
            <span className="text-porscheRed">
              Rp {formatPrice(car.specialprice)}
            </span>
          </>
        ) : (
          // Jika TIDAK ADA harga spesial (harga normal)
          <span className="text-porscheBlack">
            Rp {formatPrice(car.price)}
          </span>
        )}
      </div>
      {/* ----------------------- */}
    </div>
  );
}