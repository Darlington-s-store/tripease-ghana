import { BarChart3, TrendingUp, Users, DollarSign, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";

const topDestinations = [
  { name: "Accra", bookings: 342, revenue: 125000 },
  { name: "Cape Coast", bookings: 218, revenue: 78500 },
  { name: "Kumasi", bookings: 156, revenue: 54000 },
  { name: "Tamale", bookings: 89, revenue: 32000 },
  { name: "Takoradi", bookings: 67, revenue: 24500 },
];

const monthlyStats = [
  { month: "Jan", bookings: 85, revenue: 42000 },
  { month: "Feb", bookings: 102, revenue: 51000 },
  { month: "Mar", bookings: 138, revenue: 69000 },
];

const AdminAnalytics = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Analytics</h2>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "GH₵485,200", change: "+18.2%", icon: DollarSign },
          { label: "Total Bookings", value: "1,287", change: "+23.1%", icon: Calendar },
          { label: "New Users", value: "456", change: "+12.5%", icon: Users },
          { label: "Avg Booking Value", value: "GH₵377", change: "+5.3%", icon: TrendingUp },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" /> {s.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly performance */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">Monthly Performance</h3>
          <div className="space-y-3">
            {monthlyStats.map((m) => (
              <div key={m.month} className="flex items-center gap-4">
                <span className="w-8 text-sm font-medium text-muted-foreground">{m.month}</span>
                <div className="flex-1">
                  <div className="mb-1 h-6 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${(m.bookings / 150) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{m.bookings} bookings</p>
                  <p className="text-xs text-muted-foreground">GH₵{m.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top destinations */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">Top Destinations</h3>
          <div className="space-y-3">
            {topDestinations.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.bookings} bookings</p>
                  </div>
                </div>
                <span className="font-semibold text-primary">GH₵{d.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminAnalytics;
