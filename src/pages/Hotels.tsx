import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import kakumPark from "@/assets/kakum-park.jpg";
import elminaCastle from "@/assets/elmina-castle.jpg";
import molePark from "@/assets/mole-park.jpg";

const hotels = [
  { id: 1, name: "Labadi Beach Hotel", location: "Accra", price: 450, rating: 4.8, stars: 5, image: elminaCastle, amenities: ["wifi", "pool", "restaurant", "parking"] },
  { id: 2, name: "Coconut Grove Regency", location: "Accra", price: 280, rating: 4.5, stars: 4, image: kakumPark, amenities: ["wifi", "restaurant", "gym"] },
  { id: 3, name: "Ridge Royal Hotel", location: "Cape Coast", price: 180, rating: 4.3, stars: 3, image: molePark, amenities: ["wifi", "parking", "restaurant"] },
  { id: 4, name: "Zaina Lodge", location: "Tamale", price: 620, rating: 4.9, stars: 5, image: elminaCastle, amenities: ["wifi", "pool", "spa", "restaurant"] },
  { id: 5, name: "Anomabo Beach Resort", location: "Cape Coast", price: 320, rating: 4.6, stars: 4, image: kakumPark, amenities: ["wifi", "pool", "restaurant"] },
  { id: 6, name: "Golden Tulip Kumasi", location: "Kumasi", price: 200, rating: 4.2, stars: 4, image: molePark, amenities: ["wifi", "restaurant", "gym", "parking"] },
];

const Hotels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [starRating, setStarRating] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let result = hotels.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = priceRange === "all" ||
        (priceRange === "0-200" && h.price <= 200) ||
        (priceRange === "200-400" && h.price > 200 && h.price <= 400) ||
        (priceRange === "400+" && h.price > 400);
      const matchesStars = starRating === "all" || h.stars === Number(starRating);
      return matchesSearch && matchesPrice && matchesStars;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchQuery, priceRange, starRating, sortBy]);

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
            <Input type="date" className="flex-1 rounded-xl" placeholder="Check-in" />
            <Input type="date" className="flex-1 rounded-xl" placeholder="Check-out" />
            <Button size="lg" className="gap-2 rounded-xl">
              <Search className="h-4 w-4" /> Search
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Price Range" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-200">GH₵ 0 - 200</SelectItem>
                <SelectItem value="200-400">GH₵ 200 - 400</SelectItem>
                <SelectItem value="400+">GH₵ 400+</SelectItem>
              </SelectContent>
            </Select>
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
            <span className="text-sm text-muted-foreground">{filtered.length} results</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
              <Search className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-semibold">No hotels found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((hotel) => (
                <Link key={hotel.id} to={`/hotels/${hotel.id}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-primary-md">
                  <div className="relative h-48 overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {hotel.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 flex items-center gap-1">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <h3 className="mb-1 font-display text-lg font-semibold">{hotel.name}</h3>
                    <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" /> {hotel.location}</p>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {hotel.amenities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs capitalize">{a}</Badge>
                      ))}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">GH₵{hotel.price}</span>
                        <span className="text-sm text-muted-foreground">/night</span>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Hotels;
