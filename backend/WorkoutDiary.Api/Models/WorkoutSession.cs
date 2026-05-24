namespace WorkoutDiary.Api.Models;

public class WorkoutSession
{
    public int Id { get; set; }
    public int PresetId { get; set; }
    public Preset? Preset { get; set; }

    public DateTime StartedAt { get; set; }
    public DateTime FinishedAt { get; set; }
    public string Note { get; set; } = string.Empty;

    public List<WorkoutSetResult> SetResults { get; set; } = new();
}
