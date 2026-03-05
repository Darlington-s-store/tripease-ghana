import { Users, Building, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const pendingApprovals = [
  { name: "Sunset Beach Resort", type: "Hotel", provider: "Akua Sarfo", submitted: "Mar 1, 2026" },
  { name: "Volta Region Adventure Tour", type: "Tour", provider: "Yaw Boateng", submitted: "Mar 3, 2026" },
  { name: "Kumasi City Shuttle", type: "Transport", provider: "Ibrahim Ahmed", submitted: "Mar 4, 2026" },
];

const recentUsers = [
  { name: "Ama Osei", email: "ama@example.com", role: "Traveller", joined: "Mar 2, 2026", status: "active" },
  { name: "James Owusu", email: "james@example.com", role: "Provider", joined: "Mar 3, 2026", status: "active" },
  { name: "Fatima Ali", email: "fatima@example.com", role: "Traveller", joined: "Mar 4, 2026", status: "active" },
];

const AdminDashboard = () => (
  <DashboardLayout role="admin">
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: "2,451", icon: Users, color: "text-primary", change: "+12%" },
          { label: "Active Listings", value: "342", icon: Building, color: "text-info", change: "+8%" },
          { label: "Total Bookings", value: "1,287", icon: Calendar, color: "text-success", change: "+23%" },
          { label: "Revenue", value: "GH₵485K", icon: DollarSign, color: "text-warning", change: "+18%" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" /> {s.change} this month
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Approvals
            </h3>
            <Badge variant="secondary">{pendingApprovals.length}</Badge>
          </div>
          <div className="divide-y divide-border">
            {pendingApprovals.map((p) => (
              <div key={p.name} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.provider} • {p.type} • {p.submitted}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1 text-success hover:bg-success/10">
                    <CheckCircle className="h-3 w-3" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10">
                    <XCircle className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="font-display text-lg font-semibold">Recent Users</h3>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((u) => (
              <div key={u.email} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-medium text-primary">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{u.role}</Badge>
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">{u.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminDashboard;
