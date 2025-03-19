import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { withRoleProtection, useAuth } from "@/contexts/AuthContext";
import QRScanner from "@/components/QRScanner";
import { QrCode, LogOut, Upload, Camera } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const DeliveryAgentDashboard = () => {
  const { user, logout } = useAuth();
  const [fileUploadMode, setFileUploadMode] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, we would process the QR code image here
      // For now, we'll just show a success toast
      console.log("File uploaded:", file.name);
      toast({
        title: "QR Code Image Uploaded",
        description: "Processing QR code from image...",
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

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
                Delivery Agent
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
          <h1 className="text-2xl font-bold mb-1">Delivery Dashboard</h1>
          <p className="text-muted-foreground">
            Scan or upload package QR codes
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="neo p-6">
            <Tabs defaultValue="scan" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="scan">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>Scan QR</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="scan" className="mt-6">
                <QRScanner />
              </TabsContent>
              
              <TabsContent value="upload" className="mt-6">
                <div className="text-center space-y-6">
                  <div className="py-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-medium">Upload QR Code Image</h2>
                    <p className="text-muted-foreground mt-2">
                      Select a PNG image containing a QR code
                    </p>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/png,image/jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <Button 
                    onClick={triggerFileUpload} 
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose Image</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default withRoleProtection(DeliveryAgentDashboard, ["delivery"]);
