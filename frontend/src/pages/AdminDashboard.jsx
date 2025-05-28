import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersRes, overviewRes, packagesRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/overview'),
          api.get('/admin/packages'),
        ]);
        setUsers(usersRes.users || []);
        setOverview(overviewRes || null);
        setPackages(packagesRes.packages || []);
      } catch (error) {
        toast.error('Failed to load admin data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const auditRes = await api.get(`/admin/audit-logs?ts=${Date.now()}`);
      setAuditLogs(
        Array.isArray(auditRes) ? auditRes : auditRes.auditLogs || auditRes.logs || []
      );
    } catch (error) {
      toast.error('Failed to load audit logs');
      console.error(error);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'audit') fetchAuditLogs();
  };

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    toast.success('User created successfully');
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    toast.success('User updated successfully');
  };

  const handleUserDeleted = (userId) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    toast.success('User deleted successfully');
  };

  const handlePackageCreated = (newPackage) => {
    setPackages((prev) => [...prev, newPackage]);
    toast.success('Package created successfully');
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100 text-blue-900 text-lg font-medium">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-emerald-50 px-6 py-10">
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-blue-900 tracking-tight">Admin Dashboard</h1>
        </header>

        {/* Tab Navigation */}
        <nav className="flex gap-4 border-b border-slate-300 pb-1">
          {['users', 'packages', 'overview', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab
                  ? 'text-blue-800 bg-white border border-blue-300 shadow-sm'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute left-1/2 -bottom-1 w-1/2 h-1 bg-blue-500 rounded-full -translate-x-1/2"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <section className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 space-y-10">
          {activeTab === 'users' && (
            <>
              <SectionHeader icon="👥" title="User Management" />
              <SectionCard background="bg-gradient-to-br from-blue-50 to-sky-100">
                <AddUserSheet onUserCreated={handleUserCreated} />
              </SectionCard>
              <UsersTable
                users={users}
                onUserUpdated={handleUserUpdated}
                onUserDeleted={handleUserDeleted}
                onUserClick={handleUserClick}
              />
            </>
          )}

          {activeTab === 'packages' && (
            <>
              <SectionHeader icon="📦" title="Package Control" />
              <SectionCard background="bg-gradient-to-br from-emerald-50 to-teal-100">
                <QRGenerator onPackageCreated={handlePackageCreated} />
              </SectionCard>
              <PackagesTable packages={packages} />
            </>
          )}

          {activeTab === 'overview' && (
            <>
              <SectionHeader icon="📊" title="System Overview" />
              <SectionCard background="bg-gradient-to-br from-indigo-50 to-blue-100">
                <OverviewStats overview={overview} />
              </SectionCard>
            </>
          )}

          {activeTab === 'audit' && (
            <>
              <SectionHeader icon="📜" title="Audit Logs" />
              <SectionCard background="bg-gradient-to-br from-slate-50 to-gray-100">
                {auditLoading ? (
                  <p className="text-blue-700 animate-pulse text-base font-medium">Loading logs...</p>
                ) : (
                  <AuditLogs logs={auditLogs} />
                )}
              </SectionCard>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

// Reusable Section Header
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 text-blue-900">
    <span className="text-2xl">{icon}</span>
    <h2 className="text-2xl font-semibold">{title}</h2>
  </div>
);

// Reusable Section Card Wrapper
const SectionCard = ({ children, background = 'bg-white' }) => (
  <div className={`${background} border border-slate-200 rounded-xl p-6 shadow-inner`}>
    {children}
  </div>
);

export default AdminDashboard;
