import { Calendar, Hotel, MapPin, CreditCard, Star, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const recentBookings = [
  { id: "BK001", type: "Hotel", name: "Labadi Beach Hotel", date: "Mar 15-18, 2026", status: "confirmed", amount: 1350 },
  { id: "BK002", type: "Guide", name: "Kwame Mensah - Cape Coast", date: "Mar 16, 2026", status: "pending", amount: 200 },
  { id: "BK003", type: "Transport", name: "Bus: Accra → Kumasi", date: "Mar 20, 2026", status: "confirmed", amount: 120 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
};

const UserDashboard = () => (
  <DashboardLayout role="user">
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Welcome back, Kofi! 👋</h2>
        <p className="text-muted-foreground">Here's an overview of your travel activity</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Bookings", value: "12", icon: Calendar, color: "text-primary" },
          { label: "Hotels Stayed", value: "5", icon: Hotel, color: "text-info" },
          { label: "Places Visited", value: "8", icon: MapPin, color: "text-success" },
          { label: "Total Spent", value: "GH₵4,250", icon: CreditCard, color: "text-warning" },
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

      {/* Recent Bookings */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="font-display text-lg font-semibold">Recent Bookings</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/bookings" className="gap-1">View All <ArrowUpRight className="h-3 w-3" /></Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {recentBookings.map((b) => (
            <div key={b.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="text-sm text-muted-foreground">{b.date} • {b.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{b.type}</Badge>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[b.status]}`}>
                  {b.status}
                </span>
                <span className="font-semibold text-primary">GH₵{b.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default UserDashboard;
