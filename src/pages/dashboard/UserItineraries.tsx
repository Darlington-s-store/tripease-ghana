import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, DollarSign, MapPin, Plus, Share2, Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { tripsService, Trip } from "@/services/trips";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  completed: "bg-info/10 text-info",
  draft: "bg-muted text-muted-foreground",
};

const UserItineraries = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const data = await tripsService.getUserTrips();
      setTrips(data);
    } catch (error: any) {
      toast.error("Failed to load itineraries");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    try {
      await tripsService.deleteTrip(tripId);
      toast.success("Itinerary deleted successfully");
      loadTrips();
    } catch (error: any) {
      toast.error("Failed to delete itinerary");
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
          <h2 className="font-display text-2xl font-bold">My Itineraries</h2>
          <Button className="gap-1" asChild>
            <Link to="/trips/new">
              <Plus className="h-4 w-4" /> Create New
            </Link>
          </Button>
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12">
            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-semibold">No itineraries yet</p>
            <p className="text-sm text-muted-foreground">Create your first trip itinerary</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{trip.destination}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {calculateDays(trip.start_date, trip.end_date)} days
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {trip.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> GH₵{trip.budget}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created: {new Date(trip.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(trip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/trips/${trip.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserItineraries;
