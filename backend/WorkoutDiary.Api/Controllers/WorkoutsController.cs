using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkoutDiary.Api.Data;
using WorkoutDiary.Api.Dto;
using WorkoutDiary.Api.Models;

namespace WorkoutDiary.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController : ControllerBase
{
    private readonly AppDbContext _db;

    public WorkoutsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<WorkoutSessionDto>>> GetByPeriod(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] string? search)
    {
        // История поддерживает фильтрацию сразу по периоду и по названию выбранного пресета.
        var query = _db.WorkoutSessions
            .Include(x => x.Preset)
            .Include(x => x.SetResults)
            .AsQueryable();

        if (from.HasValue) query = query.Where(x => x.StartedAt >= from.Value.Date);
        if (to.HasValue) query = query.Where(x => x.StartedAt < to.Value.Date.AddDays(1));

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim();
            query = query.Where(x => x.Preset != null && EF.Functions.Like(x.Preset.Name, $"%{searchTerm}%"));
        }

        var workouts = await query.OrderByDescending(x => x.StartedAt).ToListAsync();
        return Ok(workouts.Select(ToDto).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<WorkoutSessionDto>> GetById(int id)
    {
        var workout = await _db.WorkoutSessions
            .Include(x => x.Preset)
            .Include(x => x.SetResults)
            .FirstOrDefaultAsync(x => x.Id == id);

        return workout is null ? NotFound() : Ok(ToDto(workout));
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutSessionDto>> Create(CreateWorkoutSessionDto dto)
    {
        if (!await _db.Presets.AnyAsync(x => x.Id == dto.PresetId && !x.IsDeleted))
            return BadRequest("Пресет не найден.");

        if (dto.FinishedAt < dto.StartedAt)
            return BadRequest("Дата окончания не может быть раньше даты начала.");

        if (string.IsNullOrWhiteSpace(dto.Note))
            return BadRequest("После тренировки нужно оставить описание.");

        // После рефакторинга WorkoutSetResult отдельно проверяем, что факт выполнения пришёл в корректном формате.
        var validation = ValidateSetResults(dto.SetResults);
        if (validation is not null) return BadRequest(validation);

        var session = new WorkoutSession
        {
            PresetId = dto.PresetId,
            StartedAt = dto.StartedAt,
            FinishedAt = dto.FinishedAt,
            Note = dto.Note.Trim(),
            SetResults = dto.SetResults.Select(x => new WorkoutSetResult
            {
                PresetExerciseId = x.PresetExerciseId,
                ExerciseName = x.ExerciseName.Trim(),
                Type = x.Type,
                SetNumber = x.SetNumber,
                PlannedRepetitions = x.PlannedRepetitions,
                PlannedSeconds = x.PlannedSeconds,
                ActualRepetitions = x.ActualRepetitions,
                ActualSeconds = x.ActualSeconds
            }).ToList()
        };

        _db.WorkoutSessions.Add(session);
        await _db.SaveChangesAsync();

        var saved = await _db.WorkoutSessions
            .Include(x => x.Preset)
            .Include(x => x.SetResults)
            .FirstAsync(x => x.Id == session.Id);

        return CreatedAtAction(nameof(GetById), new { id = session.Id }, ToDto(saved));
    }

    private static WorkoutSessionDto ToDto(WorkoutSession session) => new(
        session.Id,
        session.PresetId,
        session.Preset?.Name ?? string.Empty,
        session.StartedAt,
        session.FinishedAt,
        session.Note,
        session.SetResults
            .OrderBy(x => x.Id)
            .Select(x => new WorkoutSetResultDto(
                x.Id,
                x.ExerciseName,
                x.Type,
                x.SetNumber,
                x.PlannedRepetitions,
                x.PlannedSeconds,
                x.ActualRepetitions,
                x.ActualSeconds))
            .ToList());

    private static string? ValidateSetResults(List<CreateWorkoutSetResultDto> setResults)
    {
        // Набор правил зависит от типа упражнения: для повторений нужен факт повторений,
        // для таймера не хотим принимать поля от другого типа.
        if (setResults.Count == 0)
            return "Тренировка должна содержать хотя бы один подход.";

        foreach (var result in setResults)
        {
            if (string.IsNullOrWhiteSpace(result.ExerciseName))
                return "Для каждого подхода нужно указать название упражнения.";

            if (result.SetNumber <= 0)
                return "Номер подхода должен быть больше нуля.";

            if (result.ActualSeconds <= 0)
                return "Фактическая длительность подхода должна быть больше нуля.";

            if (result.Type == ExerciseType.Repetitions)
            {
                if (!result.PlannedRepetitions.HasValue || result.PlannedRepetitions <= 0)
                    return "Для упражнений на повторения нужно указать план по повторениям.";

                if (!result.ActualRepetitions.HasValue || result.ActualRepetitions <= 0)
                    return "Для упражнений на повторения нужно указать фактические повторения.";
            }

            if (result.Type == ExerciseType.Time)
            {
                if (!result.PlannedSeconds.HasValue || result.PlannedSeconds <= 0)
                    return "Для упражнений на время нужно указать план в секундах.";

                if (result.ActualRepetitions.HasValue)
                    return "Для упражнений на время не нужно передавать фактические повторения.";
            }
        }

        return null;
    }
}