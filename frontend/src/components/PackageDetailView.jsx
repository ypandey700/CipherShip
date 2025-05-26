import React, { useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../contexts/AuthContext';
import useDecryptPackage from '../hooks/useDecryptPackage';
import api from '../lib/api';

const PackageDetailView = ({ pkg, onStatusUpdated }) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const { decryptPackage, decryptedData, loading, error } = useDecryptPackage();

  const [statusUpdating, setStatusUpdating] = React.useState(false);

  useEffect(() => {
    if (pkg) {
      decryptPackage({
        packageId: pkg._id,
        encryptedPayload: pkg.customerDataEncrypted
      });
    }
  }, [pkg]);

  const updateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await api.put(`/packages/${pkg._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Status updated to ${newStatus}`, 'success');
      onStatusUpdated(newStatus);
    } catch {
      showToast('Failed to update status.', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!pkg) return <p>Select a package to view details</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: 15, marginTop: 20 }}>
      <h3>Package Details (ID: {pkg._id})</h3>
      <p><strong>Current Status:</strong> {pkg.status}</p>

      {loading && <p>Decrypting customer data...</p>}
      {decryptedData && (
        <div>
          <h4>Customer Information:</h4>
          <pre>{JSON.stringify(decryptedData, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: 15 }}>
        <button disabled={statusUpdating || pkg.status === 'delivered'} onClick={() => updateStatus('delivered')}>
          Mark Delivered
        </button>{' '}
        <button disabled={statusUpdating || pkg.status === 'failed'} onClick={() => updateStatus('failed')}>
          Mark Failed
        </button>{' '}
        <button disabled={statusUpdating || pkg.status === 'in_transit'} onClick={() => updateStatus('in_transit')}>
          Mark In Transit
        </button>
      </div>
    </div>
  );
};

export default PackageDetailView;
