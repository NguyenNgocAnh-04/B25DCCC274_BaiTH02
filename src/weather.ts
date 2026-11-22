import type { City, Theme, Weather } from './types';

interface ApiResponse {
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export async function fetchWeather(city: City, signal: AbortSignal): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;

  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (e) {
    if (signal.aborted) throw e;
    throw new Error('Không kết nối được tới Open-Meteo. Hãy kiểm tra mạng rồi thử lại.');
  }
  if (!res.ok) throw new Error(`Open-Meteo trả về lỗi ${res.status}. Hãy thử lại sau ít phút.`);

  const j = (await res.json()) as ApiResponse;
  if (!j.current || !j.daily) throw new Error('Dữ liệu trả về không hợp lệ.');

  const c = j.current;
  const d = j.daily;
  return {
    current: {
      time: c.time,
      temp: c.temperature_2m,
      humidity: c.relative_humidity_2m,
      wind: c.wind_speed_10m,
      code: c.weather_code,
    },
    days: d.time.map((date, i) => ({
      date,
      code: d.weather_code[i],
      max: d.temperature_2m_max[i],
      min: d.temperature_2m_min[i],
    })),
  };
}

export function describe(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Trời quang', icon: '☀️' };
  if (code === 1) return { label: 'Gần như quang đãng', icon: '🌤️' };
  if (code === 2) return { label: 'Có mây rải rác', icon: '⛅' };
  if (code === 3) return { label: 'Nhiều mây', icon: '☁️' };
  if (code === 45 || code === 48) return { label: 'Sương mù', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { label: 'Mưa phùn', icon: '🌦️' };
  if (code === 56 || code === 57) return { label: 'Mưa phùn lạnh', icon: '🌦️' };
  if (code === 61) return { label: 'Mưa nhỏ', icon: '🌧️' };
  if (code === 63) return { label: 'Mưa vừa', icon: '🌧️' };
  if (code === 65) return { label: 'Mưa to', icon: '🌧️' };
  if (code === 66 || code === 67) return { label: 'Mưa lạnh', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { label: 'Tuyết', icon: '🌨️' };
  if (code >= 80 && code <= 82) return { label: 'Mưa rào', icon: '🌦️' };
  if (code === 85 || code === 86) return { label: 'Tuyết rào', icon: '🌨️' };
  if (code === 95) return { label: 'Dông', icon: '⛈️' };
  if (code === 96 || code === 99) return { label: 'Dông kèm mưa đá', icon: '⛈️' };
  return { label: 'Không xác định', icon: '🌡️' };
}

export function themeOf(code: number): Theme {
  if (code <= 1) return 'clear';
  if (code <= 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 95) return 'storm';
  if (code >= 51) return 'rain';
  return 'cloudy';
}
