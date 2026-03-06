import { Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

const reviews = [
  { id: 1, service: "Labadi Beach Hotel", type: "Hotel", rating: 5, comment: "Wonderful stay! Great views and excellent service.", date: "Mar 10, 2026" },
  { id: 2, service: "Kwame Mensah (Guide)", type: "Guide", rating: 4, comment: "Very knowledgeable guide. Great Cape Coast experience.", date: "Mar 8, 2026" },
  { id: 3, service: "VIP Jeoun Bus", type: "Transport", rating: 3, comment: "Decent service but arrived late.", date: "Mar 5, 2026" },
];

const UserReviews = () => (
  <DashboardLayout role="user">
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">My Reviews</h2>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-semibold">{r.service}</p>
                  <Badge variant="secondary" className="text-xs">{r.type}</Badge>
                </div>
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">"{r.comment}"</p>
                <p className="mt-2 text-xs text-muted-foreground">{r.date}</p>
              </div>
              <div className="flex gap-1">
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

export default UserReviews;
