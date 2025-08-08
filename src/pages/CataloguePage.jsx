import React from 'react';
import { carData } from '../data/carData';
import CarCard from '../components/CarCard';

function CataloguePage({ onSelectCar }) {
    return (
        <div className="p-4 sm:p-8 bg-white font-porsche">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold tracking-wider text-porscheBlack">MODELS</h1>
                <p className="text-porscheGray-dark mt-2">Find your perfect Porsche.</p>
            </header>

            <div className="space-y-16">
                {Object.entries(carData).map(([type, models]) => (
                    <section key={type}>
                        <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-porscheBlack">The {type} models</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                            {models.map(car => (
                                <CarCard key={car.id} car={car} onSelect={onSelectCar} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
export default CataloguePage;