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

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IImageUploadService, CloudinaryUploadService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
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
    }
    catch { }

    try
    {
        await context.Database.ExecuteSqlRawAsync(@"
            ALTER TABLE ""Pacotes"" ADD COLUMN IF NOT EXISTS ""PossuiVoo"" boolean NOT NULL DEFAULT false;
            ALTER TABLE ""Pacotes"" ADD COLUMN IF NOT EXISTS ""EhVooDireto"" boolean NOT NULL DEFAULT true;
            ALTER TABLE ""Pacotes"" ADD COLUMN IF NOT EXISTS ""QuantidadeParadas"" integer NULL;
            ALTER TABLE ""Pacotes"" ADD COLUMN IF NOT EXISTS ""CidadesConexao"" character varying(500) NULL;
            ALTER TABLE ""Pacotes"" ADD COLUMN IF NOT EXISTS ""ObservacoesVoo"" character varying(1000) NULL;
            DROP TABLE IF EXISTS ""VoosPacote"" CASCADE;

            CREATE TABLE IF NOT EXISTS ""Orcamentos"" (
                ""Id"" uuid NOT NULL PRIMARY KEY,
                ""Token"" character varying(64) NOT NULL,
                ""ClienteNome"" character varying(100) NOT NULL,
                ""ClienteEmail"" character varying(150) NULL,
                ""ClienteWhatsapp"" character varying(30) NOT NULL,
                ""Validade"" timestamp with time zone NOT NULL,
                ""Status"" character varying(20) NOT NULL DEFAULT 'Pendente',
                ""ValorTotal"" numeric(18,2) NOT NULL,
                ""Observacoes"" character varying(1000) NULL,
                ""CriadoEm"" timestamp with time zone NOT NULL,
                ""HotelId"" uuid NULL REFERENCES ""Hoteis""(""Id"") ON DELETE SET NULL,
                ""PacoteId"" uuid NULL REFERENCES ""Pacotes""(""Id"") ON DELETE SET NULL,
                ""TituloCustomizado"" character varying(150) NULL,
                ""DestinoCustomizado"" character varying(150) NULL,
                ""ObservacoesVoo"" character varying(1000) NULL,
                ""CidadesConexao"" character varying(500) NULL,
                ""IncluiTransfer"" boolean NOT NULL DEFAULT false,
                ""IncluiSeguro"" boolean NOT NULL DEFAULT false,
                ""ObservacoesPagamento"" character varying(1000) NULL,
                ""MensagemCliente"" character varying(1000) NULL
            );
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""ValorProdutos"" numeric(18,2) NOT NULL DEFAULT 0;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""ValorTaxas"" numeric(18,2) NOT NULL DEFAULT 0;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""QuantidadeAdultos"" integer NOT NULL DEFAULT 2;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""QuantidadeCriancas"" integer NOT NULL DEFAULT 0;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""IdadesCriancas"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""HotelNomeCustomizado"" character varying(150) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""HotelFotoUrlCustomizada"" character varying(500) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""HotelGaleriaFotos"" character varying(2000) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""CheckInData"" timestamp with time zone NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""CheckInHorario"" character varying(10) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""CheckOutData"" timestamp with time zone NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""CheckOutHorario"" character varying(10) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""QuantidadeNoites"" integer NOT NULL DEFAULT 0;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""TipoQuarto"" character varying(150) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""RegimeAlimentacao"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""PoliticaCancelamento"" character varying(200) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaCompanhia"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaOrigem"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaDestino"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaDataSaida"" timestamp with time zone NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaHorarioSaida"" character varying(10) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaDataChegada"" timestamp with time zone NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaHorarioChegada"" character varying(10) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaDuracao"" character varying(30) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaParadas"" integer NOT NULL DEFAULT 0;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaConexoes"" character varying(500) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaCompanhia"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaOrigem"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaDestino"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaDataSaida"" timestamp with time zone NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaHorarioSaida"" character varying(10) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaDataChegada"" timestamp with time zone NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaHorarioChegada"" character varying(10) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaDuracao"" character varying(30) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaParadas"" integer NOT NULL DEFAULT 0;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaConexoes"" character varying(500) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""AgenteNome"" character varying(100) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""AgenteTelefone"" character varying(30) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""AgenteEmail"" character varying(150) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""AgenteFotoUrl"" character varying(500) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooIdaTrechosJson"" character varying(4000) NULL;
            ALTER TABLE ""Orcamentos"" ADD COLUMN IF NOT EXISTS ""VooVoltaTrechosJson"" character varying(4000) NULL;
            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Orcamentos_Token"" ON ""Orcamentos"" (""Token"");
        ");
    }
    catch { }

    var adminUser = await context.Usuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == "admin@gmail.com");
    if (adminUser != null)
    {
        adminUser.Role = "Admin";
        adminUser.Ativo = true;
        await context.SaveChangesAsync();
    }
    else
    {
        var admin = new Usuario
        {
            Nome = "Admin",
            Email = "admin@gmail.com",
            SenhaHash = PasswordHasher.HashPassword("admin123"),
            Role = "Admin",
            Ativo = true
        };
        context.Usuarios.Add(admin);
        await context.SaveChangesAsync();
    }

    try
    {
        await context.Database.ExecuteSqlRawAsync("UPDATE \"Usuarios\" SET \"Role\" = 'Admin' WHERE LOWER(\"Email\") = 'admin@gmail.com' OR LOWER(\"Role\") = 'admin';");
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