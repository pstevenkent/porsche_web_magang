import React, { useState, useEffect } from 'react';

// SVG Icons untuk tombol aksi
const EditIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> );
const DeleteIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg> );

export default function ManageProductsPage({ onEdit }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fungsi untuk mengambil data mobil dari backend
  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/v1/cars');
      const result = await response.json();
      if (result.status === 'success') {
        setCars(result.data.cars || []);
      } else {
        throw new Error(result.message || 'Gagal mengambil data mobil.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchCars();
  }, []);

  // Fungsi untuk menangani penghapusan produk
  const handleDelete = async (carId, carName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${carName}?`)) {
      return;
    }
    setMessage('');
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/v1/cars/${carId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || 'Gagal menghapus produk.');
      }
      setMessage(`Berhasil menghapus ${carName}.`);
      fetchCars(); // Muat ulang daftar mobil setelah berhasil dihapus
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="font-porsche text-porscheBlack p-4 sm:p-8 bg-white rounded-b-xl">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider sm:text-4xl">Manage Vehicle Catalogue</h1>
        <p className="mt-2 text-lg text-porscheGray-dark">Perbarui atau hapus konfigurasi mobil yang sudah ada.</p>
      </header>

      {loading && <p className="text-center">Memuat data mobil...</p>}
      {error && <p className="text-center text-red-500 font-bold">Error: {error}</p>}
      {message && <p className="text-center text-green-500 font-bold">{message}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-porscheGray">
            <thead className="bg-porscheGray-light">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-porscheGray-dark uppercase tracking-wider">Kendaraan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-porscheGray-dark uppercase tracking-wider">Tahun Model</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-porscheGray-dark uppercase tracking-wider">Warna Eksterior</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-porscheGray">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <tr key={car.id} className="hover:bg-porscheGray-light">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-porscheBlack">{car.vehicle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-porscheGray-dark">{car.modelyear}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-porscheGray-dark">{car.exteriorcolour}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => onEdit(car)} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-2">
                        <EditIcon /> Edit
                      </button>
                      <button onClick={() => handleDelete(car.id, car.vehicle)} className="text-porscheRed hover:text-red-900 inline-flex items-center gap-2">
                        <DeleteIcon /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-porscheGray-dark">Tidak ada kendaraan yang ditemukan di database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}