import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Attractions from "./pages/Attractions";
import TourGuides from "./pages/TourGuides";
import Transport from "./pages/Transport";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/dashboard/UserDashboard";
import UserBookings from "./pages/dashboard/UserBookings";
import UserProfile from "./pages/dashboard/UserProfile";
import UserItineraries from "./pages/dashboard/UserItineraries";
import UserReviews from "./pages/dashboard/UserReviews";
import UserSettings from "./pages/dashboard/UserSettings";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderListings from "./pages/provider/ProviderListings";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderReviews from "./pages/provider/ProviderReviews";
import ProviderProfile from "./pages/provider/ProviderProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminListings from "./pages/admin/AdminListings";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/guides" element={<TourGuides />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/itinerary" element={<ItineraryPlanner />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/bookings" element={<UserBookings />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/dashboard/itineraries" element={<UserItineraries />} />
          <Route path="/dashboard/reviews" element={<UserReviews />} />
          <Route path="/dashboard/settings" element={<UserSettings />} />

          {/* Provider Dashboard */}
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/listings" element={<ProviderListings />} />
          <Route path="/provider/bookings" element={<ProviderBookings />} />
          <Route path="/provider/reviews" element={<ProviderReviews />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/listings" element={<AdminListings />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
