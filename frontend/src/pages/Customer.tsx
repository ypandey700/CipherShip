import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { withRoleProtection, useAuth } from "@/contexts/AuthContext";
import QRScanner from "@/components/QRScanner";
import { QrCode, LogOut } from "lucide-react";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-secondary/50">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <QrCode className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">QR Delivery</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium hidden md:inline-block">
                {user?.name}
              </span>
              <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                Customer
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Customer Dashboard</h1>
          <p className="text-muted-foreground">
            Scan QR codes for your deliveries
          </p>
        </div>

        {/* QR Scanner */}
        <div className="animate-fade-in">
          <Card className="p-6 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium mb-2">Scan QR Code</h2>
              <p className="text-sm text-muted-foreground">
                Scan the QR code on your package to confirm delivery
              </p>
            </div>
            <QRScanner />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default withRoleProtection(CustomerDashboard, ["customer"]);