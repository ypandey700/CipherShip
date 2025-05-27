import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "../hooks/useToast";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const QRGenerator = ({ onPackageCreated }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    assignedAgents: [],
  });
  const [agentsList, setAgentsList] = useState([]);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agents = await api.get("/admin/users?role=deliveryAgent");
        setAgentsList(Array.isArray(agents) ? agents : []);
        if (agents.length === 0) {
          toast({
            title: "Info",
            description: "No delivery agents found. Please add agents first.",
            variant: "default",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load agents",
          variant: "destructive",
        });
      }
    };
    fetchAgents();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgentSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, assignedAgents: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQrData(null);

    try {
      const res = await api.post("/admin/packages", form);
      setQrData(res.encryptedPackageData);
      toast({
        title: "Success",
        description: "QR code generated successfully.",
        variant: "success",
      });
      setForm({
        customerId: "",
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        assignedAgents: [],
      });
      if (onPackageCreated && typeof onPackageCreated === "function") {
        onPackageCreated(res);
      }
    } catch (err) {
      console.error("QR generation failed", err);
      toast({
        title: "Error",
        description: err.message || "Package creation failed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl mb-6"
    >
      <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Generate QR Code for Package
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="customerId"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Customer ID
          </label>
          <input
            name="customerId"
            id="customerId"
            placeholder="Enter customer ID"
            value={form.customerId}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            aria-required="true"
          />
        </div>

        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Customer Name
          </label>
          <input
            name="customerName"
            id="customerName"
            placeholder="Enter customer name"
            value={form.customerName}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            aria-required="true"
          />
        </div>

        <div>
          <label
            htmlFor="customerPhone"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Phone
          </label>
          <input
            name="customerPhone"
            id="customerPhone"
            placeholder="Enter phone number"
            value={form.customerPhone}
            onChange={handleChange}
            required
            type="tel"
            pattern="[0-9+()\\-\\s]{7,}"
            title="Enter a valid phone number"
            className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            aria-required="true"
          />
        </div>

        <div>
          <label
            htmlFor="customerAddress"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Address
          </label>
          <input
            name="customerAddress"
            id="customerAddress"
            placeholder="Enter address"
            value={form.customerAddress}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            aria-required="true"
          />
        </div>

        <div>
          <label
            htmlFor="assignedAgents"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Delivery Agents
          </label>
          <select
            multiple
            name="assignedAgents"
            id="assignedAgents"
            value={form.assignedAgents}
            onChange={handleAgentSelect}
            required
            className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 h-24"
            aria-label="Select authorized delivery agents"
          >
            {(agentsList || []).map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
          {agentsList.length === 0 && (
            <p className="text-sm text-red-400 mt-1">
              No delivery agents available. Please add agents first.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || agentsList.length === 0}
          className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-400 font-semibold rounded-lg py-3 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            "Generate QR"
          )}
        </Button>
      </form>

      {qrData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center bg-gray-700 p-6 rounded-lg shadow-md"
        >
          <p className="mb-4 text-lg font-medium text-gray-100">QR Code</p>
          <div className="inline-block bg-white p-2 rounded-lg">
            <QRCodeCanvas value={qrData} size={200} />
          </div>
          <p className="text-xs text-gray-400 mt-4 break-all">{qrData}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QRGenerator;