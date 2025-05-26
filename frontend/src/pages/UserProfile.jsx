import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // QR code state
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Load user info
        const res = await api.get(`/admin/users/${id}`);
        const userData = res.data?.user || res.user;
        setUser(userData);

        // Load that user's packages
        const pkgRes = await api.get(`/admin/users/${id}/packages`);
        const pkgData = pkgRes.data?.packages || pkgRes.packages || [];
        setPackages(pkgData);
      } catch (error) {
        toast.error('Failed to load user profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [id]);

  if (loading) return <div className="p-4">Loading user profile...</div>;
  if (!user) return <div className="p-4">User not found</div>;

  return (
    <div className="p-4">
      <button
        className="mb-4 text-blue-500 underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-2">User Profile</h2>
      <div className="bg-white rounded shadow p-4 mb-6 space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        {user.createdAt && <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>}
        {user.updatedAt && <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>}
        <p><strong>User ID:</strong> {user._id}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {user.role === 'deliveryAgent' ? 'Assigned Packages' : 'Sent Packages'}
      </h3>

      {packages.length === 0 ? (
        <p>No packages found for this user.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Package ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{pkg._id}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm font-medium ${
                        pkg.deliveryStatus === 'delivered'
                          ? 'bg-green-500'
                          : pkg.deliveryStatus === 'inTransit'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}
                    >
                      {pkg.deliveryStatus.charAt(0).toUpperCase() + pkg.deliveryStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-sm text-blue-600 underline"
                      onClick={() => {
                        if (!pkg.encryptedData) {
                          toast.error('No QR data available for this package.');
                          return;
                        }
                        setSelectedQR(pkg.encryptedData);
                      }}
                    >
                      View QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* QR code display */}
          {selectedQR && (
            <div className="mt-4 text-center">
              <p className="mb-2 font-medium">QR Code:</p>
              <QRCodeCanvas value={selectedQR} size={256} />
              <button
                onClick={() => setSelectedQR(null)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close QR
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
