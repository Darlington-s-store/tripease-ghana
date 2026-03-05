import { Users, Search, MoreVertical, Shield, Ban, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/layout/DashboardLayout";

const users = [
  { id: 1, name: "Kofi Mensah", email: "kofi@example.com", role: "Traveller", joined: "Jan 15, 2025", status: "active", bookings: 12 },
  { id: 2, name: "Akua Sarfo", email: "akua@example.com", role: "Provider", joined: "Feb 10, 2025", status: "active", bookings: 0 },
  { id: 3, name: "Yaw Boateng", email: "yaw@example.com", role: "Provider", joined: "Mar 1, 2025", status: "active", bookings: 0 },
  { id: 4, name: "Ama Osei", email: "ama@example.com", role: "Traveller", joined: "Mar 2, 2026", status: "active", bookings: 5 },
  { id: 5, name: "Ibrahim Ahmed", email: "ibrahim@example.com", role: "Provider", joined: "Mar 3, 2026", status: "suspended", bookings: 0 },
  { id: 6, name: "Esi Darko", email: "esi@example.com", role: "Traveller", joined: "Mar 4, 2026", status: "active", bookings: 3 },
];

const AdminUsers = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">User Management</h2>
        <Badge variant="secondary">{users.length} users</Badge>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="border-0 shadow-none focus-visible:ring-0" />
        </div>
        <Select>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="traveller">Traveller</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bookings</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-medium text-primary text-xs">
                      {u.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="secondary">{u.role}</Badge></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                <td className="px-4 py-3">{u.bookings}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2"><Eye className="h-3 w-3" /> View</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2"><Shield className="h-3 w-3" /> Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive"><Ban className="h-3 w-3" /> Suspend</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminUsers;
