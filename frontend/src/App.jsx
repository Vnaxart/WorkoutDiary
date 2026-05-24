import { useEffect, useState } from 'react';
import { Activity, BookOpen, Dumbbell, History, ListChecks } from 'lucide-react';
import { api } from './api';
import ExercisesPage from './components/ExercisesPage';
import PresetsPage from './components/PresetsPage';
import WorkoutPage from './components/WorkoutPage';
import HistoryPage from './components/HistoryPage';

const tabs = [
  { id: 'exercises', label: 'Упражнения', icon: Dumbbell },
  { id: 'presets', label: 'Пресеты', icon: ListChecks },
  { id: 'workout', label: 'Тренировка', icon: Activity },
  { id: 'history', label: 'История', icon: History },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('exercises');
  const [exercises, setExercises] = useState([]);
  const [presets, setPresets] = useState([]);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setError('');
      // Упражнения и пресеты нужны сразу нескольким вкладкам, поэтому загружаем их централизованно здесь.
      const [exercisesData, presetsData] = await Promise.all([api.getExercises(), api.getPresets()]);
      setExercises(exercisesData);
      setPresets(presetsData);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow"><BookOpen size={16} /> веб-приложение</p>
          <h1>Дневник тренировок</h1>
          <p>Создавайте упражнения и пресеты, проходите тренировку по шагам и отслеживайте прогресс.</p>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              <Icon size={18} /> {tab.label}
            </button>
          );
        })}
      </nav>

      {error && <div className="error">{error}</div>}

      <main>
        {activeTab === 'exercises' && <ExercisesPage exercises={exercises} onChanged={loadData} />}
        {activeTab === 'presets' && <PresetsPage exercises={exercises} presets={presets} onChanged={loadData} />}
        {activeTab === 'workout' && <WorkoutPage presets={presets} onWorkoutSaved={loadData} />}
        {activeTab === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}
