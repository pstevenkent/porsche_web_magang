import React, { useState } from 'react';
import ImageUpload from './ImageUpload'; // <-- Impor komponen baru

// Komponen untuk input field dinamis
const DynamicInputField = ({ value, onChange, onRemove, placeholder }) => (
    <div className="flex items-center gap-2">
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-lg border border-porscheGray bg-white p-3 text-porscheBlack transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50" />
        <button type="button" onClick={onRemove} className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-porscheGray bg-porscheGray-light text-xl text-porscheBlack transition hover:bg-porscheGray">&times;</button>
    </div>
);

export default function AddProductForm() {
    const initialFormState = { vehicle: '', modelyear: '', exteriorcolour: '', interiorcolours: '', wheels: '', seats: '', rooftransport: '', powertrainperformance: [''], infotainment: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [imageFiles, setImageFiles] = useState([]); // State untuk menampung file gambar
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDynamicChange = (e, index, field) => {
        const { value } = e.target;
        const list = [...formData[field]];
        list[index] = value;
        setFormData(prev => ({ ...prev, [field]: list }));
    };

    const handleAddItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const handleRemoveItem = (index, field) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        if (list.length === 0) list.push('');
        setFormData(prev => ({ ...prev, [field]: list }));
    };

    const handleFilesChange = (files) => {
        setImageFiles(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const data = new FormData();

        // Tambahkan semua data teks ke FormData
        data.append('vehicle', formData.vehicle);
        data.append('modelyear', parseInt(formData.modelyear, 10) || 0);
        data.append('exteriorcolour', formData.exteriorcolour);
        data.append('interiorcolours', formData.interiorcolours);
        data.append('wheels', formData.wheels);
        data.append('seats', formData.seats);
        data.append('rooftransport', formData.rooftransport);
        data.append('infotainment', formData.infotainment);

        formData.powertrainperformance.filter(p => p.trim() !== '').forEach(p => {
            data.append('powertrainperformance', p);
        });

        // Tambahkan semua file gambar
        imageFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            const response = await fetch('http://localhost:8080/api/v1/cars', {
                method: 'POST',
                body: data, // Browser akan otomatis set Content-Type ke multipart/form-data
            });

            const result = await response.json();
            if (!response.ok || result.status !== 'success') {
                throw new Error(result.message || 'Gagal menambahkan produk.');
            }

            setMessage('Sukses! Produk mobil berhasil ditambahkan.');
            setFormData(initialFormState);
            setImageFiles([]); // Kosongkan juga file gambar

        } catch (error) {
            setMessage(`Error: ${error.message}. Pastikan backend siap menerima file.`);
            console.error('Gagal mengirim data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="font-porsche text-porscheBlack">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-bold uppercase tracking-wider sm:text-4xl">Add New Vehicle</h1>
                <p className="mt-2 text-lg text-porscheGray-dark">Fill in the details for the new car configuration.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Komponen Upload Gambar */}
                <ImageUpload onFilesChange={handleFilesChange} />

                {/* Vehicle & Model Year */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="vehicle" className="mb-2 block text-sm font-bold text-porscheGray-dark">Vehicle Name</label>
                        <input type="text" id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" placeholder="e.g., 911 Carrera S" required />
                    </div>
                    <div>
                        <label htmlFor="modelyear" className="mb-2 block text-sm font-bold text-porscheGray-dark">Model Year</label>
                        <input type="number" id="modelyear" name="modelyear" value={formData.modelyear} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" placeholder="e.g., 2025" required />
                    </div>
                </div>

                {/* Colours */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="exteriorcolour" className="mb-2 block text-sm font-bold text-porscheGray-dark">Exterior Colour</label>
                        <input type="text" id="exteriorcolour" name="exteriorcolour" value={formData.exteriorcolour} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" placeholder="e.g., Jet Black Metallic" />
                    </div>
                    <div>
                        <label htmlFor="interiorcolours" className="mb-2 block text-sm font-bold text-porscheGray-dark">Interior Colours</label>
                        <input type="text" id="interiorcolours" name="interiorcolours" value={formData.interiorcolours} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" placeholder="e.g., Black/Bordeaux Red" />
                    </div>
                </div>

                {/* Other Equipment */}
                <div>
                    <label htmlFor="wheels" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheels</label>
                    <input type="text" id="wheels" name="wheels" value={formData.wheels} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" placeholder="e.g., 20/21-inch Carrera S Wheels" />
                </div>
                <div>
                    <label htmlFor="seats" className="mb-2 block text-sm font-bold text-porscheGray-dark">Seats</label>
                    <input type="text" id="seats" name="seats" value={formData.seats} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" placeholder="e.g., 18-way Adaptive Sport Seats Plus" />
                </div>
                <div>
                    <label htmlFor="rooftransport" className="mb-2 block text-sm font-bold text-porscheGray-dark">Roof Transport System</label>
                    <input type="text" id="rooftransport" name="rooftransport" value={formData.rooftransport} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" placeholder="e.g., Roof Transport System in Black" />
                </div>

                {/* Dynamic Powertrain & Performance Section */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-porscheGray-dark">Powertrain & Performance Features</label>
                    <div className="space-y-3">
                        {formData.powertrainperformance.map((perf, index) => (<DynamicInputField key={index} value={perf} onChange={(e) => handleDynamicChange(e, index, 'powertrainperformance')} onRemove={() => handleRemoveItem(index, 'powertrainperformance')} placeholder="e.g., Sport Chrono Package" />))}
                    </div>
                    <button type="button" onClick={() => handleAddItem('powertrainperformance')} className="mt-3 rounded-lg border border-porscheGray bg-porscheGray-light px-4 py-2 text-sm font-bold text-porscheBlack transition hover:bg-porscheGray">+ Add Feature</button>
                </div>

                {/* Infotainment */}
                <div>
                    <label htmlFor="infotainment" className="mb-2 block text-sm font-bold text-porscheGray-dark">Infotainment</label>
                    <textarea id="infotainment" name="infotainment" value={formData.infotainment} onChange={handleChange} rows="4" className="w-full rounded-lg border border-porscheGray p-3" placeholder="Jelaskan sistem infotainment..."></textarea>
                </div>

                {/* Submit Button & Feedback Message */}
                <div className="border-t border-porscheGray pt-6">
                    <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-porscheRed py-4 text-lg font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-500">
                        {isLoading ? 'Menyimpan...' : 'Save Configuration'}
                    </button>
                    {message && (<p className={`mt-4 text-center text-sm font-bold ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}> {message} </p>)}
                </div>
            </form>
        </div>
    );
}
