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
        onUserAdded(res.user);
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
      className="w-full max-w-lg bg-white/80 backdrop-blur-lg border border-blue-200 shadow-xl rounded-xl px-8 py-6 space-y-5 text-blue-900"
    >
      <h2 className="text-2xl font-bold tracking-tight text-blue-800 mb-4">
        Add New User
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
      >
        <option value="customer">Customer</option>
        <option value="deliveryAgent">Delivery Agent</option>
        <option value="admin">Admin</option>
      </select>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
      >
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
};

export default AddUserSheet;
