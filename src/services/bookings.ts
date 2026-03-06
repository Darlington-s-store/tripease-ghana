import { apiClient } from './api';

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface Review {
  id: string;
  booking_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  trip_id?: string;
  booking_type: 'hotel' | 'guide' | 'activity';
  reference_id: string;
  check_in_date?: string;
  check_out_date?: string;
  total_price: number;
  number_of_guests?: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  payment?: Payment;
  review?: Review;
}

export interface CreateBookingData {
  tripId?: string;
  bookingType: 'hotel' | 'guide' | 'activity';
  referenceId: string;
  checkInDate?: string;
  checkOutDate?: string;
  totalPrice: number;
  numberOfGuests?: number;
  specialRequests?: string;
}

export const bookingsService = {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await apiClient.post<Booking>('/bookings', data);
    return response.data!;
  },

  async getBookings(status?: string): Promise<Booking[]> {
    const response = await apiClient.get<Booking[]>('/bookings', { status });
    return response.data || [];
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data!;
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const response = await apiClient.put<Booking>(`/bookings/${id}/status`, { status });
    return response.data!;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await apiClient.put<Booking>(`/bookings/${id}/cancel`, {});
    return response.data!;
  },

  async getAllBookings(status?: string, limit?: number, offset?: number): Promise<Booking[]> {
    const response = await apiClient.get<Booking[]>('/bookings', { admin: true, status, limit, offset });
    return response.data || [];
  },
};
