
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user roles
export type UserRole = "admin" | "delivery" | "customer" | null;

// Define the shape of our user object
interface User {
  id: string;
  name: string;
  role: UserRole;
}

// Define what our auth context will expose
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

// Sample users for our frontend-only demo
const SAMPLE_USERS = [
  { id: "1", email: "admin@example.com", password: "admin123", name: "Admin User", role: "admin" as UserRole },
  { id: "2", email: "delivery@example.com", password: "delivery123", name: "Delivery Agent", role: "delivery" as UserRole },
  { id: "3", email: "customer@example.com", password: "customer123", name: "Customer", role: "customer" as UserRole },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in (from localStorage)
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

  // Login function - simulates authentication
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(r => setTimeout(r, 800));
    
    const foundUser = SAMPLE_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Create user object (without password)
      const userObj = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
      };
      
      // Save to state and localStorage
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
      
      // Redirect based on role
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

  // Logout function
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

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Higher-order component for role-based protection
export const withRoleProtection = (
  Component: React.ComponentType,
  allowedRoles: UserRole[]
) => {
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
        // Redirect to appropriate page based on role
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

    if (!isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    if (user && !allowedRoles.includes(user.role)) {
      return null; // Will redirect in useEffect
    }

    return <Component />;
  };
};
