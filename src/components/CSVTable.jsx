import React from 'react';

function CSVTable({ data }) {
  if (!data || data.length === 0) {
    return <p>Tidak ada data untuk ditampilkan.</p>;
  }

  const headers = data[0];
  const rows = data.slice(1);

  return (
    <div className="overflow-auto max-h-[400px] border border-porscheGray rounded-lg mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-porscheGray-light sticky top-0">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-3 font-bold text-porscheGray-dark uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-porscheGray">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-porscheGray-light">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CSVTable;