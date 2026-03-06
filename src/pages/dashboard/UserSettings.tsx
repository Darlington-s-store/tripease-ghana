import { Bell, Lock, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/layout/DashboardLayout";

const UserSettings = () => (
  <DashboardLayout role="user">
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Settings</h2>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
          <Lock className="h-5 w-5 text-primary" /> Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Current Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button>Update Password</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
          <Bell className="h-5 w-5 text-primary" /> Notifications
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Email notifications</p><p className="text-sm text-muted-foreground">Booking updates and confirmations</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">SMS notifications</p><p className="text-sm text-muted-foreground">Receive SMS for booking alerts</p></div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Promotional emails</p><p className="text-sm text-muted-foreground">Deals and travel recommendations</p></div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
          <Globe className="h-5 w-5 text-primary" /> Preferences
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Currency</p><p className="text-sm text-muted-foreground">Display currency</p></div>
            <span className="text-sm font-medium">GH₵ (Cedi)</span>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Language</p><p className="text-sm text-muted-foreground">Interface language</p></div>
            <span className="text-sm font-medium">English</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-destructive/30 bg-card p-6">
        <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold text-destructive">
          <Shield className="h-5 w-5" /> Danger Zone
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
        <Button variant="destructive" size="sm">Delete Account</Button>
      </div>
    </div>
  </DashboardLayout>
);

export default UserSettings;
