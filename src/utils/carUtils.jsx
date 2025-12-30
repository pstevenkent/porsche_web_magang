import React from 'react';

// Pastikan ini sesuai port backend Anda
const API_BASE_URL = 'http://localhost:8080/api/v1';

// --- Komponen Helper ---
export const DetailSection = ({ title, data }) => {
    if (!data || (Array.isArray(data) && data.length === 0) || data === "") return null;
    return (
        <div className="mb-4">
            <h3 className="text-sm font-bold text-porscheGray-dark mb-1">{title}</h3>
            {Array.isArray(data) ? (
                <ul className="list-disc list-inside space-y-1 text-porscheBlack text-sm">
                    {data.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
            ) : (<p className="text-porscheBlack text-sm">{data}</p>)}
        </div>
    );
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Math.round(price || 0));
};

// --- API FUNCTIONS ---

export const getAllCarsFromBackend = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cars`);
        const result = await response.json();
        
        // Cek struktur response backend: { data: { cars: [...] } }
        if (result.data && result.data.cars) {
            return result.data.cars;
        }
        return [];
    } catch (error) {
        console.error("Error fetching list:", error);
        return [];
    }
};

export const fetchCarDetailsById = async (carId) => {
    // Validasi ID sebelum fetch
    if (!carId) return null;

    try {
        console.log(`Fetching detail for ID: ${carId}`); // Debug Log
        const response = await fetch(`${API_BASE_URL}/car/${carId}`);
        
        if (!response.ok) {
            console.error(`Backend returned error: ${response.status}`);
            return null;
        }

        const result = await response.json();
        console.log("Backend response:", result); // Debug Log

        // Cek struktur response: { data: { car: {...} } }
        if (result.data && result.data.car) {
            return result.data.car;
        } else {
            console.warn("Structure mismatch or car not found in response", result);
            return null;
        }
    } catch (error) {
        console.error(`Network error for ID ${carId}:`, error);
        return null;
    }
};