import { useState } from 'react';
import { api } from '../api';
import { formatSetCount, getDefaultHistoryFilters } from '../utils/workout';

export default function HistoryPage() {
  const defaults = getDefaultHistoryFilters();
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [search, setSearch] = useState(defaults.search);
  const [items, setItems] = useState([]);

  async function load() {
    // История теперь фильтруется и по периоду, и по названию пресета.
    const data = await api.getWorkouts(from, to, search);
    setItems(data);
  }

  function resetFilters() {
    const nextDefaults = getDefaultHistoryFilters();
    setFrom(nextDefaults.from);
    setTo(nextDefaults.to);
    setSearch(nextDefaults.search);
  }

  return (
    <section className="card">
      <h2>История тренировок</h2>
      <div className="filters history-filters">
        <input
          className="search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по названию пресета"
        />
        <label>С</label>
        <input className="date-input" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        <label>По</label>
        <input className="date-input" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        <button type="button" className="secondary" onClick={resetFilters}>
          Сбросить
        </button>
        <button onClick={load}>Показать</button>
      </div>

      <div className="list">
        {items.map((workout) => (
          <article className="list-item" key={workout.id}>
            <div>
              <h3>{workout.presetName}</h3>
              <p>{new Date(workout.startedAt).toLocaleString()} - {new Date(workout.finishedAt).toLocaleString()}</p>
              <p><b>Описание:</b> {workout.note}</p>
              <p className="muted">Выполнено: {formatSetCount(workout.setResults.length)}</p>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="muted">Выберите период и нажмите «Показать».</p>}
      </div>
    </section>
  );
}
