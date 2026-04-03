import api from "./api";

export type ServicePayload = {
  title: string;
  description: string;
  price: string | number;
  category: string;
  duration_minutes: number;
  lat?: number | null;
  lng?: number | null;
  is_active?: boolean;
};

export async function getNearbyServices(params: {
  lat: number;
  lng: number;
  radius: number;
  category?: string;
  min_price?: number;
  max_price?: number;
}) {
  const res = await api.get("/api/services/nearby/", { params });
  return res.data;
}

export async function getService(id: number) {
  const res = await api.get(`/api/services/${id}/`);
  return res.data;
}

export async function createService(payload: ServicePayload) {
  const res = await api.post("/api/services/", payload);
  return res.data;
}

export async function updateService(id: number, payload: Partial<ServicePayload>) {
  const res = await api.patch(`/api/services/${id}/`, payload);
  return res.data;
}

export async function getServiceReviews(serviceId: number) {
  const res = await api.get(`/api/reviews/service/${serviceId}/reviews/`);
  return res.data;
}

export async function getServiceRating(serviceId: number) {
  const res = await api.get(`/api/reviews/service/${serviceId}/rating/`);
  return res.data;
}

export async function submitServiceReview(serviceId: number, rating: number, comment: string) {
  const res = await api.post(`/api/reviews/service/${serviceId}/review/`, {
    rating,
    comment,
  });
  return res.data;
}
