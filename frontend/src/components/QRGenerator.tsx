
import React, { useState } from "react";
import { QRCode } from "react-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Copy, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Package {
  id: string;
  content: string;
  destination: string;
  recipient: string;
  assignedTo?: string; // ID of assigned delivery agent
  accessibleTo?: string[]; // IDs of users who can access this QR
}

const QRGenerator: React.FC = () => {
  const [packageData, setPackageData] = useState<Package>({
    id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
    content: "",
    destination: "",
    recipient: "",
    assignedTo: "",
    accessibleTo: [],
  });
  
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  
  // Sample delivery agents
  const deliveryAgents = [
    { id: "2", name: "Delivery Agent", email: "delivery@example.com" },
    { id: "5", name: "Jane Smith", email: "jane@example.com" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPackageData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!packageData.content || !packageData.destination || !packageData.recipient) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Add access control - always accessible to admin (id: 1)
    const accessList = ["1"]; // Admin
    
    // Add selected delivery agent if one was chosen
    if (selectedAgent) {
      accessList.push(selectedAgent);
      
      // Update packageData with assigned delivery agent
      setPackageData(prev => ({
        ...prev,
        assignedTo: selectedAgent,
        accessibleTo: accessList,
      }));
    }
    
    // Add timestamp for unique QR codes
    const qrValue = JSON.stringify({
      ...packageData,
      assignedTo: selectedAgent,
      accessibleTo: accessList,
      timestamp: new Date().toISOString(),
    });
    
    setStep(2);
    toast.success("QR code generated successfully");
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${packageData.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR code downloaded");
    }
  };

  const copyToClipboard = () => {
    const qrData = JSON.stringify(packageData);
    navigator.clipboard.writeText(qrData);
    toast.success("Package data copied to clipboard");
  };

  const startOver = () => {
    setPackageData({
      id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
      content: "",
      destination: "",
      recipient: "",
      assignedTo: "",
      accessibleTo: [],
    });
    setSelectedAgent("");
    setQrDataUrl(null);
    setStep(1);
  };

  return (
    <div className="w-full animate-fade-in">
      {step === 1 ? (
        <Card className="neo overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-6">Generate Package QR Code</h2>
            <form onSubmit={handleGenerateQR} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Package ID</Label>
                <Input
                  id="id"
                  name="id"
                  value={packageData.id}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Package Content</Label>
                <Input
                  id="content"
                  name="content"
                  value={packageData.content}
                  onChange={handleInputChange}
                  placeholder="Electronics, Clothing, etc."
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Address</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={packageData.destination}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, Country"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Name</Label>
                <Input
                  id="recipient"
                  name="recipient"
                  value={packageData.recipient}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedAgent">Assign to Delivery Agent</Label>
                <Select onValueChange={setSelectedAgent} value={selectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a delivery agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryAgents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This QR code will only be accessible to you (Admin), the selected delivery agent, and the customer.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 btn-primary gap-2 group"
              >
                <span>Generate QR Code</span>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="neo overflow-hidden">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-medium mb-2">QR Code Generated</h2>
            <p className="text-muted-foreground mb-2">Package ID: {packageData.id}</p>
            {selectedAgent && (
              <p className="text-xs text-muted-foreground mb-4">
                Assigned to: {deliveryAgents.find(a => a.id === selectedAgent)?.name}
              </p>
            )}
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <QRCode
                  id="qr-canvas"
                  value={JSON.stringify({
                    ...packageData,
                    assignedTo: selectedAgent,
                    accessibleTo: packageData.accessibleTo
                  })}
                  size={220}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                  level="H"
                  className="rounded-md"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
              <Button onClick={downloadQRCode} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                <span>Copy Data</span>
              </Button>
              <Button onClick={startOver} variant="secondary" className="gap-2">
                <span>Create Another</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRGenerator;
