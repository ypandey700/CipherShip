
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withRoleProtection, useAuth } from "@/contexts/AuthContext";
import QRGenerator from "@/components/QRGenerator";
import { 
  QrCode, 
  LogOut, 
  UserCog, 
  User, 
  UserCheck, 
  Trash2,
  UserPlus
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "delivery" | "customer";
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
    { id: "2", name: "Delivery Agent", email: "delivery@example.com", role: "delivery" },
    { id: "3", name: "Customer", email: "customer@example.com", role: "customer" },
    { id: "4", name: "John Doe", email: "john@example.com", role: "customer" },
    { id: "5", name: "Jane Smith", email: "jane@example.com", role: "delivery" },
  ]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer" as "admin" | "delivery" | "customer",
  });

  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const newId = String(users.length + 1);
    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({ name: "", email: "", role: "customer" });
    toast.success("User added successfully");
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  return (
    <div className="min-h-screen bg-secondary/50">
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
                Admin
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Manage System</h1>
            <p className="text-muted-foreground">
              Generate QR codes and manage users
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="mt-4 md:mt-0 btn-primary gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New User</SheetTitle>
                <SheetDescription>
                  Add a new user or delivery agent to the system.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter full name" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="email@example.com" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role}
                    onValueChange={(value: "admin" | "delivery" | "customer") => 
                      setNewUser({...newUser, role: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="delivery">Delivery Agent</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <Button onClick={addUser}>Add User</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs defaultValue="generate" className="animate-fade-in">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="mt-0">
            <div className="max-w-md mx-auto">
              <QRGenerator />
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="mt-0">
            <Card className="neo p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Users</h3>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-2 rounded-full">
                                {user.role === "admin" ? (
                                  <UserCog className="h-4 w-4 text-primary" />
                                ) : user.role === "delivery" ? (
                                  <UserCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                  <User className="h-4 w-4 text-amber-600" />
                                )}
                              </div>
                              {user.name}
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block 
                              ${user.role === "admin" 
                                ? "bg-primary/10 text-primary" 
                                : user.role === "delivery" 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-amber-100 text-amber-600"
                              }`}>
                              {user.role === "admin" 
                                ? "Admin" 
                                : user.role === "delivery" 
                                  ? "Delivery Agent" 
                                  : "Customer"
                              }
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default withRoleProtection(AdminDashboard, ["admin"]);
