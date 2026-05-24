using Microsoft.EntityFrameworkCore;
using WorkoutDiary.Api.Models;

namespace WorkoutDiary.Api.Data;

// Централизованное описание схемы БД и поведения связей между сущностями.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<Preset> Presets => Set<Preset>();
    public DbSet<PresetExercise> PresetExercises => Set<PresetExercise>();
    public DbSet<WorkoutSession> WorkoutSessions => Set<WorkoutSession>();
    public DbSet<WorkoutSetResult> WorkoutSetResults => Set<WorkoutSetResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Description).HasColumnType("text").IsRequired();
        });

        modelBuilder.Entity<Preset>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            // Вместо физического удаления пресет помечается как скрытый для новых тренировок.
            entity.Property(x => x.IsDeleted).HasDefaultValue(false);
            entity.HasMany(x => x.Items).WithOne(x => x.Preset).HasForeignKey(x => x.PresetId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PresetExercise>(entity =>
        {
            entity.Property(x => x.Type).HasConversion<string>().HasMaxLength(20);
            entity.HasOne(x => x.Exercise).WithMany(x => x.PresetItems).HasForeignKey(x => x.ExerciseId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<WorkoutSession>(entity =>
        {
            entity.Property(x => x.Note).HasColumnType("text");
            entity.HasOne(x => x.Preset).WithMany(x => x.WorkoutSessions).HasForeignKey(x => x.PresetId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.SetResults).WithOne(x => x.WorkoutSession).HasForeignKey(x => x.WorkoutSessionId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<WorkoutSetResult>(entity =>
        {
            // История хранения сделана самодостаточной: имя упражнения и факт выполнения живут в результате,
            // даже если исходный пресет позже изменится или будет скрыт.
            entity.Property(x => x.Type).HasConversion<string>().HasMaxLength(20);
            entity.Property(x => x.ExerciseName).HasMaxLength(120).IsRequired();
        });
    }
}
