import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const PackagesTable = ({ packages }) => {
  const [selectedQR, setSelectedQR] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl shadow-2xl p-6"
    >
      <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        All Packages
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-gray-100">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-left text-sm font-semibold uppercase tracking-wide">
              <th className="py-4 px-6">Package ID</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 px-6 text-center text-gray-400">
                  No packages found.
                </td>
              </tr>
            ) : (
              packages.map((pkg, index) => (
                <tr
                  key={pkg._id}
                  className={`border-t border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                  }`}
                >
                  <td className="py-4 px-6 text-sm">{pkg.packageId}</td>
                  <td className="py-4 px-6 text-sm capitalize">{pkg.deliveryStatus}</td>
                  <td className="py-4 px-6">
                    <Button
                      onClick={() => setSelectedQR(pkg.encryptedData)}
                      className="bg-blue-500 text-white hover:bg-blue-400 font-semibold rounded-lg py-2 px-4 transition-all duration-200"
                      aria-label={Show QR code for package ${pkg.packageId}}
                    >
                      Show QR
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center bg-gray-700 p-6 rounded-lg shadow-md"
        >
          <p className="mb-4 text-lg font-medium text-gray-100">Package QR Code</p>
          <div className="inline-block bg-white p-2 rounded-lg">
            <QRCodeCanvas value={selectedQR} size={200} />
          </div>
          <p className="text-xs text-gray-400 mt-4 break-all">{selectedQR}</p>
          <Button
            onClick={() => setSelectedQR(null)}
            className="mt-4 bg-gray-600 text-white hover:bg-gray-500 font-semibold rounded-lg py-2 px-4 transition-all duration-200"
            aria-label="Close QR code"
          >
            Close
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PackagesTable;