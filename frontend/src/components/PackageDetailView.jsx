import React, { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../contexts/AuthContext";
import useDecryptPackage from "../hooks/useDecryptPackage";
import api from "../lib/api";

const PackageDetailView = ({ pkg, onStatusUpdated }) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const { decryptPackage, decryptedData, loading, error } = useDecryptPackage();
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (pkg) {
      decryptPackage({
        packageId: pkg._id,
        encryptedPayload: pkg.customerDataEncrypted,
      });
    }
  }, [pkg, decryptPackage]);

  const updateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await api.put(
        `/packages/${pkg._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Status updated to "${newStatus}"`, "success");
      onStatusUpdated(newStatus);
    } catch {
      showToast("Failed to update status.", "error");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!pkg)
    return <p className="text-center text-gray-500 mt-6">Select a package to view details.</p>;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mt-6 shadow-sm max-w-lg">
      <h3 className="text-lg font-semibold mb-2">Package Details (ID: {pkg._id})</h3>
      <p className="mb-4">
        <strong>Status:</strong>{" "}
        <span className="capitalize">{pkg.status.replace("_", " ")}</span>
      </p>

      {loading && <p className="text-blue-600 font-medium">Decrypting customer data...</p>}

      {error && <p className="text-red-600 font-medium mb-2">{error}</p>}

      {decryptedData && (
        <div className="bg-gray-50 p-4 rounded-md mb-4 overflow-auto max-h-48">
          <h4 className="font-semibold mb-2">Customer Information:</h4>
          <pre className="text-sm">{JSON.stringify(decryptedData, null, 2)}</pre>
        </div>
      )}

      <div className="flex gap-3">
        <StatusButton
          disabled={statusUpdating || pkg.status === "delivered"}
          onClick={() => updateStatus("delivered")}
          label="Mark Delivered"
          color="green"
        />
        <StatusButton
          disabled={statusUpdating || pkg.status === "failed"}
          onClick={() => updateStatus("failed")}
          label="Mark Failed"
          color="red"
        />
        <StatusButton
          disabled={statusUpdating || pkg.status === "in_transit"}
          onClick={() => updateStatus("in_transit")}
          label="Mark In Transit"
          color="blue"
        />
      </div>
    </div>
  );
};

const StatusButton = ({ disabled, onClick, label, color }) => {
  const baseClass =
    "px-4 py-2 rounded font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const colors = {
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${colors[color] || colors.blue}`}
    >
      {label}
    </button>
  );
};

export default PackageDetailView;
