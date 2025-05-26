import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import useDecryptPackage from "../hooks/useDecryptPackage";

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const { decryptPackage, decryptedData, loading, error } = useDecryptPackage();

  const onScanSuccess = async (decodedText) => {
    if (loading) return; // Avoid multiple calls while processing
    setScannedData(null);

    let payload;
    try {
      payload = JSON.parse(decodedText);
    } catch {
      // Handle invalid QR code format error inside hook? 
      // Since hook only handles API errors, handle here instead:
      alert("Invalid QR code format");
      return;
    }

    if (!payload.packageId || !payload.encryptedPayload) {
      alert("Invalid QR code data");
      return;
    }

    setScannedData(payload);
    await decryptPackage(payload);
  };

  const onScanFailure = (error) => {
    // Optional: log scan failures or ignore
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div>
      <h2>Scan Package QR Code</h2>
      <div id="qr-reader" style={{ width: "300px" }}></div>
      {loading && <p>Scanning and decrypting...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {decryptedData && (
        <div>
          <h3>Decrypted Customer Data</h3>
          <pre>{JSON.stringify(decryptedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
