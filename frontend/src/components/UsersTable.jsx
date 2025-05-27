import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/useToast";
import EditUserForm from "./EditUserForm";

const UsersTable = ({ users, onUserUpdated, onUserDeleted, onUserClick }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(/admin/users/${id});
      onUserDeleted(id);
      toast({ title: "Success", description: "User removed successfully", variant: "success" });
    } catch {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
        <span className="ml-4 text-lg font-semibold text-gray-300">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <table className="min-w-full text-gray-100">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-left text-sm font-semibold uppercase tracking-wide">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr
                key={u._id}
                className={`border-t border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                <td className="py-4 px-6 text-sm">{u._id}</td>
                <td className="py-4 px-6 text-sm">{u.name}</td>
                <td className="py-4 px-6 text-sm">{u.email}</td>
                <td className="py-4 px-6 text-sm capitalize">{u.role}</td>
                <td className="py-4 px-6 flex gap-3">
                  <Link
                    to={/admin/users/${u._id}}
                    onClick={() => onUserClick(u._id)}
                    className="text-blue-400 hover:text-blue-300 font-medium underline transition-colors duration-200"
                    aria-label={View profile of ${u.name}}
                  >
                    View
                  </Link>
                  <Button
                    variant="outline"
                    className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
                    onClick={() => setEditingUser(u)}
                    aria-label={Edit user ${u.name}}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-500 text-white transition-all duration-200"
                    onClick={() => handleDelete(u._id)}
                    aria-label={Delete user ${u.name}}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-lg w-full">
            <EditUserForm
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onUserUpdated={(updatedUser) => {
                onUserUpdated(updatedUser);
                setEditingUser(null);
                toast({ title: "Success", description: "User updated successfully", variant: "success" });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;