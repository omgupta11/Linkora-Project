import api from "./api";

export type BookingRow = {
  id: number;
  service: number;
  service_title: string;
  provider_business_name?: string;
  consumer_email?: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  payment_status?: string;
  payment_method?: string;
};

export async function getMyBookings() {
  const res = await api.get<BookingRow[]>("/api/bookings/my/");
  return res.data;
}

export async function getProviderBookings() {
  const res = await api.get<BookingRow[]>("/api/bookings/provider/");
  return res.data;
}

export async function createBooking(serviceId: number, paymentMethod?: string, paymentStatus?: string) {
  const payload: any = { service_id: serviceId };
  if (paymentMethod) payload.payment_method = paymentMethod;
  if (paymentStatus) payload.payment_status = paymentStatus;
  const res = await api.post<BookingRow>("/api/bookings/", payload);
  return res.data;
}

export async function getBooking(bookingId: number) {
  const res = await api.get<BookingRow>(`/api/bookings/${bookingId}/`);
  return res.data;
}

export async function patchBookingStatus(bookingId: number, status: string) {
  const res = await api.patch<BookingRow>(`/api/bookings/${bookingId}/status/`, { status });
  return res.data;
}
