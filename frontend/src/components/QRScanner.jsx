import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, X, RefreshCw, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const QRScanner = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const videoRef = useRef(null);
  const { user } = useAuth();
  const lastScanRef = useRef(0);

  const startScanning = async () => {
    setScanning(true);
    setScannedData(null);
    setAccessDenied(false);
    setTimeout(simulateScan, 2000);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const simulateScan = () => {
    const now = Date.now();
    if (now - lastScanRef.current < 2000) return;
    lastScanRef.current = now;

    const samplePackage = {
      id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
      content: "Electronics",
      destination: "123 Main St, New York, NY",
      recipient: "John Doe",
      timestamp: new Date().toISOString(),
      assignedTo: "2",
      accessibleTo: ["1", "2", "3"]
    };

    handleScanResult(samplePackage);
  };

  const hasAccess = (data) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    const accessList = data.accessibleTo || [];
    if (accessList.includes(user.id)) return true;
    if (user.role === "delivery" && data.assignedTo === user.id) return true;
    return false;
  };

  const handleScanResult = (data) => {
    setScanning(false);

    if (hasAccess(data)) {
      setScannedData(data);
      setAccessDenied(false);
      if (onScanComplete) {
        onScanComplete(data);
      }
      toast.success(`QR code scanned: ${data.id}`);
    } else {
      setAccessDenied(true);
      setScannedData(null);
      toast.error("Access denied. You don't have permission to view this package.");
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="w-full animate-fade-in">
      <Card className="neo overflow-hidden">
        <CardContent className="p-6">
          {!scanning && !scannedData && !accessDenied ? (
            <div className="text-center space-y-6">
              <div className="py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium">Scan Package QR Code</h2>
                <p className="text-muted-foreground mt-2">
                  Position the QR code within the scanner
                </p>
              </div>
              <Button onClick={startScanning} className="btn-primary w-full">
                Start Scanning
              </Button>
            </div>
          ) : scanning ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="qr-scanner-container aspect-square max-w-sm mx-auto bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-xl opacity-50"
                    autoPlay
                    playsInline
                    muted
                  ></video>
                  <div className="qr-scanner-overlay"></div>
                  <div className="qr-scanner-marker"></div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-background/80"
                  onClick={stopScanning}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground animate-pulse">
                Scanning for QR code...
              </p>
            </div>
          ) : accessDenied ? (
            <div className="space-y-6 text-center">
              <div className="py-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-medium text-red-600">Access Denied</h2>
                <p className="text-muted-foreground mt-2">
                  You don't have permission to view this package information.
                </p>
                <div className="flex justify-center mt-6">
                  <div className="bg-red-50 p-4 rounded-lg max-w-sm flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-left text-red-800">
                      This package can only be accessed by the admin, the assigned delivery agent, and the customer who ordered it.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setAccessDenied(false);
                  setScannedData(null);
                  setScanning(false);
                }}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Another QR Code</span>
              </Button>
            </div>
          ) : scannedData ? (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-medium">Package Details</h2>
              </div>

              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Package ID</span>
                  <span className="font-medium">{scannedData.id}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Content</span>
                  <span>{scannedData.content}</span>
                </div>

                {user?.role === "delivery" && (
                  <>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-muted-foreground">Destination</span>
                      <span>{scannedData.destination}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Recipient</span>
                      <span>{scannedData.recipient}</span>
                    </div>
                  </>
                )}

                {user?.role === "customer" && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      In Transit
                    </span>
                  </div>
                )}
              </div>

              {user?.role === "delivery" && (
                <div className="pt-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Mark as Delivered
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setScannedData(null);
                  setScanning(false);
                }}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Scan Another Package</span>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
