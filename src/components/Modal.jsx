import React from 'react';

function Modal({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <p className="mb-4 text-center text-porscheGray-dark">{message}</p>
        <div className="flex justify-center">
          <button onClick={onClose} className="bg-porscheRed text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;