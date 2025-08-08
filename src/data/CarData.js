// src/data/carData.js

// --- Sumber Data Mobil ---
export const carData = {
    "718": [
        { id: 1, name: "718 Cayman", price: "Rp 3.000.000.000", image: "/images/cars/718-cayman.png" },
        { id: 2, name: "718 Boxster", price: "Rp 3.100.000.000", image: "/images/cars/718-boxster.png" },
    ],
    "911": [
        { id: 3, name: "911 Carrera Coupe", price: "Rp 5.300.000.000", image: "/images/cars/911Carrera.webp" },
        { id: 4, name: "911 Carrera Cabriolet", price: "Rp 6.100.000.000", image: "/images/cars/911-carreracabriolet.png" },
    ],
    "Taycan": [
        { id: 5, name: "Taycan 4", price: "Rp 2.800.000.000", image: "/images/cars/taycan4.png" },
        { id: 6, name: "Taycan 4S", price: "Rp 2.800.000.000", image: "/images/cars/taycan4S.png" },
        { id: 7, name: "Taycan J1 II", price: "Rp 3.800.000.000", image: "/images/cars/taycanJ1.png" },
    ],
    "Panamera": [
        { id: 8, name: "G3 Panamera", price: "Rp 4.450.000.000", image: "/images/cars/panamera.png" },
    ],
    "Macan": [
        { id: 8, name: "Macan III", price: "Rp 2.555.000.000", image: "/images/cars/macanII.png" },
        { id: 9, name: "Macan EV", price: "Rp 3.050.000.000", image: "/images/cars/macanEV.png" },
        { id: 10, name: "Macan EV 4", price: "Rp 3.025.000.000", image: "/images/cars/macanEV4.png" },
    ],
    "Cayenne": [
        { id: 11, name: "Cayenne E Hybrid Coupe", price: "Rp 4.180.000.000", image: "/images/cars/cayenne.png" },
        { id: 3, name: "911 Carrera", price: "Rp 4.300.000.000", image: "/images/cars/911-carrera.png" },
        { id: 4, name: "911 Turbo S", price: "Rp 7.800.000.000", image: "/images/cars/911-turbo.png" },
        { id: 5, name: "911 GT3 RS", price: "Rp 9.000.000.000", image: "/images/cars/911-gt3.png" },
    ],
    "Taycan": [
        { id: 6, name: "Taycan 4S", price: "Rp 2.800.000.000", image: "/images/cars/taycan-4s.png" },
    ],
    "Panamera": [
        { id: 7, name: "Panamera", price: "Rp 3.800.000.000", image: "/images/cars/panamera.png" },
    ],
    "Macan": [
        { id: 8, name: "Macan", price: "Rp 2.100.000.000", image: "/images/cars/macan.png" },
    ],
    "Cayenne": [
        { id: 9, name: "Cayenne", price: "Rp 2.800.000.000", image: "/images/cars/cayenne.png" },]
};

// --- Data Halaman Konfigurator ---
export const configuratorDetails = {
    name: "Macan",
    year: "2025",
    images: [
        "/images/cars/macan-main.png",
        "/images/cars/macan-side.png",
        "/images/cars/macan-back.png",
        "/images/cars/macan-front.png",
        "/images/cars/macan-top.png",
        "/images/cars/macan-wheel.png",
        "/images/cars/macan-interior.png",
    ],
    colors: {
        Contrasts: [{ name: 'White', hex: '#F5F5F5' }, { name: 'Black', hex: '#1C1C1C' }],
        Shades: [{ name: 'Jet Black Metallic', hex: '#2A2A2A' }, { name: 'Volcano Grey', hex: '#4B4F52' }, { name: 'Dolomite Silver', hex: '#A9AEB2' }, { name: 'Genting Blue', hex: '#637A8A' }],
        Dreams: [{ name: 'Carmine Red', hex: '#C40000', price: '+ Rp 50.000.000' }, { name: 'Chalk', hex: '#D5D2C7', price: '+ Rp 50.000.000' }],
    }
};