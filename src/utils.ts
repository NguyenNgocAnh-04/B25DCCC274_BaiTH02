import type { Unit } from './types';

export const toUnit = (c: number, unit: Unit): number =>
  Math.round(unit === 'C' ? c : (c * 9) / 5 + 32);

export const fmtTemp = (c: number, unit: Unit): string => `${toUnit(c, unit)}°${unit}`;

// Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu
export const normalize = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const pad = (n: number) => String(n).padStart(2, '0');

export function dayLabel(date: string): { weekday: string; short: string } {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return { weekday: WEEKDAYS[dt.getDay()], short: `${pad(d)}/${pad(m)}` };
}

// "2026-11-07T14:15" -> "14:15 ngày 07/11/2026"
export function fmtUpdated(time: string): string {
  const [d, t] = time.split('T');
  const [y, m, day] = d.split('-');
  return `${t} ngày ${day}/${m}/${y}`;
}

const FAV_KEY = 'weather_favs';
const UNIT_KEY = 'weather_unit';

export function loadFavs(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const v: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveFavs(ids: string[]): void {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  } catch {
    /* bỏ qua nếu trình duyệt chặn localStorage */
  }
}

export function loadUnit(): Unit {
  try {
    return localStorage.getItem(UNIT_KEY) === 'F' ? 'F' : 'C';
  } catch {
    return 'C';
  }
}

export function saveUnit(u: Unit): void {
  try {
    localStorage.setItem(UNIT_KEY, u);
  } catch {
    /* bỏ qua */
  }
}
