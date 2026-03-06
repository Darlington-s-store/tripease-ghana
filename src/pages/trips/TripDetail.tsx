import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { tripsService, Trip } from "@/services/trips";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ItineraryBuilder } from "@/components/trips/ItineraryBuilder";
import { ArrowLeft } from "lucide-react";

interface ItineraryDay {
  dayNumber: number;
  activities: string;
  notes: string;
}

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState<ItineraryDay[]>([]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && id) {
      loadTrip();
    }
  }, [isLoading, isAuthenticated, id]);

  const loadTrip = async () => {
    try {
      setIsLoadingTrip(true);
      const tripData = await tripsService.getTripById(id!);
      setTrip(tripData);
      setDestination(tripData.destination);
      setDescription(tripData.description || "");
      setBudget(tripData.budget?.toString() || "");

      // Load itineraries
      if (tripData.itineraries) {
        setDays(
          tripData.itineraries.map((it) => ({
            dayNumber: it.day_number,
            activities: it.activities || "",
            notes: it.notes || "",
          }))
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load trip");
    } finally {
      setIsLoadingTrip(false);
    }
  };

  const handleAddDay = () => {
    const nextDayNumber = days.length > 0 ? Math.max(...days.map(d => d.dayNumber)) + 1 : 1;
    setDays([...days, { dayNumber: nextDayNumber, activities: "", notes: "" }]);
  };

  const handleUpdateDay = (dayNumber: number, activities: string, notes: string) => {
    setDays(days.map(day =>
      day.dayNumber === dayNumber ? { ...day, activities, notes } : day
    ));
  };

  const handleRemoveDay = (dayNumber: number) => {
    setDays(days.filter(day => day.dayNumber !== dayNumber));
  };

  const handleSaveChanges = async () => {
    if (!trip) return;

    setIsSubmitting(true);
    try {
      await tripsService.updateTrip(
        trip.id,
        destination,
        undefined,
        undefined,
        description || undefined,
        budget ? parseFloat(budget) : undefined
      );

      // Update itineraries
      for (const day of days) {
        await tripsService.addItinerary(
          trip.id,
          day.dayNumber,
          day.activities || undefined,
          day.notes || undefined
        );
      }

      toast.success("Trip updated successfully!");
      setIsEditing(false);
      loadTrip();
    } catch (error: any) {
      toast.error(error.message || "Failed to update trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip) return;

    if (!window.confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    try {
      await tripsService.deleteTrip(trip.id);
      toast.success("Trip deleted successfully!");
      navigate("/dashboard/itineraries");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete trip");
    }
  };

  if (isLoading || isLoadingTrip) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!trip) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Trip not found</h2>
          <p className="text-muted-foreground mb-4">The trip you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/dashboard/itineraries")}>
            Back to Itineraries
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate("/dashboard/itineraries")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Itineraries
        </button>

        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{trip.destination}</h1>
            <p className="text-muted-foreground mt-2">
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="destructive" onClick={handleDeleteTrip}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-6">
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget (Optional)</label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <ItineraryBuilder
                  days={days}
                  onAddDay={handleAddDay}
                  onUpdateDay={handleUpdateDay}
                  onRemoveDay={handleRemoveDay}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  loadTrip();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {trip.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About This Trip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{trip.description}</p>
                </CardContent>
              </Card>
            )}

            {trip.budget && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${trip.budget.toFixed(2)}</p>
                </CardContent>
              </Card>
            )}

            {days.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {days.map((day) => (
                    <div key={day.dayNumber} className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-semibold">Day {day.dayNumber}</h4>
                      {day.activities && (
                        <p className="text-sm mt-1">
                          <span className="text-muted-foreground">Activities: </span>
                          {day.activities}
                        </p>
                      )}
                      {day.notes && (
                        <p className="text-sm mt-1">
                          <span className="text-muted-foreground">Notes: </span>
                          {day.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
