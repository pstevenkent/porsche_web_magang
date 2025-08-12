import React, { useState, useEffect, useRef } from 'react';
import ImageUpload from './ImageUpload';

const DynamicInputField = ({ value, onChange, onRemove, placeholder }) => (
    <div className="flex items-center gap-2">
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-lg border border-porscheGray bg-white p-3 text-porscheBlack transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50" />
        <button type="button" onClick={onRemove} className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-porscheGray bg-porscheGray-light text-xl text-porscheBlack transition hover:bg-porscheGray">&times;</button>
    </div>
);

export default function AddProductForm({ initialData, onSave }) {
  const isEditMode = Boolean(initialData);
  
  const initialFormState = {
    images: [''], vehicle: '', modelyear: '', exteriorcolour: '', interiorcolours: '',
    wheels: '', seats: '', rooftransport: '', powertrainperformance: [''], infotainment: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const imageUploadKey = useRef(0);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        vehicle: initialData.vehicle || '',
        modelyear: initialData.modelyear || '',
        exteriorcolour: initialData.exteriorcolour || '',
        interiorcolours: initialData.interiorcolours || '',
        wheels: initialData.wheels || '',
        seats: initialData.seats || '',
        rooftransport: initialData.rooftransport || '',
        powertrainperformance: initialData.powertrainperformance && initialData.powertrainperformance.length > 0 ? initialData.powertrainperformance : [''],
        infotainment: initialData.infotainment || '',
        images: initialData.images || [],
      });
    }
  }, [initialData, isEditMode]);

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

    if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
            data.append('images', file);
        });
    }

    const url = isEditMode
      ? `http://localhost:8080/api/v1/cars/${initialData.id}`
      : 'http://localhost:8080/api/v1/cars';
    
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, { method, body: data });
      const result = await response.json();
      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} produk.`);
      }
      
      setMessage(`Sukses! Produk berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`);
      if (!isEditMode) {
        setFormData(initialFormState);
        setImageFiles([]);
        imageUploadKey.current += 1;
      }
      if (onSave) onSave();

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-porsche text-porscheBlack">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider sm:text-4xl">
          {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
        <p className="mt-2 text-lg text-porscheGray-dark">
          {isEditMode ? `Mengedit konfigurasi untuk ${initialData.vehicle}` : 'Isi detail untuk konfigurasi mobil baru.'}
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-8">
        <ImageUpload 
            key={imageUploadKey.current} 
            onFilesChange={handleFilesChange} 
            initialPreviews={isEditMode ? formData.images : []}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
                <label htmlFor="vehicle" className="mb-2 block text-sm font-bold text-porscheGray-dark">Vehicle Name</label>
                <input type="text" id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" required />
            </div>
            <div>
                <label htmlFor="modelyear" className="mb-2 block text-sm font-bold text-porscheGray-dark">Model Year</label>
                <input type="number" id="modelyear" name="modelyear" value={formData.modelyear} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" required />
            </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
                <label htmlFor="exteriorcolour" className="mb-2 block text-sm font-bold text-porscheGray-dark">Exterior Colour</label>
                <input type="text" id="exteriorcolour" name="exteriorcolour" value={formData.exteriorcolour} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" />
            </div>
            <div>
                <label htmlFor="interiorcolours" className="mb-2 block text-sm font-bold text-porscheGray-dark">Interior Colours</label>
                <input type="text" id="interiorcolours" name="interiorcolours" value={formData.interiorcolours} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" />
            </div>
        </div>
        <div>
            <label htmlFor="wheels" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheels</label>
            <input type="text" id="wheels" name="wheels" value={formData.wheels} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" />
        </div>
        <div>
            <label htmlFor="seats" className="mb-2 block text-sm font-bold text-porscheGray-dark">Seats</label>
            <input type="text" id="seats" name="seats" value={formData.seats} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" />
        </div>
        <div>
            <label htmlFor="rooftransport" className="mb-2 block text-sm font-bold text-porscheGray-dark">Roof Transport System</label>
            <input type="text" id="rooftransport" name="rooftransport" value={formData.rooftransport} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" />
        </div>
        <div>
            <label className="mb-2 block text-sm font-bold text-porscheGray-dark">Powertrain & Performance Features</label>
            <div className="space-y-3">
                {formData.powertrainperformance.map((perf, index) => ( <DynamicInputField key={index} value={perf} onChange={(e) => handleDynamicChange(e, index, 'powertrainperformance')} onRemove={() => handleRemoveItem(index, 'powertrainperformance')} /> ))}
            </div>
            <button type="button" onClick={() => handleAddItem('powertrainperformance')} className="mt-3 rounded-lg border border-porscheGray bg-porscheGray-light px-4 py-2 text-sm font-bold text-porscheBlack transition hover:bg-porscheGray">+ Add Feature</button>
        </div>
        <div>
            <label htmlFor="infotainment" className="mb-2 block text-sm font-bold text-porscheGray-dark">Infotainment</label>
            <textarea id="infotainment" name="infotainment" value={formData.infotainment} onChange={handleChange} rows="4" className="w-full rounded-lg border border-porscheGray p-3"></textarea>
        </div>
        <div className="border-t border-porscheGray pt-6">
            <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-porscheRed py-4 text-lg font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-500">
                {isLoading ? 'Menyimpan...' : (isEditMode ? 'Update Configuration' : 'Save Configuration')}
            </button>
            {message && ( <p className={`mt-4 text-center text-sm font-bold ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}> {message} </p> )}
        </div>
      </form>
    </div>
  );
}