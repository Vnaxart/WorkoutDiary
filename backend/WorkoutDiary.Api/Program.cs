using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using WorkoutDiary.Api.Data;

// Базовая настройка API: БД, CORS для фронта и Swagger для ручной проверки контрактов.
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string DefaultConnection is missing.");

builder.WebHost.UseUrls(builder.Configuration["Urls"] ?? "http://localhost:5090");
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Workout Diary API",
        Version = "v1",
        Description = "API для управления упражнениями, пресетами и историей тренировок."
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     // На старте автоматически применяем миграции, чтобы локальная схема БД не отставала от кода.
//     var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//     db.Database.Migrate();
// }

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.DocumentTitle = "Workout Diary Swagger";
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Workout Diary API v1");
});

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();
app.Run();
