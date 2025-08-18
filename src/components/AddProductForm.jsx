import React, { useState, useEffect, useRef } from "react";
import ImageUpload from "./ImageUpload";
import { PinataSDK } from "pinata";

// Konfigurasi Pinata Anda
export const pinataConfig = new PinataSDK({
  pinataJwt: `${import.meta.env.VITE_JWT}`,
  pinataGateway: `${import.meta.env.VITE_CLOUD}`,
});

// Komponen helper untuk input dinamis
const DynamicInputField = ({ value, onChange, onRemove, placeholder }) => (
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-porscheGray bg-white p-3 text-porscheBlack transition focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50"
    />
    <button
      type="button"
      onClick={onRemove}
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-porscheGray bg-porscheGray-light text-xl text-porscheBlack transition hover:bg-porscheGray"
    >
      &times;
    </button>
  </div>
);

// Komponen Form Utama
export default function AddProductForm({ initialData, onSave }) {
  const isEditMode = Boolean(initialData);

  const initialFormState = {
    preview: "", images: [], vehicle: "", modelyear: "", exteriorcolour: "", interiorcolours: "", wheels: "", seats: "", rooftransport: "", powertrainperformance: [""], infotainment: "", commnr: "", price: "",
    paintedwheels: "", letteringdecals: "", seatbeltsseatdesign: "", exteriordesign: [""], interiordesign: [""], assistancesystems: "", comfortnusability: [""], lightsvision: [""], equipmentpackages: "",
    wheelcolours: "",
    // --- PERUBAHAN DI SINI ---
    wheelaccesories: "", // Diubah dari [""] menjadi ""
  };

  const [formData, setFormData] = useState(initialFormState);
  
  const [previewFile, setPreviewFile] = useState(null); 
  const [imageFiles, setImageFiles] = useState([]);      

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const previewUploadKey = useRef(0);
  const imagesUploadKey = useRef(1);

  useEffect(() => {
    if (isEditMode && initialData) {
      const mergedData = { ...initialFormState, ...initialData };
      // Hapus 'wheelaccesories' dari daftar field array
      ['powertrainperformance', 'exteriordesign', 'interiordesign', 'comfortnusability', 'lightsvision'].forEach(field => {
        if (!mergedData[field] || mergedData[field].length === 0) {
          mergedData[field] = [''];
        }
      });
      setFormData(mergedData);
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (e, index, field) => {
    const { value } = e.target;
    const list = [...formData[field]];
    list[index] = value;
    setFormData((prev) => ({ ...prev, [field]: list }));
  };

  const handleAddItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveItem = (index, field) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    if (list.length === 0) list.push("");
    setFormData((prev) => ({ ...prev, [field]: list }));
  };

  const handlePreviewFileChange = (files) => {
    if (files.length > 0) setPreviewFile(files[0]);
  };

  const handleDetailFilesChange = (files) => {
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewFile && !isEditMode) {
      setMessage("Error: Preview image is required.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      let previewUrl = formData.preview;
      let imageUrls = formData.images;
      if (previewFile) {
        const upload = await pinataConfig.upload.public.file(previewFile);
        previewUrl = `https://gateway.pinata.cloud/ipfs/${upload.cid}`;
      }
      if (imageFiles.length > 0) {
        const uploads = await Promise.all(
          imageFiles.map(async (file) => {
            const upload = await pinataConfig.upload.public.file(file);
            return `https://gateway.pinata.cloud/ipfs/${upload.cid}`;
          })
        );
        imageUrls = uploads;
      }
      const finalCarData = {
        ...formData,
        modelyear: parseInt(formData.modelyear, 10) || 0,
        price: parseInt(formData.price, 10) || 0,
        preview: previewUrl,
        images: imageUrls,
        powertrainperformance: formData.powertrainperformance.filter(p => p.trim() !== ""),
        exteriordesign: formData.exteriordesign.filter(p => p.trim() !== ""),
        interiordesign: formData.interiordesign.filter(p => p.trim() !== ""),
        comfortnusability: formData.comfortnusability.filter(p => p.trim() !== ""),
        lightsvision: formData.lightsvision.filter(p => p.trim() !== ""),
      };
      const url = isEditMode ? `http://localhost:8080/api/v1/cars/${initialData.id}` : "http://localhost:8080/api/v1/cars";
      const method = isEditMode ? "PATCH" : "POST";
      const response = await fetch(url, { 
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(finalCarData) 
      });
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || `Gagal ${isEditMode ? "memperbarui" : "menambahkan"} produk.`);
      }
      setMessage(`Sukses! Produk berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}.`);
      if (!isEditMode) {
        setFormData(initialFormState);
        setPreviewFile(null);
        setImageFiles([]);
        previewUploadKey.current += 2;
        imagesUploadKey.current += 2;
      }
      if (onSave) onSave();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const DynamicSection = ({ title, fieldName }) => (
    <div>
      <label className="mb-2 block text-sm font-bold text-porscheGray-dark">{title}</label>
      <div className="space-y-3">
        {formData[fieldName]?.map((item, index) => (
          <DynamicInputField key={index} value={item} onChange={(e) => handleDynamicChange(e, index, fieldName)} onRemove={() => handleRemoveItem(index, fieldName)} placeholder="Enter a feature..." />
        ))}
      </div>
      <button type="button" onClick={() => handleAddItem(fieldName)} className="mt-3 rounded-lg border border-porscheGray bg-porscheGray-light px-4 py-2 text-sm font-bold text-porscheBlack transition hover:bg-porscheGray">+ Add Feature</button>
    </div>
  );

  return (
    <div className="font-porsche text-porscheBlack">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider sm:text-4xl">{isEditMode ? "Edit Vehicle" : "Add New Vehicle"}</h1>
        <p className="mt-2 text-lg text-porscheGray-dark">{isEditMode ? `Mengedit konfigurasi untuk ${initialData.vehicle}` : "Isi detail untuk konfigurasi mobil baru."}</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="space-y-3 rounded-lg border border-porscheGray p-4">
            <h2 className="text-xl font-bold">Preview Image</h2>
            <ImageUpload key={previewUploadKey.current} onFilesChange={handlePreviewFileChange} initialPreviews={isEditMode && formData.preview ? [formData.preview] : []} multiple={false} />
        </div>
        <div className="space-y-3 rounded-lg border border-porscheGray p-4">
            <h2 className="text-xl font-bold">Detail Images</h2>
            <ImageUpload key={imagesUploadKey.current} onFilesChange={handleDetailFilesChange} initialPreviews={isEditMode ? formData.images : []} multiple={true} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div><label htmlFor="vehicle" className="mb-2 block text-sm font-bold text-porscheGray-dark">Vehicle Name</label><input type="text" id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" required/></div>
          <div><label htmlFor="modelyear" className="mb-2 block text-sm font-bold text-porscheGray-dark">Model Year</label><input type="number" id="modelyear" name="modelyear" value={formData.modelyear} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" required/></div>
          <div><label htmlFor="commnr" className="mb-2 block text-sm font-bold text-porscheGray-dark">Comm. Nr</label><input type="text" id="commnr" name="commnr" value={formData.commnr} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" required/></div>
          <div><label htmlFor="price" className="mb-2 block text-sm font-bold text-porscheGray-dark">Price (IDR)</label><input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3" required/></div>
          <div><label htmlFor="exteriorcolour" className="mb-2 block text-sm font-bold text-porscheGray-dark">Exterior Colour</label><input type="text" id="exteriorcolour" name="exteriorcolour" value={formData.exteriorcolour} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
          <div><label htmlFor="interiorcolours" className="mb-2 block text-sm font-bold text-porscheGray-dark">Interior Colours</label><input type="text" id="interiorcolours" name="interiorcolours" value={formData.interiorcolours} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
          <div><label htmlFor="wheels" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheels</label><input type="text" id="wheels" name="wheels" value={formData.wheels} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
          <div><label htmlFor="seats" className="mb-2 block text-sm font-bold text-porscheGray-dark">Seats</label><input type="text" id="seats" name="seats" value={formData.seats} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
        </div>
        <div><label htmlFor="rooftransport" className="mb-2 block text-sm font-bold text-porscheGray-dark">Roof Transport System</label><input type="text" id="rooftransport" name="rooftransport" value={formData.rooftransport} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
        
        <DynamicSection title="Powertrain & Performance Features" fieldName="powertrainperformance"/>
        
        <div><label htmlFor="infotainment" className="mb-2 block text-sm font-bold text-porscheGray-dark">Infotainment</label><textarea id="infotainment" name="infotainment" value={formData.infotainment} onChange={handleChange} rows="4" className="w-full rounded-lg border border-porscheGray p-3"></textarea></div>
        
        <div className="space-y-8 rounded-lg border border-porscheGray p-6">
            <h2 className="text-2xl font-bold text-center text-porscheBlack">Additional Configuration Details</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div><label htmlFor="paintedwheels" className="mb-2 block text-sm font-bold text-porscheGray-dark">Painted Wheels</label><input type="text" id="paintedwheels" name="paintedwheels" value={formData.paintedwheels} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
                <div><label htmlFor="letteringdecals" className="mb-2 block text-sm font-bold text-porscheGray-dark">Lettering & Decals</label><input type="text" id="letteringdecals" name="letteringdecals" value={formData.letteringdecals} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div><label htmlFor="seatbeltsseatdesign" className="mb-2 block text-sm font-bold text-porscheGray-dark">Seatbelts & Seat Design</label><input type="text" id="seatbeltsseatdesign" name="seatbeltsseatdesign" value={formData.seatbeltsseatdesign} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
                <div><label htmlFor="assistancesystems" className="mb-2 block text-sm font-bold text-porscheGray-dark">Assistance Systems</label><input type="text" id="assistancesystems" name="assistancesystems" value={formData.assistancesystems} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
            </div>
            <DynamicSection title="Exterior Design" fieldName="exteriordesign"/>
            <DynamicSection title="Interior Design" fieldName="interiordesign"/>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div><label htmlFor="wheelcolours" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheel Colours</label><input type="text" id="wheelcolours" name="wheelcolours" value={formData.wheelcolours} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
              
              {/* --- PERUBAHAN DI SINI --- */}
              <div><label htmlFor="wheelaccesories" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheel Accesories</label><input type="text" id="wheelaccesories" name="wheelaccesories" value={formData.wheelaccesories} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
            </div>
            <DynamicSection title="Comfort & Usability" fieldName="comfortnusability"/>
            <DynamicSection title="Lights & Vision" fieldName="lightsvision"/>
            <div><label htmlFor="equipmentpackages" className="mb-2 block text-sm font-bold text-porscheGray-dark">Equipment Packages</label><input type="text" id="equipmentpackages" name="equipmentpackages" value={formData.equipmentpackages} onChange={handleChange} className="w-full rounded-lg border border-porscheGray p-3"/></div>
        </div>

        <div className="border-t border-porscheGray pt-6">
          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-porscheRed py-4 text-lg font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-500">
            {isLoading ? "Menyimpan..." : isEditMode ? "Update Configuration" : "Save Configuration"}
          </button>
          {message && (<p className={`mt-4 text-center text-sm font-bold ${message.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>)}
        </div>
      </form>
    </div>
  );
}