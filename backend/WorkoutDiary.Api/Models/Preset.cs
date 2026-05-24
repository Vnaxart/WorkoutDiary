namespace WorkoutDiary.Api.Models;

public class Preset
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }

    public List<PresetExercise> Items { get; set; } = new();
    public List<WorkoutSession> WorkoutSessions { get; set; } = new();
}
