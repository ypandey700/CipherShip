import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import useDecryptPackage from "../hooks/useDecryptPackage";
import { useToast } from "../hooks/useToast";

const QRScanner = () => {
  const scannerRef = useRef(null);
  const { decryptPackage, decryptedData, loading, error, clear } = useDecryptPackage();
  const { showToast } = useToast();
  const [scannedData, setScannedData] = useState(null);

  const onScanSuccess = async (decodedText) => {
    if (loading) return; // prevent multiple calls while processing

    // Clear previous data before new scan
    setScannedData(null);
    clear(); // Clear decryptedData and error inside hook if supported

    let payload;
    try {
      payload = JSON.parse(decodedText);
    } catch {
      showToast("Invalid QR code format", "error");
      return;
    }

    if (!payload.packageId || !payload.encryptedPayload) {
      showToast("Invalid QR code data", "error");
      return;
    }

    setScannedData(payload);
    await decryptPackage(payload);

    // Optional: stop scanner after success to prevent repeat scans
    if (scannerRef.current) {
      scannerRef.current.clear().catch((err) => {
        console.error("Failed to clear scanner:", err);
      });
    }
  };

  const onScanFailure = (error) => {
    // You can log or ignore scan failure (no QR detected)
    // console.debug("QR scan failure", error);
  };

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
    }

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => {
          console.error("Failed to clear scanner on unmount:", err);
        });
      }
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
