import React, { useState, useCallback, useEffect } from 'react';

const Thumbnail = ({ file }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (typeof file === 'string') {
      setPreview(file);
      return;
    }
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (!preview) return null;

  return (
    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
    </div>
  );
};

export default function ImageUpload({ onFilesChange, initialPreviews = [], multiple = false }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = useCallback((event) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      
      // 1. Validasi format berkas (.webp)
      const hasInvalidFormat = selectedFiles.some(file => file.type !== "image/webp");
      if (hasInvalidFormat) {
        alert("Format file tidak didukung!\nSemua gambar yang diunggah wajib berformat .webp");
        event.target.value = "";
        return;
      }

      // 2. LOGIKA BARU: Jika mode MULTIPLE, gabungkan file baru di BELAKANG file lama (Menjaga Urutan Klik)
      let updatedFiles = [];
      if (multiple) {
        updatedFiles = [...files, ...selectedFiles];
      } else {
        updatedFiles = selectedFiles; // Jika single, langsung ganti
      }

      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      
      // Reset value input agar admin bisa memilih file yang sama lagi jika perlu
      event.target.value = "";
    }
  }, [files, multiple, onFilesChange]);

  // Tombol hapus untuk mengatur ulang jika urutan salah
  const handleClearImages = () => {
    setFiles([]);
    onFilesChange([]);
  };
  
  const previews = files.length > 0 ? files : initialPreviews;
  const inputId = `file-upload-${multiple ? 'multi' : 'single'}-${React.useId()}`;

  return (
    <div>
      <label 
        htmlFor={inputId} 
        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-porscheGray transition hover:border-porscheRed hover:bg-porscheGray-light"
      >
        <svg className="h-8 w-8 text-porscheGray-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span className="mt-2 text-sm text-porscheBlack">Upload files or drag and drop</span>
        <span className="text-xs text-porscheGray-dark">Only WEBP up to 10MB</span>
      </label>
      
      <input 
        id={inputId}
        type="file" 
        className="hidden"
        multiple={multiple}
        onChange={handleFileChange}
        accept="image/webp"
      />
      
      {files.length > 0 && (
        <button 
          type="button" 
          onClick={handleClearImages}
          className="mt-2 text-xs font-bold text-porscheRed hover:underline"
        >
          Reset Pilihan Gambar
        </button>
      )}

      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {previews.map((file, index) => (
            <div key={index} className="relative">
              <Thumbnail file={file} />
              {/* Indikator Urutan Angka Gambar */}
              <span className="absolute -top-2 -right-2 bg-porscheBlack text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-white">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}