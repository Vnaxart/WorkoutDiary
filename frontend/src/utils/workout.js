export const EXERCISE_TYPE_REPETITIONS = 1;
export const EXERCISE_TYPE_TIME = 2;

// Общие утилиты для пресетов, тренировки и истории собраны здесь,
// чтобы одинаковые правила не расходились между страницами.
export function pluralizeRussian(count, one, few, many) {
  const absCount = Math.abs(count) % 100;
  const lastDigit = absCount % 10;

  if (absCount > 10 && absCount < 20) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
}

export function formatSetCount(count) {
  return `${count} ${pluralizeRussian(count, 'подход', 'подхода', 'подходов')}`;
}

export function getDefaultPresetItem(exerciseId, order) {
  return {
    exerciseId,
    order,
    type: EXERCISE_TYPE_REPETITIONS,
    sets: 3,
    repetitions: 10,
    seconds: null,
  };
}

export function applyPresetItemTypeDefaults(type, currentItem = {}) {
  // При смене типа упражнения очищаем поле другого типа, чтобы не отправлять мусор на бэк.
  if (type === EXERCISE_TYPE_TIME) {
    return {
      ...currentItem,
      type,
      repetitions: null,
      seconds: currentItem.seconds ?? 60,
    };
  }

  return {
    ...currentItem,
    type,
    repetitions: currentItem.repetitions ?? 10,
    seconds: null,
  };
}

export function createWorkoutResult(step, startedAt, finishedAt, actualRepetitions) {
    return {
        presetExerciseId: step.presetExerciseId,  // ← БЕРЁМ ИЗ step
        exerciseName: step.exerciseName,
        type: step.type,
        setNumber: step.setNumber,
        plannedRepetitions: step.repetitions,
        plannedSeconds: step.seconds,
        actualRepetitions: step.type === EXERCISE_TYPE_REPETITIONS ? actualRepetitions : null,
        actualSeconds: Math.max(1, Math.round((finishedAt - startedAt) / 1000)),
    };
}

export function getDefaultHistoryFilters() {
  const today = new Date().toISOString().slice(0, 10);

  return {
    from: today,
    to: today,
    search: '',
  };
}


// Форматирует подходы с правильным склонением
// Пример: formatApproaches(3) → "3 подхода"
export function formatApproaches(count) {
  return `${count} ${pluralizeRussian(count, 'подход', 'подхода', 'подходов')}`;
}


// Форматирует повторения с правильным склонением
// Пример: formatRepetitions(15) → "15 повторений"

export function formatRepetitions(count) {
  return `${count} ${pluralizeRussian(count, 'повторение', 'повторения', 'повторений')}`;
}


// Форматирует секунды с правильным склонением
// Пример: formatSeconds(30) → "30 секунд"

export function formatSeconds(count) {
  return `${count} ${pluralizeRussian(count, 'секунда', 'секунды', 'секунд')}`;
}


// Форматирует минуты с правильным склонением
// Пример: formatMinutes(3) → "3 минуты"

export function formatMinutes(count) {
  return `${count} ${pluralizeRussian(count, 'минута', 'минуты', 'минут')}`;
}


// Форматирует время (секунды) в читаемый формат с минутами и секундами
// Пример: formatDuration(125) → "2 минуты 5 секунд"

export function formatDuration(seconds) {
  if (seconds < 60) {
    return formatSeconds(seconds);
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return formatMinutes(minutes);
  }
  
  return `${formatMinutes(minutes)} ${formatSeconds(remainingSeconds)}`;
}


// Форматирует упражнение в пресете для отображения
// Пример: formatExerciseDisplay(item) → "3 подхода по 15 повторений"

export function formatExerciseDisplay(item) {
  const setText = formatApproaches(item.sets);
  
  if (item.type === EXERCISE_TYPE_REPETITIONS) {
    const repsText = formatRepetitions(item.repetitions);
    return `${setText} по ${repsText}`;
  }
  
  // тип "время"
  const timeText = formatSeconds(item.seconds);
  return `${setText} по ${timeText}`;
}