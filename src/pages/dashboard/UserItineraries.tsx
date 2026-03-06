import { Link } from "react-router-dom";
import { BookOpen, Calendar, DollarSign, MapPin, Plus, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const itineraries = [
  { id: 1, name: "Cape Coast Weekend", days: 3, items: 8, cost: 1850, created: "Mar 1, 2026", status: "active" },
  { id: 2, name: "Northern Ghana Safari", days: 5, items: 12, cost: 3200, created: "Feb 20, 2026", status: "completed" },
  { id: 3, name: "Accra City Break", days: 2, items: 5, cost: 950, created: "Feb 10, 2026", status: "draft" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  completed: "bg-info/10 text-info",
  draft: "bg-muted text-muted-foreground",
};

const UserItineraries = () => (
  <DashboardLayout role="user">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">My Itineraries</h2>
        <Button className="gap-1" asChild>
          <Link to="/itinerary"><Plus className="h-4 w-4" /> Create New</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {itineraries.map((it) => (
          <div key={it.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{it.name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {it.days} days</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {it.items} items</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> GH₵{it.cost.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Created: {it.created}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[it.status]}`}>{it.status}</span>
              <Button variant="ghost" size="sm"><Share2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/itinerary">View</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default UserItineraries;
