import React, { useState } from 'react';
import Papa from 'papaparse';
import LoadingOverlay from '../components/LoadingOverlay';
import Modal from '../components/Modal';
import FileUpload from '../components/FileUpload';
import CSVTable from '../components/CSVTable';

function ReadCSVPage() { // Pastikan nama fungsi ini adalah ReadCSVPage
  const [csvFile, setCsvFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const parseCSV = () => {
    if (!csvFile) {
      setMessage("Harap unggah file CSV terlebih dahulu.");
      return;
    }
    setLoading(true);
    Papa.parse(csvFile, {
      complete: (result) => {
        setData(result.data);
        setLoading(false);
      },
      error: (err) => {
        setMessage(`Gagal membaca file CSV: ${err.message}`);
        setLoading(false);
      },
    });
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hasil_baca.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-xl font-bold text-porscheGray-dark">Baca & Tampilkan File CSV</h2>
      <div className="w-full max-w-lg">
        <FileUpload onFile={setCsvFile} />
        {csvFile && <p className="mt-2 text-center text-sm text-porscheGray-dark">File terpilih: {csvFile.name}</p>}
      </div>
      <button onClick={parseCSV} className="bg-porscheBlack text-white px-8 py-3 rounded-md hover:bg-porscheGray-dark transition-colors font-bold">
        Baca CSV
      </button>
      {data.length > 0 && (
        <div className="w-full">
          <CSVTable data={data} />
          <div className="text-center mt-6">
            <button onClick={downloadCSV} className="bg-porscheRed text-white px-8 py-3 rounded-md hover:opacity-90 transition-opacity font-bold">
              Unduh CSV yang Dibaca
            </button>
          </div>
        </div>
      )}
      <LoadingOverlay isLoading={loading} />
      <Modal message={message} onClose={() => setMessage(null)} />
    </div>
  );
}

export default ReadCSVPage; // Pastikan export ini benar