using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ProjetoTarefas.Data;
using ProjetoTarefas.Profiles;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=projetotarefas.db"));

builder.Services.AddAutoMapper(typeof(MappingProfile));

// JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ProjetoTarefas API",
        Version = "v1",
        Description = "API para gerenciamento de projetos e tarefas"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Exemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    db.Database.ExecuteSqlRaw(@"
        CREATE TABLE IF NOT EXISTS ""TaskHistories"" (
            ""Id""           INTEGER NOT NULL CONSTRAINT ""PK_TaskHistories"" PRIMARY KEY AUTOINCREMENT,
            ""TaskId""       INTEGER NOT NULL,
            ""FieldChanged"" TEXT    NOT NULL,
            ""OldValue""     TEXT    NULL,
            ""NewValue""     TEXT    NULL,
            ""ChangedAt""    TEXT    NOT NULL,
            CONSTRAINT ""FK_TaskHistories_Tasks_TaskId""
                FOREIGN KEY (""TaskId"") REFERENCES ""Tasks"" (""Id"") ON DELETE CASCADE
        )
    ");

    db.Database.ExecuteSqlRaw(@"
        CREATE INDEX IF NOT EXISTS ""IX_TaskHistories_TaskId""
        ON ""TaskHistories"" (""TaskId"")
    ");

    db.Database.ExecuteSqlRaw(@"
        CREATE TABLE IF NOT EXISTS ""Users"" (
            ""Id""           INTEGER NOT NULL CONSTRAINT ""PK_Users"" PRIMARY KEY AUTOINCREMENT,
            ""Name""         TEXT    NOT NULL,
            ""Email""        TEXT    NOT NULL,
            ""PasswordHash"" TEXT    NOT NULL,
            ""CreatedAt""    TEXT    NOT NULL
        )
    ");

    db.Database.ExecuteSqlRaw(@"
        CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Users_Email""
        ON ""Users"" (""Email"")
    ");
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProjetoTarefas API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
