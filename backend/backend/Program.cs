using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using backend.Data;
using backend.Models;
using backend.Services;
using backend.Utils.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "SuperSecretKeyForFluxturTravelAgency2026!";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        RoleClaimType = "role",
        NameClaimType = "nome",
        ClockSkew = TimeSpan.FromMinutes(5)
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = ctx =>
        {
            var authHeader = ctx.Request.Headers["Authorization"].ToString();
            Console.WriteLine($"[JWT HEADER RECEBIDO]: '{authHeader}'");
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = ctx =>
        {
            Console.WriteLine($"[JWT FAIL] {ctx.Exception.Message}");
            return Task.CompletedTask;
        },
        OnForbidden = ctx =>
        {
            var claims = ctx.Principal?.Claims.Select(c => $"{c.Type}: {c.Value}");
            Console.WriteLine($"[JWT FORBIDDEN] Claims presentes: {string.Join(", ", claims ?? Array.Empty<string>())}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddHttpClient();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IImageUploadService, CloudinaryUploadService>();
builder.Services.AddScoped<IEmailService, ResendEmailService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

        policy.SetIsOriginAllowed(origin =>
              {
                  if (string.IsNullOrWhiteSpace(origin)) return false;
                  if (configuredOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase)) return true;
                  if (Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                  {
                      return uri.Host == "localhost"
                          || uri.Host == "127.0.0.1"
                          || uri.Host.EndsWith("vercel.app", StringComparison.OrdinalIgnoreCase)
                          || uri.Host.EndsWith("fluxtur.com.br", StringComparison.OrdinalIgnoreCase);
                  }
                  return false;
              })
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        await context.Database.MigrateAsync();
        app.Logger.LogInformation("Banco de dados sincronizado via EF Core Migrations.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Erro ao executar MigrateAsync.");
    }

    // Seed: Usuário Admin Empresa (Fluxtur)
    var empresaUser = await context.Usuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == "contato@fluxtur.com.br");
    if (empresaUser != null)
    {
        empresaUser.Role = "Admin";
        empresaUser.Ativo = true;
    }
    else
    {
        context.Usuarios.Add(new Usuario
        {
            Nome = "Fluxtur Viagens",
            Email = "contato@fluxtur.com.br",
            SenhaHash = PasswordHasher.HashPassword("admin123"),
            Role = "Admin",
            Ativo = true
        });
    }

    // Seed: Usuário Admin Pessoal (Higor Germano)
    var higorUser = await context.Usuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == "higorgermano43@gmail.com");
    if (higorUser != null)
    {
        higorUser.Role = "Admin";
        higorUser.Ativo = true;
    }
    else
    {
        context.Usuarios.Add(new Usuario
        {
            Nome = "Higor Germano",
            Email = "higorgermano43@gmail.com",
            SenhaHash = PasswordHasher.HashPassword("admin1234"),
            Role = "Admin",
            Ativo = true
        });
    }

    await context.SaveChangesAsync();

    try
    {
        await context.Database.ExecuteSqlRawAsync("UPDATE \"Usuarios\" SET \"Role\" = 'Admin' WHERE LOWER(\"Email\") IN ('contato@fluxtur.com.br', 'higorgermano43@gmail.com');");
    }
    catch { }
}

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();