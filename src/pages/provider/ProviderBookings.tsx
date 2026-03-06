import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const bookings = [
  { id: "BK001", guest: "Ama Osei", service: "Labadi Beach Hotel", date: "Mar 15-18, 2026", amount: 1350, status: "confirmed", guests: 2 },
  { id: "BK002", guest: "James Owusu", service: "Cape Coast Tour", date: "Mar 16, 2026", amount: 200, status: "pending", guests: 4 },
  { id: "BK003", guest: "Fatima Ali", service: "Labadi Beach Hotel", date: "Mar 20-22, 2026", amount: 900, status: "confirmed", guests: 2 },
  { id: "BK004", guest: "Esi Darko", service: "Cape Coast Tour", date: "Mar 22, 2026", amount: 200, status: "pending", guests: 3 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
};

const ProviderBookings = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Bookings</h2>
        <Badge variant="secondary">{bookings.length} bookings</Badge>
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{b.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[b.status]}`}>{b.status}</span>
              </div>
              <p className="font-semibold">{b.guest}</p>
              <p className="text-sm text-muted-foreground">{b.service} • {b.date} • {b.guests} guest(s)</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary">GH₵{b.amount}</span>
              {b.status === "pending" && (
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="gap-1 text-success hover:bg-success/10"><CheckCircle className="h-3 w-3" /> Accept</Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10"><XCircle className="h-3 w-3" /> Decline</Button>
                </div>
              )}
              {b.status === "confirmed" && <Button size="sm" variant="outline">Details</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderBookings;
