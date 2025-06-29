import React from 'react';

const Table = ({ headers, children, className = '' }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-xl border border-purple-100">
      <table className={`min-w-full divide-y divide-purple-200 ${className}`}>
        <thead className="bg-purple-50">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-purple-100">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
