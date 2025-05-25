import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const token = localStorage.getItem('token');

  const onScanSuccess = async (decodedText) => {
    // Example: QR code payload might be JSON string containing packageId & encryptedPayload
    try {
      setScanning(true);
      setError('');
      setDecryptedData(null);

      const payload = JSON.parse(decodedText);
      if (!payload.packageId || !payload.encryptedPayload) {
        setError('Invalid QR code data');
        setScanning(false);
        return;
      }

      setScannedData(payload);

      // Send to backend for decryption & authorization
      const res = await api.post('/packages/decrypt', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDecryptedData(res.data.decryptedData);
    } catch (err) {
      if (err.response?.status === 403) setError('Unauthorized to view package');
      else setError('Decryption failed or invalid QR code');
    } finally {
      setScanning(false);
    }
  };

  const onScanFailure = (error) => {
    // You can log scan failures here if needed
  };

  React.useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader", 
      { fps: 10, qrbox: 250 }
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    return () => {
      html5QrcodeScanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div>
      <h2>Scan Package QR Code</h2>
      <div id="qr-reader" style={{ width: '300px' }}></div>
      {scanning && <p>Scanning and decrypting...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
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
