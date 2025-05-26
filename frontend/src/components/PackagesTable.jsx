import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "./ui/button";

const PackagesTable = ({ packages }) => {
  const [selectedQR, setSelectedQR] = useState(null);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-bold mb-4">All Packages</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Package ID</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg._id} className="border-b hover:bg-gray-100">
              <td className="p-2">{pkg.packageId}</td>
              <td className="p-2">{pkg.deliveryStatus}</td>
              <td className="p-2">
                <Button onClick={() => setSelectedQR(pkg.encryptedData)}>
                  Show QR
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedQR && (
        <div className="mt-4 text-center">
          <p className="mb-2 font-medium">QR Code:</p>
          <QRCodeCanvas value={selectedQR} size={256} />
        </div>
      )}
    </div>
  );
};

export default PackagesTable;
