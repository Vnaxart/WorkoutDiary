import { useState } from 'react';
import { api } from '../api';
import {
  EXERCISE_TYPE_REPETITIONS,
  EXERCISE_TYPE_TIME,
  formatApproaches,
  formatDuration,
  pluralizeRussian,
  getDefaultPresetItem,
  applyPresetItemTypeDefaults,
} from '../utils/workout';

export default function PresetsPage({ exercises, presets, onChanged }) {
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setName('');
    setItems([]);
    setEditingId(null);
  }

  function addItem() {
    if (exercises.length === 0) return;
    setItems([...items, getDefaultPresetItem(exercises[0].id, items.length + 1)]);
  }

  function updateItem(index, patch) {
    setItems(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index) {
    setItems(items.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({
      ...item,
      order: itemIndex + 1,
    })));
  }

  function editPreset(preset) {
    setEditingId(preset.id);
    setName(preset.name);
    setItems(preset.items.map((item) => ({
        id: item.id,
        exerciseId: item.exerciseId,
        order: item.order,
        type: item.type,
        sets: item.sets,
        repetitions: item.repetitions,
        seconds: item.seconds,
    })));
}

async function submit(event) {
    event.preventDefault();

    const payload = { name, items };
    let response;
    
    if (editingId) {
        response = await api.updatePreset(editingId, payload);
        console.log('📦 Обновлённый пресет с бэкенда:', response);
    } else {
        response = await api.createPreset(payload);
        console.log('📦 Созданный пресет с бэкенда:', response);
    }

    resetForm();
    await onChanged();
}

  async function removePreset(id) {
    if (!confirm('Удалить пресет?')) return;

    await api.deletePreset(id);

    if (editingId === id) resetForm();
    await onChanged();
  }

  return (
    <section className="grid two">
      <div className="card wide">
        <h2>{editingId ? 'Редактировать пресет' : 'Создать пресет'}</h2>
        <form onSubmit={submit} className="form">
          <label>Название пресета</label>
          <input value={name} onChange={(event) => setName(event.target.value)} required />

          <div className="section-title">
            <h3>Упражнения в пресете</h3>
            <button type="button" className="secondary" onClick={addItem} disabled={exercises.length === 0}>
              Добавить упражнение
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="preset-editor-row">
              <select
                value={item.exerciseId}
                onChange={(event) => updateItem(index, { exerciseId: Number(event.target.value) })}
              >
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
              <select
                value={item.type}
                onChange={(event) => updateItem(index, applyPresetItemTypeDefaults(Number(event.target.value), item))}
              >
                <option value={EXERCISE_TYPE_REPETITIONS}>Повторения</option>
                <option value={EXERCISE_TYPE_TIME}>Время</option>
              </select>
              <input
                type="number"
                min="1"
                value={item.sets}
                onChange={(event) => updateItem(index, { sets: Number(event.target.value) })}
                placeholder="Подходы"
              />
              {item.type === EXERCISE_TYPE_REPETITIONS ? (
                <input
                  type="number"
                  min="1"
                  value={item.repetitions || ''}
                  onChange={(event) => updateItem(index, { repetitions: Number(event.target.value) })}
                  placeholder="Повторы"
                />
              ) : (
                <input
                  type="number"
                  min="1"
                  value={item.seconds || ''}
                  onChange={(event) => updateItem(index, { seconds: Number(event.target.value) })}
                  placeholder="Секунды"
                />
              )}
              <button type="button" className="danger" onClick={() => removeItem(index)}>
                ×
              </button>
            </div>
          ))}

          <div className="actions">
            <button type="submit" disabled={items.length === 0}>
              {editingId ? 'Сохранить пресет' : 'Создать пресет'}
            </button>
            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Готовые пресеты</h2>
        <div className="list">
          {presets.map((preset) => (
            <article className="list-item" key={preset.id}>
              <div>
                <h3>{preset.name}</h3>
                <p>Упражнения:</p>
                <ol>
                  {preset.items.map((item) => (
                    <li key={item.id}>
                      {item.exerciseName}: {formatApproaches(item.sets)} ×{' '}
                      {item.type === EXERCISE_TYPE_REPETITIONS
                        ? `${item.repetitions} ${pluralizeRussian(item.repetitions, 'повторение', 'повторения', 'повторений')}`
                        : formatDuration(item.seconds)}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="row-actions">
                <button className="secondary" onClick={() => editPreset(preset)}>
                  Изменить
                </button>
                <button className="danger" onClick={() => removePreset(preset.id)}>
                  Удалить
                </button>
              </div>
            </article>
          ))}
          {presets.length === 0 && <p className="muted">Пока нет пресетов.</p>}
        </div>
      </div>
    </section>
  );
}