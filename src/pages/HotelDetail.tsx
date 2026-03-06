import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hotelsService, Hotel } from "@/services/hotels";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Star, MapPin, Wifi, UtensilsCrossed, Dumbbell, ParkingCircle, Loader } from "lucide-react";

const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi className="w-5 h-5" />,
  restaurant: <UtensilsCrossed className="w-5 h-5" />,
  gym: <Dumbbell className="w-5 h-5" />,
  parking: <ParkingCircle className="w-5 h-5" />,
};

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("1");

  useEffect(() => {
    if (id) {
      loadHotel();
    }
  }, [id]);

  const loadHotel = async () => {
    try {
      setIsLoading(true);
      const data = await hotelsService.getHotelById(id!);
      setHotel(data);
    } catch (error: any) {
      toast.error("Failed to load hotel details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const nights = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const totalPrice = hotel!.price_per_night * nights * parseInt(guests);

    navigate("/checkout", {
      state: {
        hotelId: hotel!.id,
        hotelName: hotel!.name,
        checkInDate,
        checkOutDate,
        nights,
        guests: parseInt(guests),
        pricePerNight: hotel!.price_per_night,
        totalPrice,
      },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!hotel) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Hotel not found</h1>
          <p className="text-muted-foreground mb-4">The hotel you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/hotels")}>Back to Hotels</Button>
        </div>
      </Layout>
    );
  }

  const amenities = hotel.amenities ? hotel.amenities.split(",").map(a => a.trim()) : [];

  return (
    <Layout>
      <button
        onClick={() => navigate("/hotels")}
        className="container mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Hotels
      </button>

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          {hotel.image_url && (
            <div className="rounded-2xl overflow-hidden h-96 mb-6">
              <img
                src={hotel.image_url}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <p className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                {hotel.location}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(hotel.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{hotel.rating.toFixed(1)}/5.0</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">${hotel.price_per_night.toFixed(2)}</p>
              <p className="text-muted-foreground">per night</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {hotel.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Hotel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="text-primary">
                          {amenityIcons[amenity.toLowerCase()] || <Badge variant="secondary" className="text-xs">{amenity}</Badge>}
                        </div>
                        <span className="text-sm font-medium capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Form */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
                <CardDescription>Select your dates and guests</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <Input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <Input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Guests</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      required
                    />
                  </div>

                  {checkInDate && checkOutDate && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Estimated total:</p>
                      <p className="text-2xl font-bold">
                        ${(
                          hotel.price_per_night *
                          Math.ceil(
                            (new Date(checkOutDate).getTime() -
                              new Date(checkInDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) *
                          parseInt(guests)
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Proceed to Checkout
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
