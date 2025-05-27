import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import UsersTable from '../components/UsersTable';
import AddUserSheet from '../components/AddUserSheet';
import QRGenerator from '../components/QRGenerator';
import OverviewStats from '../components/OverviewStats';
import AuditLogs from '../components/AuditLogs';
import PackagesTable from '../components/PackagesTable';
import api from '../lib/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  // Authorization check
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Access denied: Admin role required');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersRes, overviewRes, packagesRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin-overview'),
          api.get('/admin/packages'),
        ]);
        setUsers(Array.isArray(usersRes.data?.users) ? usersRes.data.users : []);
        setOverview(overviewRes.data || null);
        setPackages(Array.isArray(packagesRes.data?.packages) ? packagesRes.data.packages : []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load admin data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const auditRes = await api.get(`/admin/audit-logs?ts=${Date.now()}`);
      setAuditLogs(
        Array.isArray(auditRes.data)
          ? auditRes.data
          : Array.isArray(auditRes.data?.auditLogs) || Array.isArray(auditRes.data?.logs)
            ? auditRes.data.auditLogs || auditRes.data.logs
            : []
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load audit logs');
      console.error(error);
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'audit') {
      fetchAuditLogs();
    }
  }, [fetchAuditLogs]);

  const handleUserCreated = useCallback((newUser) => {
    setUsers((prev) => [...prev, newUser]);
    toast.success('User created successfully');
  }, []);

  const handleUserUpdated = useCallback((updatedUser) => {
    setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    toast.success('User updated successfully');
  }, []);

  const handleUserDeleted = useCallback((userId) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    toast.success('User deleted successfully');
  }, []);

  const handlePackageCreated = useCallback((newPackage) => {
    setPackages((prev) => [...prev, newPackage]);
    toast.success('Package created successfully');
  }, []);

  const handleUserClick = useCallback((userId) => {
    navigate(`/admin/users/${userId}`);
  }, [navigate]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        <span className="ml-4 text-lg font-semibold text-gray-300">Loading admin dashboard...</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6"
    >
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Admin Dashboard
      </h1>

      {/* Navigation Tabs */}
      <nav className="mb-6 flex justify-center space-x-2">
        {['users', 'packages', 'overview', 'audit'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-blue-400 hover:text-white'
            }`}
            onClick={() => handleTabChange(tab)}
            disabled={activeTab === tab}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl shadow-2xl p-6"
      >
        {activeTab === 'users' && (
          <div className="space-y-6">
            <AddUserSheet onUserCreated={handleUserCreated} />
            <UsersTable
              users={users}
              onUserUpdated={handleUserUpdated}
              onUserDeleted={handleUserDeleted}
              onUserClick={handleUserClick}
            />
          </div>
        )}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <QRGenerator onPackageCreated={handlePackageCreated} />
            <PackagesTable packages={packages} />
          </div>
        )}
        {activeTab === 'overview' && <OverviewStats overview={overview} />}
        {activeTab === 'audit' && (
          auditLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center py-10"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
              <span className="ml-4 text-lg font-semibold text-gray-300">Loading audit logs...</span>
            </motion.div>
          ) : (
            <AuditLogs logs={auditLogs} />
          )
        )}
      </motion.section>
    </motion.div>
  );
};

export default AdminDashboard;