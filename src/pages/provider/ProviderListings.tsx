import { useState } from "react";
import { Building, Plus, Edit, Trash2, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const listings = [
  { id: 1, name: "Labadi Beach Hotel", type: "Hotel", status: "active", bookings: 45, rating: 4.8, revenue: 28500 },
  { id: 2, name: "Cape Coast Historical Tour", type: "Tour", status: "active", bookings: 23, rating: 4.9, revenue: 4600 },
  { id: 3, name: "Airport Shuttle Service", type: "Transport", status: "pending", bookings: 0, rating: 0, revenue: 0 },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  inactive: "bg-muted text-muted-foreground",
};

const ProviderListings = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">My Listings</h2>
        <Button className="gap-1"><Plus className="h-4 w-4" /> Add Listing</Button>
      </div>

      <div className="space-y-4">
        {listings.map((l) => (
          <div key={l.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{l.name}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">{l.type}</Badge>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[l.status]}`}>{l.status}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold">{l.bookings}</p>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </div>
              {l.rating > 0 && (
                <div className="text-center">
                  <p className="flex items-center gap-1 font-semibold"><Star className="h-3 w-3 fill-primary text-primary" /> {l.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              )}
              <div className="text-center">
                <p className="font-semibold text-primary">GH₵{l.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderListings;
