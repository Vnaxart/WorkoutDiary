namespace WorkoutDiary.Api.Models;

public class PresetExercise
{
    public int Id { get; set; }
    public int PresetId { get; set; }
    public Preset? Preset { get; set; }

    public int ExerciseId { get; set; }
    public Exercise? Exercise { get; set; }

    public int Order { get; set; }
    public ExerciseType Type { get; set; }
    public int Sets { get; set; }
    public int? Repetitions { get; set; }
    public int? Seconds { get; set; }
}
