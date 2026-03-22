export type Equipment = 'tv' | 'whiteboard' | 'video' | 'speaker';

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: Equipment[];
}

export interface Reservation {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}

export interface CreateReservationRequest {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}

export type ReservationErrorCode = 'CONFLICT' | 'INVALID' | 'NOT_FOUND';

export interface CreateReservationSuccessResponse {
  ok: true;
  reservation: Reservation;
}

export interface ReservationApiErrorResponse {
  ok: false;
  code: ReservationErrorCode;
  message: string;
}

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

export const ALL_EQUIPMENT: Equipment[] = ['tv', 'whiteboard', 'video', 'speaker'];

export const TIMELINE_START_HOUR = 9;
export const TIMELINE_END_HOUR = 20;

export const TIME_SLOTS: string[] = [];
for (let hour = TIMELINE_START_HOUR; hour <= TIMELINE_END_HOUR; hour++) {
  TIME_SLOTS.push(`${String(hour).padStart(2, '0')}:00`);
  if (hour < TIMELINE_END_HOUR) {
    TIME_SLOTS.push(`${String(hour).padStart(2, '0')}:30`);
  }
}

export const HOUR_LABELS = TIME_SLOTS.filter(time => time.endsWith(':00'));
export const START_TIME_OPTIONS = TIME_SLOTS.slice(0, -1);
export const END_TIME_OPTIONS = TIME_SLOTS.slice(1);

export const TOTAL_TIMELINE_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function timeToTimelineMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return (hour - TIMELINE_START_HOUR) * 60 + minute;
}
