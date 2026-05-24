namespace WorkoutDiary.Api.Models;

public class WorkoutSetResult
{
    public int Id { get; set; }
    public int WorkoutSessionId { get; set; }
    public WorkoutSession? WorkoutSession { get; set; }

    // Связь с упражнением в пресете (чтобы знать, что именно выполняли)
    public int PresetExerciseId { get; set; }
    public PresetExercise? PresetExercise { get; set; }

    public string ExerciseName { get; set; } = string.Empty;
    public ExerciseType Type { get; set; }
    public int SetNumber { get; set; }
    
    // Плановые значения (денормализованы для истории)
    public int? PlannedRepetitions { get; set; }
    public int? PlannedSeconds { get; set; }
    
    // Фактические значения
    public int? ActualRepetitions { get; set; }
    public int ActualSeconds { get; set; }
    
    // Временные метки подхода
    public DateTime StartedAt { get; set; }
    public DateTime FinishedAt { get; set; }
}