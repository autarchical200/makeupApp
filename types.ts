export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  imageUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  level: 'Junior' | 'Senior' | 'Master';
  rating: number;
  imageUrl: string;
}

export enum BookingStatus {
  PENDING = 'Chờ xác nhận',
  CONFIRMED = 'Đã xác nhận',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã hủy'
}

export interface Booking {
  id: string;
  serviceId: string;
  artistId: string;
  customerName: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: BookingStatus;
  createdAt: number;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
