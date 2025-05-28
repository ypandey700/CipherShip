import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/useToast";
import EditUserForm from "./EditUserForm";
import { Link } from "react-router-dom";

const UsersTable = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const users = await api.get("/admin/users");
      setUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast({ title: "Deleted", description: "User removed successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete user" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="py-10 text-center text-blue-700 font-medium text-lg animate-pulse">
        Loading users...
      </div>
    );

  return (
    <div className="overflow-x-auto mt-4 rounded-2xl shadow-xl border border-blue-200 bg-white/80 backdrop-blur-md">
      <table className="min-w-full text-sm text-blue-900">
        <thead className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 text-blue-800 border-b border-blue-200">
          <tr>
            <th className="text-left py-4 px-6 font-semibold tracking-wide">ID</th>
            <th className="text-left py-4 px-6 font-semibold tracking-wide">Name</th>
            <th className="text-left py-4 px-6 font-semibold tracking-wide">Email</th>
            <th className="text-left py-4 px-6 font-semibold tracking-wide">Role</th>
            <th className="text-left py-4 px-6 font-semibold tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr
              key={u._id}
              className={`border-t transition-all duration-300 ${
                index % 2 === 0 ? "bg-white/60" : "bg-blue-50/40"
              } hover:bg-blue-100/40`}
            >
              <td className="py-3 px-6 font-mono text-xs text-blue-700">{u._id}</td>
              <td className="py-3 px-6 font-medium">{u.name}</td>
              <td className="py-3 px-6">{u.email}</td>
              <td className="py-3 px-6 capitalize text-indigo-700 font-semibold">
                {u.role}
              </td>
              <td className="py-3 px-6 flex flex-wrap items-center gap-3">
                <Link
                  to={`/admin/users/${u._id}`}
                  className="text-blue-600 hover:text-blue-800 underline font-medium transition"
                >
                  View
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-500 text-blue-700 hover:bg-blue-100"
                  onClick={() => setEditingUser(u)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <EditUserForm
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onUserUpdated={(updatedUser) => {
              setUsers((prev) =>
                prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
              );
              setEditingUser(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UsersTable;
