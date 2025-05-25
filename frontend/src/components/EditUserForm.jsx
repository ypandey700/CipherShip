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

      // Log response to verify structure
      console.log("Update response:", res);

      // Assume res is the updated user object directly
      onUserUpdated(res);

      toast({ title: "Success", description: "User updated successfully." });
    } catch (err) {
      console.error("Update user error:", err.message || err);
      toast({ title: "Error", description: "Failed to update user." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-500 hover:text-black"
        type="button"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4">Edit User</h2>

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

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
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
        className="w-full mb-4 p-2 border rounded"
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating..." : "Update User"}
      </Button>
    </form>
  );
};

export default EditUserForm;
