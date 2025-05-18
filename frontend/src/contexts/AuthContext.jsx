import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Create the context with default values
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

// Sample users for our frontend-only demo
const SAMPLE_USERS = [
  { id: "1", email: "admin@example.com", password: "admin123", name: "Admin User", role: "admin" },
  { id: "2", email: "delivery@example.com", password: "delivery123", name: "Delivery Agent", role: "delivery" },
  { id: "3", email: "customer@example.com", password: "customer123", name: "Customer", role: "customer" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const foundUser = SAMPLE_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userObj = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
      };

      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      if (foundUser.role === "admin") {
        navigate("/admin");
      } else if (foundUser.role === "delivery") {
        navigate("/delivery");
      } else if (foundUser.role === "customer") {
        navigate("/customer");
      }

      toast.success(`Welcome, ${foundUser.name}!`);
      setIsLoading(false);
      return true;
    } else {
      toast.error("Invalid email or password");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const withRoleProtection = (Component, allowedRoles) => {
  return () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate("/login");
        return;
      }

      if (!isLoading && user && !allowedRoles.includes(user.role)) {
        toast.error("You don't have permission to access this page");

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "delivery") {
          navigate("/delivery");
        } else if (user.role === "customer") {
          navigate("/customer");
        } else {
          navigate("/login");
        }
      }
    }, [isLoading, isAuthenticated, user, navigate]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse-slow">Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
      return null;
    }

    return <Component />;
  };
};
