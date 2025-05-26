// src/hooks/useDecryptPackage.js
import { useState } from 'react';
import api from '../lib/api';
import { useToast } from './useToast';
import { useAuth } from '../contexts/AuthContext';

const useDecryptPackage = () => {
  const [decryptedData, setDecryptedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();
  const { showToast } = useToast();

  const decryptPackage = async ({ packageId, encryptedPayload }) => {
    console.log('Calling decryptPackage with:', { packageId, encryptedPayload });
  
    setLoading(true);
    setError(null);
    setDecryptedData(null);
    try {
      const res = await api.post(
        '/packages/decrypt',
        { packageId, encryptedPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Decryption response:', res.data);
      setDecryptedData(res.data.decryptedData);
    } catch (err) {
      console.error('Decryption error:', err);
      if (err.response?.status === 403) {
        const msg = 'Unauthorized to view package.';
        setError(msg);
        showToast(msg, 'error');
      } else {
        const msg = 'Failed to decrypt package data.';
        setError(msg);
        showToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { decryptPackage, decryptedData, loading, error };
};

export default useDecryptPackage;
