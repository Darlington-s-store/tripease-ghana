import { Building, Calendar, Star, DollarSign, Plus, ArrowUpRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const listings = [
  { name: "Labadi Beach Hotel", type: "Hotel", status: "active", bookings: 45, rating: 4.8, revenue: 28500 },
  { name: "Cape Coast Historical Tour", type: "Tour", status: "active", bookings: 23, rating: 4.9, revenue: 4600 },
  { name: "Airport Shuttle Service", type: "Transport", status: "pending", bookings: 0, rating: 0, revenue: 0 },
];

const recentBookings = [
  { guest: "Ama Osei", service: "Labadi Beach Hotel", date: "Mar 15-18", amount: 1350, status: "confirmed" },
  { guest: "James Owusu", service: "Cape Coast Tour", date: "Mar 16", amount: 200, status: "pending" },
  { guest: "Fatima Ali", service: "Labadi Beach Hotel", date: "Mar 20-22", amount: 900, status: "confirmed" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  inactive: "bg-muted text-muted-foreground",
  confirmed: "bg-success/10 text-success",
};

const ProviderDashboard = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Provider Dashboard</h2>
          <p className="text-muted-foreground">Manage your listings and bookings</p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" /> Add Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Bookings", value: "68", icon: Calendar, color: "text-primary" },
          { label: "Active Listings", value: "2", icon: Building, color: "text-info" },
          { label: "Avg Rating", value: "4.85", icon: Star, color: "text-warning" },
          { label: "Revenue", value: "GH₵33,100", icon: DollarSign, color: "text-success" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="font-display text-2xl font-bold">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Listings */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="font-display text-lg font-semibold">My Listings</h3>
        </div>
        <div className="divide-y divide-border">
          {listings.map((l) => (
            <div key={l.name} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{l.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{l.type}</Badge>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[l.status]}`}>
                    {l.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold">{l.bookings}</p>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                </div>
                {l.rating > 0 && (
                  <div className="text-center">
                    <p className="flex items-center gap-1 font-semibold"><Star className="h-3 w-3 fill-primary text-primary" /> {l.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-primary">GH₵{l.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h3 className="font-display text-lg font-semibold">Recent Bookings</h3>
        </div>
        <div className="divide-y divide-border">
          {recentBookings.map((b, i) => (
            <div key={i} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{b.guest}</p>
                <p className="text-sm text-muted-foreground">{b.service} • {b.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[b.status]}`}>
                  {b.status}
                </span>
                <span className="font-semibold text-primary">GH₵{b.amount}</span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderDashboard;
