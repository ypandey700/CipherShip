// frontend/src/components/AddUserSheet.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/button";

const AddUserSheet = ({ onUserAdded }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/admin/users", form);

      toast({ title: "Success", description: "User created successfully." });

      setForm({ name: "", email: "", password: "", role: "customer" });

      if (onUserAdded && typeof onUserAdded === "function") {
        onUserAdded(res.user); // Use res.user, not res.data
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create user.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4">Add New User</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="customer">Customer</option>
        <option value="deliveryAgent">Delivery Agent</option> {/* fixed role */}
        <option value="admin">Admin</option> {/* optional, add if needed */}
      </select>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
};

export default AddUserSheet;
