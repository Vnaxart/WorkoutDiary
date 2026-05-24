using WorkoutDiary.Api.Models;

namespace WorkoutDiary.Api.Dto;

public record PresetDto(int Id, string Name, bool IsDeleted, List<PresetItemDto> Items);

public record PresetItemDto(
    int Id,
    int ExerciseId,
    string ExerciseName,
    string ExerciseDescription,
    int Order,
    ExerciseType Type,
    int Sets,
    int? Repetitions,
    int? Seconds);

public record UpsertPresetDto(string Name, List<UpsertPresetItemDto> Items);

public record UpsertPresetItemDto(
    int ExerciseId,
    int Order,
    ExerciseType Type,
    int Sets,
    int? Repetitions,
    int? Seconds);
