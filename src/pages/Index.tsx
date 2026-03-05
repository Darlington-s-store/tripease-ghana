import { Link } from "react-router-dom";
import { Search, MapPin, Hotel, Users, Truck, Star, ArrowRight, Shield, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/hero-ghana.jpg";
import kakumPark from "@/assets/kakum-park.jpg";
import elminaCastle from "@/assets/elmina-castle.jpg";
import molePark from "@/assets/mole-park.jpg";

const destinations = [
  { name: "Cape Coast", region: "Central", image: elminaCastle, attractions: 24 },
  { name: "Kakum National Park", region: "Central", image: kakumPark, attractions: 8 },
  { name: "Mole National Park", region: "Northern", image: molePark, attractions: 12 },
];

const features = [
  { icon: Hotel, title: "Hotels & Stays", description: "Find the best accommodation across all regions of Ghana" },
  { icon: Users, title: "Tour Guides", description: "Connect with experienced local guides who know Ghana inside out" },
  { icon: Truck, title: "Transport", description: "Book buses and domestic flights for seamless travel" },
  { icon: MapPin, title: "Attractions", description: "Discover castles, parks, waterfalls and cultural sites" },
];

const stats = [
  { value: "500+", label: "Hotels Listed" },
  { value: "200+", label: "Tour Guides" },
  { value: "150+", label: "Attractions" },
  { value: "50K+", label: "Happy Travellers" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <img src={heroImage} alt="Ghana coastal landscape" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl animate-fade-in">
            <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              🇬🇭 Discover Ghana Like Never Before
            </span>
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
              Plan Your Perfect <span className="text-primary">Ghana</span> Trip
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Search, compare, and book hotels, tour guides, attractions, and transport — all in one place. Pay with Mobile Money or card.
            </p>

            {/* Search bar */}
            <div className="flex flex-col gap-2 rounded-2xl bg-background/95 p-3 shadow-primary-xl backdrop-blur-md sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3">
                <MapPin className="h-4 w-4 text-primary" />
                <Input
                  placeholder="Where in Ghana?"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3">
                <Clock className="h-4 w-4 text-primary" />
                <Input
                  type="date"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="gap-2 rounded-xl" asChild>
                <Link to="/hotels">
                  <Search className="h-4 w-4" /> Search
                </Link>
              </Button>
            </div>

            {/* Payment badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground backdrop-blur-sm">
                <CreditCard className="h-3 w-3" /> MTN MoMo
              </span>
              <span className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground backdrop-blur-sm">
                <CreditCard className="h-3 w-3" /> Vodafone Cash
              </span>
              <span className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground backdrop-blur-sm">
                <CreditCard className="h-3 w-3" /> Visa/Mastercard
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary py-8">
        <div className="container grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">
              Everything You Need for Your Trip
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              From accommodation to transport, plan your entire Ghana adventure from a single platform.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-primary-md hover:-translate-y-1"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="bg-secondary py-20">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">
                Top Destinations
              </h2>
              <p className="text-muted-foreground">
                Explore the most popular destinations across Ghana
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/attractions" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {destinations.map((d) => (
              <Link
                key={d.name}
                to="/attractions"
                className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-primary-md"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4">
                    <p className="font-display text-lg font-semibold text-primary-foreground">{d.name}</p>
                    <p className="text-sm text-primary-foreground/80">{d.region} Region • {d.attractions} attractions</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl bg-gradient-primary p-10 text-center md:p-16">
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              Trusted by Thousands of Travellers
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
              Join over 50,000 travellers who have discovered the beauty of Ghana through TripEase. Secure payments, verified providers, and 24/7 support.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Shield, text: "Verified Providers" },
                { icon: CreditCard, text: "Secure Payments" },
                { icon: Star, text: "Real Reviews" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
                    <Icon className="h-4 w-4" />
                    {item.text}
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="rounded-full px-8"
              >
                <Link to="/register">Start Planning Your Trip</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
