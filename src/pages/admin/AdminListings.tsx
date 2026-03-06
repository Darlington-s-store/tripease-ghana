import { useState } from "react";
import { Building, Search, Eye, MoreVertical, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/layout/DashboardLayout";

const listings = [
  { id: 1, name: "Labadi Beach Hotel", type: "Hotel", provider: "Akua Sarfo", location: "Accra", status: "active", bookings: 45, rating: 4.8 },
  { id: 2, name: "Cape Coast Historical Tour", type: "Tour", provider: "Kwame Mensah", location: "Cape Coast", status: "active", bookings: 23, rating: 4.9 },
  { id: 3, name: "VIP Jeoun Transport", type: "Transport", provider: "Ibrahim Ahmed", location: "Accra", status: "active", bookings: 67, rating: 4.3 },
  { id: 4, name: "Zaina Lodge", type: "Hotel", provider: "Yaw Boateng", location: "Tamale", status: "suspended", bookings: 12, rating: 4.9 },
  { id: 5, name: "Golden Tulip Kumasi", type: "Hotel", provider: "Esi Darko", location: "Kumasi", status: "active", bookings: 34, rating: 4.2 },
  { id: 6, name: "Volta Hiking Adventures", type: "Tour", provider: "Ama Osei", location: "Ho", status: "pending", bookings: 0, rating: 0 },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  suspended: "bg-destructive/10 text-destructive",
};

const AdminListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = listings.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || l.type.toLowerCase() === typeFilter;
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">All Listings</h2>
            <p className="text-muted-foreground">Manage all service provider listings</p>
          </div>
          <Badge variant="secondary">{listings.length} listings</Badge>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="tour">Tour</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Listing</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Provider</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bookings</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{l.type}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{l.provider}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.location}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3">{l.bookings}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Eye className="h-3 w-3" /> View</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><CheckCircle className="h-3 w-3" /> Activate</DropdownMenuItem>
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
};

export default AdminListings;
