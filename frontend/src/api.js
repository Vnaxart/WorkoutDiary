const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname || '127.0.0.1'}:5090`;

// Единая обёртка над fetch, чтобы все страницы одинаково обрабатывали ошибки API.
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Ошибка запроса: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // API сгруппирован по смысловым блокам экрана: упражнения, пресеты, история тренировок.
  getExercises: () => request('/api/exercises'),
  createExercise: (data) => request('/api/exercises', { method: 'POST', body: JSON.stringify(data) }),
  updateExercise: (id, data) => request(`/api/exercises/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExercise: (id) => request(`/api/exercises/${id}`, { method: 'DELETE' }),

  getPresets: () => request('/api/presets'),
  createPreset: (data) => request('/api/presets', { method: 'POST', body: JSON.stringify(data) }),
  updatePreset: (id, data) => request(`/api/presets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePreset: (id) => request(`/api/presets/${id}`, { method: 'DELETE' }),

  getWorkouts: (from, to, search) =>
    request(
      `/api/workouts?from=${encodeURIComponent(from || '')}&to=${encodeURIComponent(to || '')}&search=${encodeURIComponent(search || '')}`,
    ),
  saveWorkout: (data) => request('/api/workouts', { method: 'POST', body: JSON.stringify(data) }),
};
