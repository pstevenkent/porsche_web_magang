import React from 'react';

function BackgroundCarousel() {
  return (
    <div className="background-carousel bg-black">
      {/* Lapisan hitam pekat sebagai dasar utama */}
      <div className="absolute inset-0 bg-black" />
      {/* Overlay struktural untuk mempertahankan hierarki CSS */}
      <div className="background-overlay"></div>
    </div>
  );
}

export default BackgroundCarousel;