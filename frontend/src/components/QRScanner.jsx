import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../lib/api";

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Get token once on mount (or you can get from context)
  const token = localStorage.getItem("token");

  const onScanSuccess = async (decodedText) => {
    if (processing) return; // Avoid multiple simultaneous calls
    setProcessing(true);
    setError("");
    setDecryptedData(null);
    setScannedData(null);

    let payload;
    try {
      payload = JSON.parse(decodedText);
    } catch {
      setError("Invalid QR code format");
      setProcessing(false);
      return;
    }

    if (!payload.packageId || !payload.encryptedPayload) {
      setError("Invalid QR code data");
      setProcessing(false);
      return;
    }

    setScannedData(payload);

    try {
      const res = await api.post(
        "/packages/decrypt",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDecryptedData(res.data.decryptedData);
    } catch (err) {
      if (err.response?.status === 403) setError("Unauthorized to view package");
      else setError("Decryption failed or invalid QR code");
    } finally {
      setProcessing(false);
    }
  };

  const onScanFailure = (error) => {
    // Optionally log scan failures here or ignore
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
      {processing && <p>Scanning and decrypting...</p>}
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
