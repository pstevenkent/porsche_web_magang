import React, { useState, useCallback } from 'react';

// SVG Icon untuk upload
const UploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-porscheGray-dark" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ImageUpload({ onFilesChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    onFilesChange(imageFiles); // Kirim file yang valid ke komponen induk

    // Buat URL pratinjau untuk ditampilkan
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
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-porscheRed focus-within:outline-none focus-within:ring-2 focus-within:ring-porscheRed focus-within:ring-offset-2 hover:text-red-700">
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
              <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full rounded-md object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
