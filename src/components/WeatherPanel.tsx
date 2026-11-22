import type { City, LoadState, Unit } from '../types';
import { describe } from '../weather';
import { dayLabel, fmtTemp, fmtUpdated } from '../utils';

interface Props {
  city: City | null;
  state: LoadState;
  unit: Unit;
  onRetry: () => void;
}

export default function WeatherPanel({ city, state, unit, onRetry }: Props) {
  if (!city || state.status === 'idle') {
    return (
      <section className="panel center">
        <p className="big-icon" aria-hidden="true">🧭</p>
        <h2>Chưa chọn thành phố</h2>
        <p className="muted">Hãy chọn một thành phố ở danh sách để xem thời tiết.</p>
      </section>
    );
  }

  if (state.status === 'loading') {
    return (
      <section className="panel center" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>Đang tải thời tiết {city.name}...</p>
      </section>
    );
  }

  if (state.status === 'error') {
    return (
      <section className="panel center error" role="alert">
        <h2>Không tải được dữ liệu</h2>
        <p>{state.message}</p>
        <button className="retry" onClick={onRetry}>Thử lại</button>
      </section>
    );
  }

  const { current, days } = state.data;
  const info = describe(current.code);

  return (
    <section className="panel">
      <div className="now">
        <div>
          <h2>{city.name}</h2>
          <p className="desc">{info.label}</p>
          <p className="temp">{fmtTemp(current.temp, unit)}</p>
        </div>
        <span className="now-icon" role="img" aria-label={info.label}>{info.icon}</span>
      </div>

      <dl className="stats">
        <div><dt>Độ ẩm</dt><dd>{current.humidity}%</dd></div>
        <div><dt>Tốc độ gió</dt><dd>{current.wind} km/h</dd></div>
        <div><dt>Cập nhật lúc</dt><dd>{fmtUpdated(current.time)}</dd></div>
      </dl>

      <h3>Dự báo 7 ngày</h3>
      <ul className="forecast">
        {days.map((d, i) => {
          const l = dayLabel(d.date);
          const di = describe(d.code);
          return (
            <li key={d.date}>
              <span className="day">
                <strong>{i === 0 ? 'Hôm nay' : l.weekday}</strong>
                <small>{l.short}</small>
              </span>
              <span className="f-icon" role="img" aria-label={di.label} title={di.label}>{di.icon}</span>
              <span className="range">
                <b>{fmtTemp(d.max, unit)}</b>
                <span className="lo">{fmtTemp(d.min, unit)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
