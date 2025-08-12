import React, { useState, useCallback, useEffect } from 'react';

// SVG Icon untuk area upload
const UploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-porscheGray-dark" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ImageUpload({ onFilesChange, initialPreviews = [] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);

  // Efek untuk menampilkan pratinjau awal saat dalam mode edit
  useEffect(() => {
    // Hanya atur pratinjau awal jika ada dan berbeda dari yang sekarang
    if (initialPreviews.length > 0 && JSON.stringify(initialPreviews) !== JSON.stringify(previews)) {
        // Jika path gambar dari backend adalah lokal (misal: "./uploads/file.jpg"),
        // kita perlu mengubahnya menjadi URL lengkap yang bisa diakses browser.
        const fullUrlPreviews = initialPreviews.map(src => {
            if (src.startsWith('./uploads')) {
                return `http://localhost:8080${src.substring(1)}`; // Mengubah ./uploads -> /uploads
            }
            return src;
        });
        setPreviews(fullUrlPreviews);
    }
  }, [initialPreviews]);

  // Fungsi untuk menangani file yang dipilih atau di-drop
  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    onFilesChange(imageFiles); // Kirim file yang valid ke komponen induk

    // Buat URL pratinjau lokal untuk file yang baru diunggah
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }, [onFilesChange]);

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-porscheGray-dark">Images</label>
      <div
        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
        className={`flex justify-center rounded-lg border-2 border-dashed border-porscheGray px-6 py-10 transition-colors ${isDragging ? 'border-porscheRed bg-porscheGray-light' : 'bg-white'}`}
      >
        <div className="text-center">
          <UploadIcon />
          <div className="mt-4 flex text-sm leading-6 text-porscheGray-dark">
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-porscheRed hover:text-red-700">
              <span>Upload files</span>
              <input id="file-upload" name="images" type="file" className="sr-only" multiple accept="image/png, image/jpeg" onChange={handleFileSelect} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-porscheGray-dark">PNG, JPG up to 10MB</p>
        </div>
      </div>
      
      {/* Tampilkan Pratinjau Gambar */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {previews.map((src, index) => (
            <div key={index} className="relative aspect-square">
              <img 
                src={src} 
                alt={`Preview ${index + 1}`} 
                className="h-full w-full rounded-md object-cover" 
                // Jika gambar gagal dimuat (misal karena path salah), tampilkan placeholder
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=Error"; }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}