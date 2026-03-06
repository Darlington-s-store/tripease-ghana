import { useEffect, useState } from "react";
import { Calendar, Hotel, MapPin, CreditCard, Star, ArrowUpRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { bookingsService, Booking } from "@/services/bookings";
import { tripsService, Trip } from "@/services/trips";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-info/10 text-info",
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bookingsData, tripsData] = await Promise.all([
        bookingsService.getUserBookings(),
        tripsService.getUserTrips(),
      ]);
      setBookings(bookingsData.slice(0, 3)); // Show recent 3 bookings
      setTrips(tripsData);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: "Total Bookings", value: bookings.length.toString(), icon: Calendar, color: "text-primary" },
    { label: "Active Trips", value: trips.length.toString(), icon: Hotel, color: "text-info" },
    {
      label: "Total Spent",
      value: `GH₵${bookings.reduce((sum, b) => sum + b.total_price, 0).toFixed(2)}`,
      icon: CreditCard,
      color: "text-warning",
    },
    { label: "Destinations", value: trips.length.toString(), icon: MapPin, color: "text-success" },
  ];

  if (isLoading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Welcome back, {user?.full_name || "Traveller"}!</h2>
          <p className="text-muted-foreground">Here's an overview of your travel activity</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
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
              <Link to="/dashboard/bookings" className="gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          {bookings.length === 0 ? (
            <div className="p-5 text-center text-muted-foreground">
              <p>No bookings yet. Start planning your next trip!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">Booking #{b.id.substring(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.created_at).toLocaleDateString()} • GH₵{b.total_price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{b.booking_type}</Badge>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                    <span className="font-semibold text-primary">GH₵{b.total_price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
