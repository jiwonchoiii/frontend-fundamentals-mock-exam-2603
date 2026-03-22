import Axios from 'axios';
import { http } from 'pages/http';
import {
  CreateReservationRequest,
  CreateReservationSuccessResponse,
  ReservationApiErrorResponse,
  Reservation,
  Room,
} from 'pages/components/reservationDomain';

export function getRooms() {
  return http.get<Room[]>('/api/rooms');
}

export function getReservations(date: string) {
  return http.get<Reservation[]>(`/api/reservations?date=${date}`);
}

export function createReservation(data: CreateReservationRequest) {
  return http.post<CreateReservationRequest, CreateReservationSuccessResponse>('/api/reservations', data);
}

export function getMyReservations() {
  return http.get<Reservation[]>('/api/my-reservations');
}

export function cancelReservation(id: string) {
  return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}

export function getApiErrorMessage(error: unknown, fallback = '요청에 실패했습니다.') {
  if (!Axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as ReservationApiErrorResponse | undefined;
  return data?.message ?? fallback;
}
