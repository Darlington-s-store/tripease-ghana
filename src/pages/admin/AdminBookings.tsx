import { useState } from "react";
import { Calendar, Search, Eye, MoreVertical, DollarSign, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/layout/DashboardLayout";

const bookings = [
  { id: "BK001", user: "Kofi Mensah", service: "Labadi Beach Hotel", type: "Hotel", date: "Mar 15-18, 2026", amount: 1350, status: "confirmed", paymentMethod: "MTN MoMo" },
  { id: "BK002", user: "Ama Osei", service: "Kwame Mensah - Cape Coast", type: "Guide", date: "Mar 16, 2026", amount: 200, status: "pending", paymentMethod: "Vodafone Cash" },
  { id: "BK003", user: "James Owusu", service: "VIP Bus: Accra → Kumasi", type: "Transport", date: "Mar 20, 2026", amount: 120, status: "confirmed", paymentMethod: "Visa" },
  { id: "BK004", user: "Fatima Ali", service: "Golden Tulip Kumasi", type: "Hotel", date: "Mar 20-22, 2026", amount: 400, status: "completed", paymentMethod: "MTN MoMo" },
  { id: "BK005", user: "Esi Darko", service: "Mole National Park Safari", type: "Attraction", date: "Mar 25, 2026", amount: 150, status: "cancelled", paymentMethod: "Mastercard" },
  { id: "BK006", user: "Yaw Boateng", service: "Anomabo Beach Resort", type: "Hotel", date: "Mar 28-30, 2026", amount: 640, status: "confirmed", paymentMethod: "MTN MoMo" },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-info/10 text-info",
};

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = bookings.filter((b) => {
    const matchesSearch = b.user.toLowerCase().includes(searchQuery.toLowerCase()) || b.service.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesType = typeFilter === "all" || b.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenue = filtered.reduce((sum, b) => sum + b.amount, 0);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Booking Management</h2>
            <p className="text-muted-foreground">Manage all platform bookings</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Value</p>
              <p className="font-display font-bold text-primary">GH₵{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by user, service, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-0 shadow-none focus-visible:ring-0" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Guide">Guide</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Attraction">Attraction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Booking ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Payment</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                  <td className="px-4 py-3 font-medium">{b.user}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p>{b.service}</p>
                      <Badge variant="secondary" className="mt-0.5 text-xs">{b.type}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                  <td className="px-4 py-3 text-xs">{b.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">GH₵{b.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Eye className="h-3 w-3" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive"><XCircle className="h-3 w-3" /> Cancel Booking</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} bookings found</p>
      </div>
    </DashboardLayout>
  );
};

export default AdminBookings;
