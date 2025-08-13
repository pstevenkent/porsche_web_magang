import React, { useState } from 'react';
import Papa from 'papaparse';
import LoadingOverlay from '../components/LoadingOverlay';
import Modal from '../components/Modal';
import FileUpload from '../components/FileUpload';
import CSVTable from '../components/CSVTable';

function CompareCSVPage() { // Pastikan nama fungsi ini adalah CompareCSVPage
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [keys, setKeys] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const parseAndCompare = () => {
    if (!file1 || !file2) {
      setMessage("Harap unggah kedua file CSV untuk dibandingkan.");
      return;
    }
    setLoading(true);
    
    const parseFile = (file) => new Promise((resolve, reject) => {
        Papa.parse(file, { header: true, skipEmptyLines: true, complete: resolve, error: reject });
    });

    Promise.all([parseFile(file1), parseFile(file2)])
      .then(([res1, res2]) => {
        const keyList = keys ? keys.split(',').map(k => k.trim()) : res1.meta.fields;
        
        const createKey = (row) => keyList.map(k => row[k]).join("|");

        const map1 = new Map(res1.data.map(row => [createKey(row), row]));
        const map2 = new Map(res2.data.map(row => [createKey(row), row]));
        
        let mismatches = [];
        
        map1.forEach((value, key) => {
          if (!map2.has(key)) mismatches.push(value);
        });

        map2.forEach((value, key) => {
          if (!map1.has(key)) mismatches.push(value);
        });

        if (mismatches.length > 0) {
            const headers = Object.keys(mismatches[0]);
            const mismatchData = [headers, ...mismatches.map(row => headers.map(h => row[h]))];
            setResult(mismatchData);
        } else {
            setResult([]);
            setMessage("Tidak ada ketidakcocokan yang ditemukan.");
        }
        setLoading(false);
      })
      .catch(err => {
        setMessage(`Gagal membandingkan file: ${err.message}`);
        setLoading(false);
      });
  };

  const downloadMismatch = () => {
    const csv = Papa.unparse(result);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ketidakcocokan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-xl font-bold text-porscheGray-dark">Bandingkan Dua File CSV</h2>
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div>
          <label className="block mb-2 font-bold text-porscheGray-dark">File CSV Pertama</label>
          <FileUpload onFile={setFile1} />
          {file1 && <p className="mt-2 text-center text-sm text-porscheGray-dark">File: {file1.name}</p>}
        </div>
        <div>
          <label className="block mb-2 font-bold text-porscheGray-dark">File CSV Kedua</label>
          <FileUpload onFile={setFile2} />
          {file2 && <p className="mt-2 text-center text-sm text-porscheGray-dark">File: {file2.name}</p>}
        </div>
      </div>
      <div className="w-full max-w-lg">
        <label className="block mb-2 font-bold text-porscheGray-dark">Kolom Kunci (opsional, pisahkan dengan koma)</label>
        <input
          type="text"
          className="w-full p-3 border border-porscheGray rounded-md focus:ring-2 focus:ring-porscheRed focus:border-transparent outline-none"
          placeholder="Contoh: id, nama_produk, sku"
          value={keys}
          onChange={(e) => setKeys(e.target.value)}
        />
        <p className="text-xs text-red-800 mt-1">Jika kosong, semua kolom akan digunakan sebagai kunci.</p>

      </div>
      <button onClick={parseAndCompare} className="bg-porscheBlack text-white px-8 py-3 rounded-md hover:bg-porscheGray-dark transition-colors font-bold">
        Bandingkan CSV
      </button>
      {result.length > 1 && (
        <div className="w-full">
            <h3 className="text-lg font-bold text-porscheGray-dark mt-4">Hasil Ketidakcocokan:</h3>
            <CSVTable data={result} />
            <div className="text-center mt-6">
                <button onClick={downloadMismatch} className="bg-porscheRed text-white px-8 py-3 rounded-md hover:opacity-90 transition-opacity font-bold">
                    Unduh Ketidakcocokan
                </button>
            </div>
        </div>
      )}
      <LoadingOverlay isLoading={loading} />
      <Modal message={message} onClose={() => setMessage(null)} />
    </div>
  );
}

export default CompareCSVPage; // Pastikan export ini benar