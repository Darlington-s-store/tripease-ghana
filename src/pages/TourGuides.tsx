import { Link } from "react-router-dom";
import { MapPin, Star, Globe, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";

const guides = [
  { id: 1, name: "Kwame Mensah", region: "Central Region", languages: ["English", "Twi", "Fante"], specialty: "Historical Tours", rating: 4.9, reviews: 87, price: 200, bio: "10+ years guiding visitors through Cape Coast and Elmina castles" },
  { id: 2, name: "Abena Osei", region: "Greater Accra", languages: ["English", "Twi"], specialty: "City Tours", rating: 4.8, reviews: 65, price: 150, bio: "Accra native offering immersive city and cultural experiences" },
  { id: 3, name: "Yaw Boateng", region: "Ashanti Region", languages: ["English", "Twi", "French"], specialty: "Cultural Tours", rating: 4.7, reviews: 42, price: 180, bio: "Expert on Ashanti Kingdom history and Kumasi cultural heritage" },
  { id: 4, name: "Esi Darko", region: "Volta Region", languages: ["English", "Ewe"], specialty: "Nature & Hiking", rating: 4.9, reviews: 56, price: 250, bio: "Adventure guide specializing in Wli Falls and Mount Afadjato" },
  { id: 5, name: "Ibrahim Ahmed", region: "Northern Region", languages: ["English", "Dagbani"], specialty: "Wildlife Safari", rating: 4.6, reviews: 34, price: 300, bio: "Expert wildlife guide at Mole National Park" },
  { id: 6, name: "Akosua Frimpong", region: "Western Region", languages: ["English", "Twi", "Nzema"], specialty: "Beach & Eco Tours", rating: 4.8, reviews: 48, price: 170, bio: "Eco-tourism specialist in the Western coastal region" },
];

const TourGuides = () => (
  <Layout>
    <section className="bg-gradient-primary py-16">
      <div className="container">
        <h1 className="mb-2 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
          Find a Tour Guide
        </h1>
        <p className="mb-8 text-primary-foreground/80">
          Connect with experienced local guides who bring Ghana's stories to life
        </p>
        <div className="flex flex-col gap-2 rounded-2xl bg-background p-3 shadow-primary-lg sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3">
            <Search className="h-4 w-4 text-primary" />
            <Input placeholder="Search by name or specialty..." className="border-0 bg-transparent shadow-none focus-visible:ring-0" />
          </div>
          <Select>
            <SelectTrigger className="w-full rounded-xl sm:w-[160px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="central">Central</SelectItem>
              <SelectItem value="greater-accra">Greater Accra</SelectItem>
              <SelectItem value="ashanti">Ashanti</SelectItem>
              <SelectItem value="northern">Northern</SelectItem>
              <SelectItem value="volta">Volta</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full rounded-xl sm:w-[160px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="twi">Twi</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="ewe">Ewe</SelectItem>
            </SelectContent>
          </Select>
          <Button size="lg" className="gap-2 rounded-xl">
            <Search className="h-4 w-4" /> Search
          </Button>
        </div>
      </div>
    </section>

    <section className="py-10">
      <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <div key={g.id} className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-primary-md">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent font-display text-2xl font-bold text-primary">
                {g.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{g.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {g.region}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-sm font-medium">{g.rating}</span>
                  <span className="text-xs text-muted-foreground">({g.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">{g.bio}</p>

            <div className="mb-3 flex flex-wrap gap-1">
              <Badge variant="secondary">{g.specialty}</Badge>
              {g.languages.map((l) => (
                <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
              ))}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-xl font-bold text-primary">GH₵{g.price}</span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>
              <Button size="sm">Book Guide</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default TourGuides;
