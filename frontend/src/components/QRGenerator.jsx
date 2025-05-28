import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "../hooks/useToast";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "../components/ui/button";

const QRGenerator = () => {
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
        const res = await api.get("/admin/users?role=deliveryAgent");
        const agents = res.data || res;
        setAgentsList(agents);
        if (agents.length === 0) {
          toast({
            title: "Info",
            description: "No delivery agents found. Please add agents first.",
            variant: "info",
          });
        }
      } catch {
        toast({ title: "Error", description: "Failed to load agents", variant: "error" });
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
      const data = res.data || res;
      setQrData(data.encryptedPackageData);
      toast({ title: "Success", description: "QR code generated.", variant: "success" });
      setForm({
        customerId: "",
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        assignedAgents: [],
      });
    } catch (err) {
      console.error("QR generation failed", err);
      toast({ title: "Error", description: "Package creation failed.", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const noAgents = agentsList.length === 0;

  return (
    <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-xl p-8 space-y-6 text-blue-900 mx-auto">
      <h2 className="text-2xl font-bold tracking-tight mb-4 text-blue-800 text-center">
        Generate QR Code for Package
      </h2>

      {noAgents && (
        <p className="text-center text-red-600 font-medium">
          No delivery agents available. Please add delivery agents first.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="customerId"
          placeholder="Customer ID"
          value={form.customerId}
          onChange={handleChange}
          required
          disabled={noAgents || loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          autoComplete="off"
        />

        <input
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          required
          disabled={noAgents || loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          autoComplete="off"
        />

        <input
          name="customerPhone"
          placeholder="Phone"
          value={form.customerPhone}
          onChange={handleChange}
          required
          disabled={noAgents || loading}
          type="tel"
          pattern="[0-9+()\-\\s]{7,}"
          title="Enter a valid phone number"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          autoComplete="off"
        />

        <input
          name="customerAddress"
          placeholder="Address"
          value={form.customerAddress}
          onChange={handleChange}
          required
          disabled={noAgents || loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          autoComplete="off"
        />

        <label
          htmlFor="assignedAgents"
          className="block mb-1 font-medium text-blue-800"
        >
          Select Authorized Delivery Agents
        </label>
        <select
          id="assignedAgents"
          multiple
          value={form.assignedAgents}
          onChange={handleAgentSelect}
          required
          disabled={noAgents || loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 h-28 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          aria-label="Select authorized delivery agents"
        >
          {agentsList.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name} ({agent.email})
            </option>
          ))}
        </select>
        <p className="text-xs text-blue-600 italic select-none mb-4">
          Hold Ctrl (Cmd) to select multiple agents.
        </p>

        <Button
          type="submit"
          disabled={loading || noAgents}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          {loading ? "Generating..." : "Generate QR"}
        </Button>
      </form>

      {qrData && (
        <div className="mt-8 text-center break-words">
          <p className="mb-4 text-lg font-semibold text-blue-800">QR Code</p>
          <QRCodeCanvas
            value={qrData}
            size={280}
            className="mx-auto rounded-lg shadow-md"
          />
          <p className="mt-4 px-4 py-2 bg-blue-50 rounded text-sm select-all break-all">
            {qrData}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
