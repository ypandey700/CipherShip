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
        const agents = await api.get("/admin/users?role=deliveryAgent");
        setAgentsList(agents);
        if (agents.length === 0) {
          toast({
            title: "Info",
            description: "No delivery agents found. Please add agents first.",
          });
        }
      } catch {
        toast({ title: "Error", description: "Failed to load agents" });
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
      setQrData(res.data.encryptedPackageData); // backend sends this
      toast({ title: "Success", description: "QR code generated." });
      setForm({
        customerId: "",
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        assignedAgents: []
      });
    } catch {
      toast({ title: "Error", description: "Package creation failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Generate QR Code for Package</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="customerId"
          placeholder="Customer ID"
          value={form.customerId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="customerPhone"
          placeholder="Phone"
          value={form.customerPhone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          type="tel"
          pattern="[0-9+()\\-\\s]{7,}"
          title="Enter a valid phone number"
        />

        <input
          name="customerAddress"
          placeholder="Address"
          value={form.customerAddress}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          multiple
          value={form.assignedAgents}
          onChange={handleAgentSelect}
          required
          className="w-full p-2 border rounded h-24"
          aria-label="Select authorized delivery agents"
        >
          {(agentsList || []).map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name} ({agent.email})
            </option>
          ))}
        </select>

        <Button
          type="submit"
          disabled={loading || (agentsList?.length || 0) === 0}
          className="w-full"
        >
          {loading ? "Generating..." : "Generate QR"}
        </Button>
      </form>

      {qrData && (
        <div className="mt-6 text-center">
          <p className="mb-2 font-medium">QR Code:</p>
          <QRCodeCanvas value={qrData} size={256} />
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
