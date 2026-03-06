import { useEffect, useState } from "react";
import { Calendar, Hotel, MapPin, CreditCard, Star, Badge as BadgeIcon, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { bookingsService, Booking } from "@/services/bookings";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-info/10 text-info",
};

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingsService.getUserBookings();
      setBookings(data);
    } catch (error: any) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsService.cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      loadBookings();
    } catch (error: any) {
      toast.error("Failed to cancel booking");
    }
  };

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
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">My Bookings</h2>
          <Badge variant="secondary">{bookings.length} bookings</Badge>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12">
            <Calendar className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-semibold">No bookings yet</p>
            <p className="text-sm text-muted-foreground">Start planning your next trip</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="secondary">{b.booking_type}</Badge>
                    <span className="text-xs text-muted-foreground">{b.id}</span>
                  </div>
                  <p className="font-semibold">Booking Reference</p>
                  <p className="text-sm text-muted-foreground">Status: {b.status} • GH₵{b.total_price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                  <span className="text-lg font-bold text-primary">GH₵{b.total_price.toFixed(2)}</span>
                  <div className="flex gap-1">
                    {b.status === "confirmed" && (
                      <Button variant="outline" size="sm" onClick={() => handleCancelBooking(b.id)}>
                        Cancel
                      </Button>
                    )}
                    {b.status === "completed" && <Button variant="outline" size="sm">Review</Button>}
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserBookings;
