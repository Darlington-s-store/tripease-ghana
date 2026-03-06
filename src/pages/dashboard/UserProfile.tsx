import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to update user profile
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const initials = formData.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "U";

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">My Profile</h2>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent font-display text-3xl font-bold text-primary">
                {initials}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">{formData.full_name || "User"}</h3>
              <p className="text-sm text-muted-foreground">Traveller • TripEase Member</p>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Bio</label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
