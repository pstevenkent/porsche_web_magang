import React from "react";

// Fungsi helper untuk memformat harga
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

// --- PERUBAHAN DI SINI: Terima prop 'filterMode' ---
export default function CarCard({ car, onSelect, filterMode }) {

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

      {/* --- LOGIKA HARGA BARU --- */}
      <div className="mt-1 font-bold">
        {/* Tampilkan harga spesial HANYA JIKA:
          1. filterMode adalah 'special'
          2. DAN mobilnya punya specialprice
        */}
        {filterMode === 'special' && car.specialprice && car.specialprice > 0 ? (
          // Tampilan Harga Spesial
          <>
            <span className="mr-2 text-porscheGray-dark line-through">
              Rp {formatPrice(car.price)}
            </span>
            <span className="text-porscheRed">
              Rp {formatPrice(car.specialprice)}
            </span>
          </>
        ) : (
          // Tampilan Harga Normal (untuk 'all' atau jika tidak ada diskon)
          <span className="text-porscheBlack">
            Rp {formatPrice(car.price)}
          </span>
        )}
      </div>
      {/* ----------------------- */}
    </div>
  );
}