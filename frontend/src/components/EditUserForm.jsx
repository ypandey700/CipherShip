import React, { useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/useToast";

const EditUserForm = ({ user, onClose, onUserUpdated }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.password.trim() !== "") {
        payload.password = form.password;
      }

      const res = await api.put(`/admin/users/${user._id}`, payload);
      onUserUpdated(res);

      toast({ title: "Success", description: "User updated successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update user." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white/90 border border-gray-200 backdrop-blur-xl p-8 rounded-xl shadow-lg max-w-md w-full space-y-4"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400 hover:text-gray-900 transition"
        type="button"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold text-blue-900 mb-2">Edit User</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80"
      >
        <option value="customer">Customer</option>
        <option value="deliveryAgent">Delivery Agent</option>
        <option value="admin">Admin</option>
      </select>

      <input
        type="password"
        name="password"
        placeholder="Leave blank to keep current password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80"
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {loading ? "Updating..." : "Update User"}
      </Button>
    </form>
  );
};

export default EditUserForm;
