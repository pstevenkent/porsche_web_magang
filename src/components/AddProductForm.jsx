import React, { useState, useEffect, useRef } from "react";
import ImageUpload from "./ImageUpload";
import axios from "axios"; 

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
    preview: "", images: [], vehicle: "", modelyear: "", exteriorcolour: "", interiorcolours: "", wheels: "", seats: "", rooftransport: "", powertrainperformance: "", infotainment: "", commnr: "", price: "",
    paintedwheels: "", letteringdecals: "", seatbeltsseatdesign: "", exteriordesign: [""], interiordesign: [""], assistancesystems: "", comfortnusability: [""], lightsvision: [""], equipmentpackages: "", wheelcolours: "", wheelaccesories: "",
    pdf: "",
    specialprice: "", 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [previewFile, setPreviewFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSpecialPrice, setShowSpecialPrice] = useState(false);

  // --- STATE KHUSUS UNTUK ROOF & TRANSPORT SYSTEMS ---
  const presetRoofOptions = [
    "Panoramic roof system",
    "Sliding panoramic roof",
    "Roof rails in aluminium"
  ];
  const [selectedRoofs, setSelectedRoofs] = useState([]);
  const [customRoofInput, setCustomRoofInput] = useState("");

  // --- STATE KHUSUS UNTUK INFOTAINMENT ---
  const presetInfotainmentOptions = [
    "BOSE® Surround Sound System"
  ];
  const [selectedInfotainments, setSelectedInfotainments] = useState([]);
  const [customInfotainmentInput, setCustomInfotainmentInput] = useState("");

  // --- STATE KHUSUS UNTUK POWERTRAIN & PERFORMANCE ---
  const presetPowertrainOptions = [
    "8-speed Porsche Doppelkupplung (PDK)",
    "7-speed Porsche Doppelkupplung (PDK)",
    "Power Steering plus",
    "Sport Chrono Package",
    "Sports exhaust system (tailpipes in Black)",
    "Lifting system front axle",
    "Porsche Doppelkupplung (PDK)",
    "Porsche Electric Sport Sound",
    "Porsche Ceramic Composite Brake (PCCB)"
  ];
  const [selectedPowertrains, setSelectedPowertrains] = useState([]);
  const [customPowertrainInput, setCustomPowertrainInput] = useState("");

  const previewUploadKey = useRef(0);
  const imagesUploadKey = useRef(1);
  const pdfUploadKey = useRef(2);

  // Parsing data saat Edit Mode dengan Proteksi Tipe Data Super Ketat
  useEffect(() => {
    if (isEditMode && initialData) {
      const mergedData = { ...initialFormState, ...initialData };
      
      // 🌟 PERBAIKAN 1: Amankan array input dinamis dari format string database
      ['exteriordesign', 'interiordesign', 'comfortnusability', 'lightsvision'].forEach(field => {
        if (typeof mergedData[field] === 'string' && mergedData[field].trim() !== "") {
          mergedData[field] = mergedData[field].split(", ").map(item => item.trim());
        }
        if (!mergedData[field] || !Array.isArray(mergedData[field]) || mergedData[field].length === 0) {
          mergedData[field] = [''];
        }
      });
      
      setFormData(mergedData);

      if (mergedData.specialprice && mergedData.specialprice > 0) {
        setShowSpecialPrice(true);
      }

      // 🌟 PERBAIKAN 2: Amankan Sinkronisasi data rooftransport
      if (mergedData.rooftransport) {
        const roofStr = String(mergedData.rooftransport); 
        const existingRoofs = roofStr.split(", ").map(item => item.trim());
        const matchedPresets = existingRoofs.filter(item => presetRoofOptions.includes(item));
        const unmatchedCustom = existingRoofs.filter(item => !presetRoofOptions.includes(item));

        setSelectedRoofs(matchedPresets);
        if (unmatchedCustom.length > 0) {
          setCustomRoofInput(unmatchedCustom.join(", "));
        }
      }

      // 🌟 PERBAIKAN 3: Amankan Sinkronisasi data infotainment
      if (mergedData.infotainment) {
        const infoStr = String(mergedData.infotainment);
        const existingInfotainments = infoStr.split(", ").map(item => item.trim());
        const matchedPresets = existingInfotainments.filter(item => presetInfotainmentOptions.includes(item));
        const unmatchedCustom = existingInfotainments.filter(item => !presetInfotainmentOptions.includes(item));

        setSelectedInfotainments(matchedPresets);
        if (unmatchedCustom.length > 0) {
          setCustomInfotainmentInput(unmatchedCustom.join(", "));
        }
      }

      // 🌟 FIX UTAMA ERROR LOG: Mengamankan powertrainperformance dari crash split murni
      if (mergedData.powertrainperformance) {
        if (Array.isArray(mergedData.powertrainperformance)) {
          setSelectedPowertrains(mergedData.powertrainperformance.filter(item => presetPowertrainOptions.includes(item)));
          const unmatchedCustom = mergedData.powertrainperformance.filter(item => !presetPowertrainOptions.includes(item));
          if (unmatchedCustom.length > 0) {
            setCustomPowertrainInput(unmatchedCustom.join(", "));
          }
        } else {
          const powerStr = String(mergedData.powertrainperformance);
          const existingPowertrains = powerStr.split(", ").map(item => item.trim());
          const matchedPresets = existingPowertrains.filter(item => presetPowertrainOptions.includes(item));
          const unmatchedCustom = existingPowertrains.filter(item => !presetPowertrainOptions.includes(item));

          setSelectedPowertrains(matchedPresets);
          if (unmatchedCustom.length > 0) {
            setCustomPowertrainInput(unmatchedCustom.join(", "));
          }
        }
      }
    }
  }, [initialData, isEditMode]);

  // Handle Perubahan Checklist Box Roof
  const handleRoofCheckboxChange = (option) => {
    setSelectedRoofs((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  // Handle Perubahan Checklist Box Infotainment
  const handleInfotainmentCheckboxChange = (option) => {
    setSelectedInfotainments((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  // Handle Perubahan Checklist Box Powertrain
  const handlePowertrainCheckboxChange = (option) => {
    setSelectedPowertrains((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

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
    setMessage("");
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== "image/webp") {
        setMessage("Error: Gambar Preview harus berformat .webp");
        setPreviewFile(null);
        previewUploadKey.current += 1; 
        return;
      }
      setPreviewFile(file);
    } else {
      setPreviewFile(null);
    }
  };

  const handleDetailFilesChange = (files) => {
    setMessage("");
    if (files.length > 0) {
      const hasNonWebp = files.some(file => file.type !== "image/webp");
      if (hasNonWebp) {
        setMessage("Error: Semua Gambar Detail wajib berformat .webp");
        setImageFiles([]);
        imagesUploadKey.current += 1; 
        return;
      }
      setImageFiles(files);
    } else {
      setImageFiles([]);
    }
  };

  const handlePdfFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    } else {
      setPdfFile(null);
    }
  };

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append('file', file);

    const res = await axios.post('http://localhost:8080/api/v1/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data?.status === 'success' && res.data?.data?.url) {
      return res.data.data.url;
    }
    throw new Error(res.data?.message || 'Upload failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!previewFile && (!isEditMode || !formData.preview)) { setMessage("Error: Preview Image wajib diunggah."); return; }
    if (imageFiles.length === 0 && (!isEditMode || !formData.images || formData.images.length === 0)) { setMessage("Error: Detail Images wajib diunggah minimal 1 gambar."); return; }
    if (!pdfFile && (!isEditMode || !formData.pdf)) { setMessage("Error: Product Brochure (PDF) wajib diunggah."); return; }
    if (!formData.exteriorcolour || formData.exteriorcolour.trim() === "") { setMessage("Error: Exterior Colour wajib diisi."); return; }

    setIsLoading(true);
    setMessage("Uploading files to Cloudinary...");

    try {
      let previewUrl = formData.preview;
      let imageUrls = formData.images;
      let pdfUrl = formData.pdf;

      if (previewFile) previewUrl = await uploadFile(previewFile);
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => uploadFile(file));
        imageUrls = await Promise.all(uploadPromises);
      }
      if (pdfFile) pdfUrl = await uploadFile(pdfFile);

      setMessage("Files uploaded. Saving configuration...");

      const finalRoofItems = [...selectedRoofs];
      if (customRoofInput.trim() !== "") {
        finalRoofItems.push(customRoofInput.trim());
      }
      const combinedRoofString = finalRoofItems.join(", ");

      const finalInfotainmentItems = [...selectedInfotainments];
      if (customInfotainmentInput.trim() !== "") {
        finalInfotainmentItems.push(customInfotainmentInput.trim());
      }
      const combinedInfotainmentString = finalInfotainmentItems.join(", ");

      const finalPowertrainItems = [...selectedPowertrains];
      if (customPowertrainInput.trim() !== "") {
        finalPowertrainItems.push(customPowertrainInput.trim());
      }
      const combinedPowertrainString = finalPowertrainItems.join(", ");

      const finalCarData = {
        ...formData,
        modelyear: parseInt(formData.modelyear, 10) || 0,
        price: parseInt(formData.price, 10) || 0,
        specialprice: showSpecialPrice ? (parseInt(formData.specialprice, 10) || 0) : 0,
        preview: previewUrl,
        images: imageUrls,
        pdf: pdfUrl,
        rooftransport: combinedRoofString, 
        infotainment: combinedInfotainmentString, 
        powertrainperformance: combinedPowertrainString,
        exteriorcolour: formData.exteriorcolour.trim(),
        exteriordesign: formData.exteriordesign.filter(p => p.trim() !== "").join(", "),
        interiordesign: formData.interiordesign.filter(p => p.trim() !== "").join(", "),
        comfortnusability: formData.comfortnusability.filter(p => p.trim() !== "").join(", "),
        lightsvision: formData.lightsvision.filter(p => p.trim() !== "").join(", "),
      };

      const url = isEditMode ? `http://localhost:8080/api/v1/cars/${initialData.id}` : "http://localhost:8080/api/v1/cars";
      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalCarData)
      });

      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || `Gagal ${isEditMode ? "memperbarui" : "menambahkan"} produk.`);
      }

      setMessage(`Sukses! Produk berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}.`);
      
      // Delay sedikit penutupan form agar sinkronisasi state induk selesai murni
      setTimeout(() => {
        if (!isEditMode) {
          setFormData(initialFormState);
          setPreviewFile(null);
          setImageFiles([]);
          setPdfFile(null);
          setShowSpecialPrice(false);
          setSelectedRoofs([]);
          setCustomRoofInput("");
          setSelectedInfotainments([]);
          setCustomInfotainmentInput("");
          setSelectedPowertrains([]);
          setCustomPowertrainInput("");
          previewUploadKey.current += 3;
          imagesUploadKey.current += 3;
          pdfUploadKey.current += 3;
        }
        if (onSave) onSave();
      }, 400);

    } catch (error) {
      console.error(error); 
      const errorMessage = error.response?.data?.message || error.message;
      setMessage(`Error: ${errorMessage}`);
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
        <p className="mt-2 text-lg text-porscheGray-dark">{isEditMode ? `Mengedit konfigurasi untuk ${initialData.vehicle}` : "Fill in the details for the new car configuration."}</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* PREVIEW IMAGE */}
        <div className="space-y-3 rounded-lg border border-porscheGray p-4 bg-white">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Preview Image <span className="text-porscheRed">*</span></h2>
            <p className="text-xs text-porscheGray-dark mt-1">Please upload the primary cover photo for the vehicle catalog.</p>
          </div>
          <ImageUpload key={previewUploadKey.current} onFilesChange={handlePreviewFileChange} initialPreviews={isEditMode && formData.preview ? [formData.preview] : []} multiple={false} accept="image/webp" />
        </div>

        {/* DETAIL IMAGES */}
        <div className="space-y-3 rounded-lg border border-porscheGray p-4 bg-white">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Detail Images <span className="text-porscheRed">*</span></h2>
            <p className="text-xs text-porscheGray-dark mt-1">Please upload at least one or more detail images (interior, wheels, rear view, etc.).</p>
          </div>
          <ImageUpload key={imagesUploadKey.current} onFilesChange={handleDetailFilesChange} initialPreviews={isEditMode ? formData.images : []} multiple={true} accept="image/webp" />
        </div>

        {/* PDF BROCHURE */}
        <div className="space-y-3 rounded-lg border border-porscheGray p-4 bg-white">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Product Brochure (PDF) <span className="text-porscheRed">*</span></h2>
            <p className="text-xs text-porscheGray-dark mt-1">Please upload the official technical specification brochure file in PDF format.</p>
          </div>
          <input
            key={pdfUploadKey.current}
            type="file"
            name="pdf"
            accept=".pdf"
            onChange={handlePdfFileChange}
            className="block w-full text-sm text-porscheGray-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-porscheGray-light file:text-porscheBlack hover:file:bg-porscheGray"
          />
          {isEditMode && formData.pdf && <p className="text-xs text-green-600 mt-2">Current PDF: <a href={formData.pdf} target="_blank" rel="noopener noreferrer" className="underline">View</a></p>}
        </div>

        {/* GRID UTAMA INPUT DATA TEKS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* VEHICLE NAME */}
          <div>
            <label htmlFor="vehicle" className="mb-2 block text-sm font-bold text-porscheGray-dark">Vehicle Name <span className="text-porscheRed">*</span></label>
            <input type="text" id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} placeholder="e.g. 718 Cayman, Macan EV" className="w-full rounded-lg border border-porscheGray p-3 bg-white" required />
          </div>

          {/* MODEL YEAR */}
          <div>
            <label htmlFor="modelyear" className="mb-2 block text-sm font-bold text-porscheGray-dark">Model Year <span className="text-porscheRed">*</span></label>
            <input type="number" id="modelyear" name="modelyear" value={formData.modelyear} onChange={handleChange} placeholder="e.g. 2025" className="w-full rounded-lg border border-porscheGray p-3 bg-white" required />
          </div>

          {/* COMM NUMBER */}
          <div>
            <label htmlFor="commnr" className="mb-2 block text-sm font-bold text-porscheGray-dark">Comm. Nr <span className="text-porscheRed">*</span></label>
            <input type="text" id="commnr" name="commnr" value={formData.commnr} onChange={handleChange} placeholder="e.g. R04425" className="w-full rounded-lg border border-porscheGray p-3 bg-white" required />
          </div>
          
          {/* BASE PRICE */}
          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-bold text-porscheGray-dark">Price (IDR) <span className="text-porscheRed">*</span></label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 2500000000" className="w-full rounded-lg border border-porscheGray p-3 bg-white" required />
          </div>

          {/* TOGGLE SPECIAL PRICE */}
          <div className="flex items-center gap-2 self-end mb-4 text-porscheBlack">
            <input
              type="checkbox"
              id="specialPriceToggle"
              checked={showSpecialPrice}
              onChange={(e) => setShowSpecialPrice(e.target.checked)}
              className="h-5 w-5 rounded border-porscheGray text-porscheRed focus:ring-porscheRed"
            />
            <label htmlFor="specialPriceToggle" className="text-sm font-bold text-porscheGray-dark cursor-pointer select-none">
              Add Special Price
            </label>
          </div>

          {/* INPUT FOR SPECIAL PRICE */}
          {showSpecialPrice && (
            <div>
              <label htmlFor="specialprice" className="mb-2 block text-sm font-bold text-porscheRed">Special Price (IDR)</label>
              <input type="number" id="specialprice" name="specialprice" value={formData.specialprice} onChange={handleChange} placeholder="Enter special promo price amount" className="w-full rounded-lg border border-porscheRed p-3 bg-white focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50" required />
            </div>
          )}

          {/* EXTERIOR COLOUR */}
          <div>
            <label htmlFor="exteriorcolour" className="mb-2 block text-sm font-bold text-porscheGray-dark">Exterior Colour <span className="text-porscheRed">*</span></label>
            <input type="text" id="exteriorcolour" name="exteriorcolour" value={formData.exteriorcolour} onChange={handleChange} placeholder="e.g. Carrara White Metallic, Shark Blue" className="w-full rounded-lg border border-porscheGray p-3 bg-white" required />
          </div>

          {/* FIELD OPSIONAL LAINNYA */}
          <div><label htmlFor="interiorcolours" className="mb-2 block text-sm font-bold text-porscheGray-dark">Interior Colours & Materials</label><input type="text" id="interiorcolours" name="interiorcolours" value={formData.interiorcolours} onChange={handleChange} placeholder="e.g. Black leather interior with Race-Tex" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
          <div><label htmlFor="wheels" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheels</label><input type="text" id="wheels" name="wheels" value={formData.wheels} onChange={handleChange} placeholder="e.g. 20-inch Carrera S wheels" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
          <div><label htmlFor="seats" className="mb-2 block text-sm font-bold text-porscheGray-dark">Seats</label><input type="text" id="seats" name="seats" value={formData.seats} onChange={handleChange} placeholder="e.g. Comfort seats front (14-way, electric)" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
        </div>

        {/* --- ROOF & TRANSPORT SYSTEM --- */}
        <div className="rounded-lg border border-porscheGray p-4 bg-white space-y-4">
          <label className="block text-sm font-bold text-porscheGray-dark">
            Roof & Transport Systems
          </label>
          
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 bg-porscheGray-light/40 p-3 rounded-lg border border-dashed border-porscheGray">
            {presetRoofOptions.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-2 hover:bg-porscheGray-light rounded-md cursor-pointer transition select-none">
                <input
                  type="checkbox"
                  checked={selectedRoofs.includes(option)}
                  onChange={() => handleRoofCheckboxChange(option)}
                  className="h-5 w-5 rounded border-porscheGray text-porscheRed focus:ring-porscheRed"
                />
                <span className="text-sm font-medium text-porscheBlack">{option}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="customRoofInput" className="block text-xs font-bold text-porscheGray-dark uppercase tracking-wider">
              Other / Custom Roof Option
            </label>
            <input
              type="text"
              id="customRoofInput"
              value={customRoofInput}
              onChange={(e) => setCustomRoofInput(e.target.value)}
              className="w-full rounded-lg border border-porscheGray p-3 text-sm focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50 transition bg-white"
            />
          </div>
        </div>

        {/* --- POWERTRAIN & PERFORMANCE --- */}
        <div className="rounded-lg border border-porscheGray p-4 bg-white space-y-4">
          <label className="block text-sm font-bold text-porscheGray-dark">
            Powertrain & Performance Features
          </label>
          
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 bg-porscheGray-light/40 p-3 rounded-lg border border-dashed border-porscheGray">
            {presetPowertrainOptions.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-2 hover:bg-porscheGray-light rounded-md cursor-pointer transition select-none">
                <input
                  type="checkbox"
                  checked={selectedPowertrains.includes(option)}
                  onChange={() => handlePowertrainCheckboxChange(option)}
                  className="h-5 w-5 rounded border-porscheGray text-porscheRed focus:ring-porscheRed"
                />
                <span className="text-sm font-medium text-porscheBlack">{option}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="customPowertrainInput" className="block text-xs font-bold text-porscheGray-dark uppercase tracking-wider">
              Other / Custom Powertrain Option
            </label>
            <input
              type="text"
              id="customPowertrainInput"
              value={customPowertrainInput}
              onChange={(e) => setCustomPowertrainInput(e.target.value)}
              className="w-full rounded-lg border border-porscheGray p-3 text-sm focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50 transition bg-white"
            />
          </div>
        </div>
        
        {/* --- INFOTAINMENT --- */}
        <div className="rounded-lg border border-porscheGray p-4 bg-white space-y-4">
          <label className="block text-sm font-bold text-porscheGray-dark">
            Infotainment
          </label>
          
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 bg-porscheGray-light/40 p-3 rounded-lg border border-dashed border-porscheGray">
            {presetInfotainmentOptions.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-2 hover:bg-porscheGray-light rounded-md cursor-pointer transition select-none">
                <input
                  type="checkbox"
                  checked={selectedInfotainments.includes(option)}
                  onChange={() => handleInfotainmentCheckboxChange(option)}
                  className="h-5 w-5 rounded border-porscheGray text-porscheRed focus:ring-porscheRed"
                />
                <span className="text-sm font-medium text-porscheBlack">{option}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="customInfotainmentInput" className="block text-xs font-bold text-porscheGray-dark uppercase tracking-wider">
              Other / Custom Infotainment Option
            </label>
            <input
              type="text"
              id="customInfotainmentInput"
              value={customInfotainmentInput}
              onChange={(e) => setCustomInfotainmentInput(e.target.value)}
              className="w-full rounded-lg border border-porscheGray p-3 text-sm focus:border-porscheRed focus:outline-none focus:ring-2 focus:ring-porscheRed/50 transition bg-white"
            />
          </div>
        </div>

        {/* LOGIKA STRUKTUR TAMBAHAN AKSESORIS */}
        <div className="space-y-8 rounded-lg border border-porscheGray p-6 bg-white">
          <h2 className="text-2xl font-bold text-center text-porscheBlack">Additional Configuration Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div><label htmlFor="paintedwheels" className="mb-2 block text-sm font-bold text-porscheGray-dark">Painted Wheels</label><input type="text" id="paintedwheels" name="paintedwheels" value={formData.paintedwheels} onChange={handleChange} placeholder="e.g. Wheels painted in Satin Black" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
            <div><label htmlFor="letteringdecals" className="mb-2 block text-sm font-bold text-porscheGray-dark">Lettering & Decals</label><input type="text" id="letteringdecals" name="letteringdecals" value={formData.letteringdecals} onChange={handleChange} placeholder="e.g. Decorative side logo 'PORSCHE' in Black" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div><label htmlFor="seatbeltsseatdesign" className="mb-2 block text-sm font-bold text-porscheGray-dark">Seatbelts & Seat Design</label><input type="text" id="seatbeltsseatdesign" name="seatbeltsseatdesign" value={formData.seatbeltsseatdesign} onChange={handleChange} placeholder="e.g. Seat belts in Guards Red" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
            <div><label htmlFor="assistancesystems" className="mb-2 block text-sm font-bold text-porscheGray-dark">Assistance Systems</label><input type="text" id="assistancesystems" name="assistancesystems" value={formData.assistancesystems} onChange={handleChange} placeholder="e.g. ParkAssist (rear) with reversing camera" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
          </div>
          <DynamicSection title="Exterior Design" fieldName="exteriordesign" />
          <DynamicSection title="Interior Design" fieldName="interiordesign" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div><label htmlFor="wheelcolours" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheel Colours</label><input type="text" id="wheelcolours" name="wheelcolours" value={formData.wheelcolours} onChange={handleChange} placeholder="e.g Wheels painted in White " className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
            <div><label htmlFor="wheelaccesories" className="mb-2 block text-sm font-bold text-porscheGray-dark">Wheel Accessories</label><input type="text" id="wheelaccesories" name="wheelaccesories" value={formData.wheelaccesories} onChange={handleChange} placeholder="e.g. Tyre Mobility Set" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DynamicSection title="Comfort & Usability" fieldName="comfortnusability" />
            <DynamicSection title="Lights & Vision" fieldName="lightsvision" />
          </div>
          <div><label htmlFor="equipmentpackages" className="mb-2 block text-sm font-bold text-porscheGray-dark">Equipment Packages</label><input type="text" id="equipmentpackages" name="equipmentpackages" value={formData.equipmentpackages} onChange={handleChange} placeholder="e.g. Weissach package" className="w-full rounded-lg border border-porscheGray p-3 bg-white" /></div>
        </div>

        {/* SISI FOOTER AKSI TOMBOL */}
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