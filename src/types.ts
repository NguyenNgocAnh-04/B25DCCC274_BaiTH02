export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export type Unit = 'C' | 'F';

export interface Current {
  time: string;
  temp: number; // luôn lưu °C, chỉ đổi khi hiển thị
  humidity: number;
  wind: number;
  code: number;
}

export interface Day {
  date: string;
  code: number;
  max: number;
  min: number;
}

export interface Weather {
  current: Current;
  days: Day[];
}

export type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Weather };

export type Theme = 'idle' | 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog';
