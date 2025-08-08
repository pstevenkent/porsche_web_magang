import React from 'react';
import { useState, useEffect } from 'react';

// IMPORTANT: Replace these placeholder URLs with your own direct links from Google Drive
const images = [
    '/images/porsche1.jpg',
  '/images/porsche3.jpg',
  '/images/porsche4.jpg',
  '/images/porsche6.jpg',
  '/images/porsche7.jpg',
  '/images/porsche8.jpg',
  '/images/porsche9.jpg',
  '/images/porsche10.jpg',
  '/images/porsche11.jpg',
  '/images/porsche12.jpg'
];

function BackgroundCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); // Change image every 7 seconds.

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="background-carousel">
      {images.map((image, index) => (
        <div
          key={index}
          className="background-image"
          style={{ 
            backgroundImage: `url(${image})`,
            opacity: index === currentImageIndex ? 1 : 0
          }}
        />
      ))}
      <div className="background-overlay"></div>
    </div>
  );
}

export default BackgroundCarousel;