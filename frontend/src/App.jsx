import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { AuthProvider } from "./contexts/AuthContext";
import RoleBasedRoute from "./components/RoleBasedRoute";

import Index from "./pages/Index"; // ✅ Public landing page
import Login from "./pages/Login"; // ✅ Public login page

// ✅ Protected role-based dashboards
import AdminDashboard from "./pages/AdminDashboard";
import DeliveryAgentDashboard from "./pages/DeliveryAgentDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

import NotFound from "./pages/NotFound"; // ✅ Fallback

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* ✅ Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* 🔐 Protected routes */}
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/deliveryAgent"
                element={
                  <RoleBasedRoute allowedRoles={["deliveryAgent"]}>
                    <DeliveryAgentDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer"
                element={
                  <RoleBasedRoute allowedRoles={["customer"]}>
                    <CustomerDashboard />
                  </RoleBasedRoute>
                }
              />

              {/* 🚫 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
