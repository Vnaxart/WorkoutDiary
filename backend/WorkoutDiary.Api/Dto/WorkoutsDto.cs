using WorkoutDiary.Api.Models;

namespace WorkoutDiary.Api.Dto;

public record CreateWorkoutSessionDto(
    int PresetId,
    DateTime StartedAt,
    DateTime FinishedAt,
    string Note,
    List<CreateWorkoutSetResultDto> SetResults);

public record CreateWorkoutSetResultDto(
    int PresetExerciseId,  // ← ДОБАВИТЬ ЭТУ СТРОКУ (первым полем)
    string ExerciseName,
    ExerciseType Type,
    int SetNumber,
    int? PlannedRepetitions,
    int? PlannedSeconds,
    int? ActualRepetitions,
    int ActualSeconds);

public record WorkoutSessionDto(
    int Id,
    int PresetId,
    string PresetName,
    DateTime StartedAt,
    DateTime FinishedAt,
    string Note,
    List<WorkoutSetResultDto> SetResults);

public record WorkoutSetResultDto(
    int Id,
    string ExerciseName,
    ExerciseType Type,
    int SetNumber,
    int? PlannedRepetitions,
    int? PlannedSeconds,
    int? ActualRepetitions,
    int ActualSeconds);