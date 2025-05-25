import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import api from "../lib/api";

// --- AuthContext & Provider ---
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Optionally: set axios default header with token if stored in localStorage/sessionStorage
  // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Assumes backend returns { user: {...} } if logged in
        const res = await api.get("/auth/me");
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res && res.user && res.token) {
        localStorage.setItem("token", res.token);
        setUser(res.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: "Invalid login response" };
      }
    } catch (err) {
      return {
        success: false,
        error:
          err.message ||
          "Login failed. Please check your credentials.",
      };
    }
  };  

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore errors on logout
    }
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// --- withRoleProtection HOC ---
export function withRoleProtection(WrappedComponent, allowedRoles = []) {
  return (props) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
}

// --- Toast Hook & Component ---
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  const ToastComponent = () =>
    toast ? (
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "10px 20px",
          backgroundColor:
            toast.type === "error"
              ? "crimson"
              : toast.type === "success"
              ? "green"
              : "gray",
          color: "white",
          borderRadius: 4,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 1000,
          userSelect: "none",
        }}
      >
        {toast.message}
      </div>
    ) : null;

  return { showToast, ToastComponent };
};
