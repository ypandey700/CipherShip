
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Package, QrCode, Shield } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to appropriate dashboard if already logged in
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "delivery") {
        navigate("/delivery");
      } else if (user.role === "customer") {
        navigate("/customer");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <main className="flex-1 relative overflow-hidden">
        <div className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32 relative z-10">
          <div className="max-w-2xl mx-auto text-center animate-slide-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Secure Package Delivery System
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              A role-based QR code delivery platform connecting admins, delivery agents, and customers with simplicity and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/login")} 
                size="lg" 
                className="btn-primary gap-2 group"
              >
                <span>Get Started</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Background elements - subtle branding */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl rounded-full transform rotate-12 -z-10" />
        <div className="absolute bottom-0 right-0 w-1/2 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl rounded-full transform -translate-y-1/4 -z-10" />
      </main>

      {/* Features section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-background rounded-xl p-6 shadow-sm flex flex-col items-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Admin</h3>
              <p className="text-muted-foreground">
                Create and manage secure QR codes for packages, ensuring each delivery is properly tracked.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-sm flex flex-col items-center text-center animate-fade-in [animation-delay:100ms]">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Delivery Agent</h3>
              <p className="text-muted-foreground">
                Scan package QR codes to verify authenticity and update delivery status in real-time.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-sm flex flex-col items-center text-center animate-fade-in [animation-delay:200ms]">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer</h3>
              <p className="text-muted-foreground">
                Track your packages by scanning QR codes to see essential delivery information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 QR Delivery System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
