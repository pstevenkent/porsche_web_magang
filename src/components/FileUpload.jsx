import React, { useState, useRef } from 'react';

function FileUpload({ onFile, acceptedFileType = ".csv" }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (files) => {
    if (files && files[0]) {
      onFile(files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    handleFileChange(e.target.files);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
        ${dragActive ? 'border-porscheRed bg-porscheGray-light' : 'border-porscheGray bg-white hover:border-porscheGray-dark'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFileType}
        onChange={handleChange}
        className="hidden"
      />
      <p className="text-porscheGray-dark">Seret file ke sini, atau klik untuk memilih file</p>
      <p className="text-sm text-gray-400 mt-1">Hanya file {acceptedFileType.toUpperCase()}</p>
    </div>
  );
}

export default FileUpload;