import { Calendar, Hotel, MapPin, CreditCard, Star, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";

const bookings = [
  { id: "BK001", type: "Hotel", name: "Labadi Beach Hotel", date: "Mar 15-18, 2026", status: "confirmed", amount: 1350, guests: 2 },
  { id: "BK002", type: "Guide", name: "Kwame Mensah - Cape Coast Tour", date: "Mar 16, 2026", status: "pending", amount: 200, guests: 2 },
  { id: "BK003", type: "Transport", name: "VIP Bus: Accra → Kumasi", date: "Mar 20, 2026", status: "confirmed", amount: 120, guests: 1 },
  { id: "BK004", type: "Hotel", name: "Golden Tulip Kumasi", date: "Mar 20-22, 2026", status: "completed", amount: 400, guests: 2 },
  { id: "BK005", type: "Attraction", name: "Mole National Park Safari", date: "Mar 25, 2026", status: "cancelled", amount: 150, guests: 3 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-info/10 text-info",
};

const UserBookings = () => (
  <DashboardLayout role="user">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">My Bookings</h2>
        <Badge variant="secondary">{bookings.length} bookings</Badge>
      </div>

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="secondary">{b.type}</Badge>
                <span className="text-xs text-muted-foreground">{b.id}</span>
              </div>
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-muted-foreground">{b.date} • {b.guests} guest(s)</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[b.status]}`}>
                {b.status}
              </span>
              <span className="text-lg font-bold text-primary">GH₵{b.amount}</span>
              <div className="flex gap-1">
                {b.status === "confirmed" && <Button variant="outline" size="sm">Cancel</Button>}
                {b.status === "completed" && <Button variant="outline" size="sm">Review</Button>}
                <Button variant="ghost" size="sm">Details</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default UserBookings;
