import React, { useState } from "react";
import api from "../lib/api";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const AddUserSheet = ({ onUserCreated }) => {
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
      toast({
        title: "Success",
        description: "User created successfully.",
        variant: "success",
      });
      setForm({ name: "", email: "", password: "", role: "customer" });
      if (onUserCreated && typeof onUserCreated === "function") {
        onUserCreated(res.user);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create user.",
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
      className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-2xl mb-6"
    >
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Add New User
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            >
              <option value="customer">Customer</option>
              <option value="deliveryAgent">Delivery Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-400 font-semibold rounded-lg py-3 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            "Create User"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default AddUserSheet;