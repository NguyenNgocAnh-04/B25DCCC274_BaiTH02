import { useMemo, useState } from 'react';
import type { City } from '../types';
import { normalize } from '../utils';

interface Props {
  cities: City[];
  selectedId: string | null;
  favs: string[];
  onSelect: (id: string) => void;
  onToggleFav: (id: string) => void;
}

export default function CityList({ cities, selectedId, favs, onSelect, onToggleFav }: Props) {
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const key = normalize(q);
    const found = cities.filter((c) => normalize(c.name).includes(key));
    // Thành phố yêu thích đứng trước, giữ nguyên thứ tự còn lại
    return [...found].sort((a, b) => Number(favs.includes(b.id)) - Number(favs.includes(a.id)));
  }, [cities, q, favs]);

  return (
    <aside className="cities">
      <label htmlFor="search" className="sr">Tìm thành phố</label>
      <input
        id="search"
        type="search"
        placeholder="Tìm thành phố (vd: da nang)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {list.length === 0 ? (
        <p className="muted pad">Không có thành phố nào khớp với “{q}”.</p>
      ) : (
        <ul>
          {list.map((c) => {
            const fav = favs.includes(c.id);
            const active = c.id === selectedId;
            return (
              <li key={c.id} className={active ? 'active' : ''}>
                <button className="city-btn" aria-current={active ? 'true' : undefined} onClick={() => onSelect(c.id)}>
                  {c.name}
                </button>
                <button
                  className={fav ? 'star on' : 'star'}
                  aria-pressed={fav}
                  aria-label={fav ? `Bỏ yêu thích ${c.name}` : `Thêm ${c.name} vào yêu thích`}
                  onClick={() => onToggleFav(c.id)}
                >
                  {fav ? '★' : '☆'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
