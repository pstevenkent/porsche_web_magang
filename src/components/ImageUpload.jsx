import React, { useState, useCallback, useEffect } from 'react';

// Komponen untuk menampilkan thumbnail
const Thumbnail = ({ file }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Cek jika 'file' adalah URL string (untuk initialPreviews)
    if (typeof file === 'string') {
      setPreview(file);
      return;
    }
    // Cek jika 'file' adalah objek File (untuk file baru)
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
    </div>
  );
};


// Komponen Utama ImageUpload
export default function ImageUpload({ onFilesChange, initialPreviews = [], multiple = false }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = useCallback((event) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      onFilesChange(selectedFiles);
    }
  }, [onFilesChange]);
  
  // Gabungkan initialPreviews (URL) dan file baru untuk ditampilkan
  const previews = initialPreviews.length > 0 && files.length === 0 ? initialPreviews : files;

  return (
    <div>
      <div className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-porscheGray transition hover:border-porscheRed hover:bg-porscheGray-light">
        <label htmlFor={`file-upload-${multiple ? 'multi' : 'single'}`} className="flex cursor-pointer flex-col items-center">
          <svg className="h-8 w-8 text-porscheGray-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          <span className="mt-2 text-sm text-porscheBlack">Upload files or drag and drop</span>
          <span className="text-xs text-porscheGray-dark">PNG, JPG up to 10MB</span>
        </label>
        <input 
          id={`file-upload-${multiple ? 'multi' : 'single'}`}
          type="file" 
          className="hidden"
          multiple={multiple}
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
        />
      </div>
      
      {/* Tampilkan thumbnail dari initialPreviews atau file yang baru dipilih */}
      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {previews.map((file, index) => (
            <Thumbnail key={index} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}