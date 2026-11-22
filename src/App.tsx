import { useEffect, useState } from 'react';
import { CITIES } from './cities';
import { fetchWeather, themeOf } from './weather';
import { loadFavs, loadUnit, saveFavs, saveUnit } from './utils';
import type { LoadState, Unit } from './types';
import CityList from './components/CityList';
import WeatherPanel from './components/WeatherPanel';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unit, setUnit] = useState<Unit>(loadUnit);
  const [favs, setFavs] = useState<string[]>(loadFavs);
  const [state, setState] = useState<LoadState>({ status: 'idle' });
  const [tick, setTick] = useState(0);

  const city = CITIES.find((c) => c.id === selectedId) ?? null;

  // Chỉ gọi API khi đổi thành phố hoặc bấm "Thử lại". Đổi °C/°F KHÔNG nằm trong deps.
  useEffect(() => {
    if (!city) {
      setState({ status: 'idle' });
      return;
    }
    const ctrl = new AbortController();
    setState({ status: 'loading' });
    fetchWeather(city, ctrl.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((e: Error) => {
        if (ctrl.signal.aborted) return;
        setState({ status: 'error', message: e.message });
      });
    return () => ctrl.abort();
  }, [city, tick]);

  const changeUnit = (u: Unit) => {
    setUnit(u);
    saveUnit(u);
  };

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveFavs(next);
      return next;
    });
  };

  const theme = state.status === 'success' ? themeOf(state.data.current.code) : 'idle';

  return (
    <div className={`app theme-${theme}`}>
      <header className="top">
        <h1>Thời tiết Việt Nam</h1>
        <div className="unit" role="group" aria-label="Đơn vị nhiệt độ">
          {(['C', 'F'] as Unit[]).map((u) => (
            <button key={u} className={unit === u ? 'on' : ''} aria-pressed={unit === u} onClick={() => changeUnit(u)}>
              °{u}
            </button>
          ))}
        </div>
      </header>

      <div className="layout">
        <CityList cities={CITIES} selectedId={selectedId} favs={favs} onSelect={setSelectedId} onToggleFav={toggleFav} />
        <WeatherPanel city={city} state={state} unit={unit} onRetry={() => setTick((t) => t + 1)} />
      </div>

      <footer className="foot">Dữ liệu: Open-Meteo.com</footer>
    </div>
  );
}
