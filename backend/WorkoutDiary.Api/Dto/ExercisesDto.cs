namespace WorkoutDiary.Api.Dto;

public record ExerciseDto(int Id, string Name, string Description);
public record UpsertExerciseDto(string Name, string Description);
