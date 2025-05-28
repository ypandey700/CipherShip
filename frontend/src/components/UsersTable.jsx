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
  const [editingUser, setEditingUser] = useState(null); // Moved this inside component

  const fetchUsers = async () => {
    try {
      const users = await api.get("/admin/users");
      console.log("Users:", users);
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
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      toast({ title: "Deleted", description: "User removed successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete user" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="py-2 px-4">{u._id}</td>
              <td className="py-2 px-4">{u.name}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4 capitalize">{u.role}</td>
              <td className="py-2 px-4 flex gap-2">
                <Link
                  to={`/admin/users/${u._id}`}
                  className="btn-link text-blue-600 underline"
                >
                  View Profile
                </Link>
                <Button variant="outline" onClick={() => setEditingUser(u)}>
                  Edit
                </Button>
                <Button
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
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
