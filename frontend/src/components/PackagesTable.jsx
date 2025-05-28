import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "./ui/button";

const PackagesTable = ({ packages }) => {
  const [selectedQR, setSelectedQR] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-xl p-6 text-blue-900">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-blue-800 text-center">
        All Packages
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="border-b border-blue-300 bg-blue-50">
              <th className="text-left p-3 font-semibold text-blue-700">Package ID</th>
              <th className="text-left p-3 font-semibold text-blue-700">Status</th>
              <th className="text-left p-3 font-semibold text-blue-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr
                key={pkg._id}
                className="border-b border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <td className="p-3">{pkg.packageId || pkg._id}</td>
                <td className="p-3 capitalize">{pkg.deliveryStatus}</td>
                <td className="p-3">
                  <Button
                    onClick={() => setSelectedQR(pkg.encryptedData)}
                    aria-label={`Show QR code for package ${pkg.packageId || pkg._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg transition duration-300"
                  >
                    Show QR
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQR && (
        <div className="mt-6 p-6 bg-white/90 backdrop-blur-md border border-blue-300 rounded-lg shadow-lg relative inline-block max-w-md mx-auto">
          <button
            onClick={() => setSelectedQR(null)}
            className="absolute top-3 right-4 text-blue-600 hover:text-blue-900 font-bold text-xl leading-none"
            aria-label="Close QR code"
            type="button"
          >
            ✕
          </button>
          <p className="mb-4 font-semibold text-blue-800 text-center text-lg">
            QR Code
          </p>
          <div className="flex justify-center">
            <QRCodeCanvas value={selectedQR} size={256} className="rounded-lg shadow-md" />
          </div>
          <p className="mt-4 px-3 py-2 bg-blue-50 rounded text-sm text-blue-700 break-words select-all text-center">
            {selectedQR}
          </p>
        </div>
      )}
    </div>
  );
};

export default PackagesTable;
