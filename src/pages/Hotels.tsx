import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star, SlidersHorizontal, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { hotelsService, Hotel } from "@/services/hotels";
import { HotelCard } from "@/components/cards/HotelCard";
import { toast } from "sonner";

const Hotels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [starRating, setStarRating] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const data = await hotelsService.searchHotels({
        limit: 100,
      });
      setHotels(data);
    } catch (error: any) {
      toast.error("Failed to load hotels");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = hotels.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = h.price_per_night >= min && h.price_per_night <= max;
      
      const matchesRating = starRating === "all" || 
        (starRating === "5" && h.rating >= 4.5) ||
        (starRating === "4" && h.rating >= 3.5 && h.rating < 4.5) ||
        (starRating === "3" && h.rating < 3.5);
      
      return matchesSearch && matchesPrice && matchesRating;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price_per_night - b.price_per_night);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price_per_night - a.price_per_night);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [hotels, searchQuery, priceRange, starRating, sortBy, minPrice, maxPrice]);

  return (
    <Layout>
      <section className="bg-gradient-primary py-16">
        <div className="container">
          <h1 className="mb-2 font-display text-3xl font-bold text-primary-foreground md:text-4xl">Find Your Perfect Stay</h1>
          <p className="mb-8 text-primary-foreground/80">Search from 500+ hotels and accommodations across Ghana</p>
          <div className="flex flex-col gap-2 rounded-2xl bg-background p-3 shadow-primary-lg sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3">
              <MapPin className="h-4 w-4 text-primary" />
              <Input placeholder="Search by name or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-0 bg-transparent shadow-none focus-visible:ring-0" />
            </div>
            <Button size="lg" className="gap-2 rounded-xl" onClick={loadHotels}>
              <Search className="h-4 w-4" /> Search
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24"
              />
            </div>
            <Select value={starRating} onValueChange={setStarRating}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Star Rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort By" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${filtered.length} results`}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
              <Loader className="mb-3 h-10 w-10 text-muted-foreground animate-spin" />
              <p className="text-lg font-semibold">Loading hotels...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
              <Search className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-semibold">No hotels found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Hotels;
