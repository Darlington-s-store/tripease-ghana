import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";

const UserProfile = () => (
  <DashboardLayout role="user">
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">My Profile</h2>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent font-display text-3xl font-bold text-primary">
              KM
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Kofi Mensah</h3>
            <p className="text-sm text-muted-foreground">Traveller • Member since Jan 2025</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">First Name</label>
              <Input defaultValue="Kofi" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last Name</label>
              <Input defaultValue="Mensah" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input type="email" defaultValue="kofi@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <Input type="tel" defaultValue="+233 20 123 4567" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea defaultValue="Adventure lover exploring the beauty of Ghana 🇬🇭" rows={3} />
          </div>
          <Button>Save Changes</Button>
        </form>
      </div>
    </div>
  </DashboardLayout>
);

export default UserProfile;
