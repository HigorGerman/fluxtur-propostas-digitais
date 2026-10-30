using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using backend.Data;
using backend.DTOs;
using backend.Services;
using backend.Utils.Security;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;
    private readonly IAuthService _authService;
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public AuthController(
        IUsuarioService usuarioService,
        IAuthService authService,
        AppDbContext context,
        IEmailService emailService,
        IConfiguration configuration)
    {
        _usuarioService = usuarioService;
        _authService = authService;
        _context = context;
        _emailService = emailService;
        _configuration = configuration;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UsuarioCreateDto dto)
    {
        try
        {
            var usuario = await _usuarioService.RegisterAsync(dto);
            return Ok(new { message = "Usuario registrado com sucesso.", id = usuario.Id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        try
        {
            var (response, refreshToken) = await _authService.LoginAsync(dto);
            SetRefreshTokenCookie(refreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[LOGIN ERROR] {ex.Message} {ex.StackTrace}");
            return StatusCode(500, new { message = $"Erro interno ao realizar login: {ex.Message}" });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        try
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return Unauthorized(new { message = "Token de atualizacao nao fornecido." });
            }

            var (response, newRefreshToken) = await _authService.RefreshTokenAsync(refreshToken);
            SetRefreshTokenCookie(newRefreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[REFRESH ERROR] {ex.Message} {ex.StackTrace}");
            return StatusCode(500, new { message = $"Erro interno no refresh token: {ex.Message}" });
        }
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/api/auth"
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    [HttpPost("esqueci-senha")]
    public async Task<IActionResult> EsqueciSenha([FromBody] EsqueciSenhaRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email && u.Ativo);

            // Mensagem padronizada genérica para proteção contra enumeração de usuários
            const string mensagemGenerica = "Se este e-mail estiver registrado, as instruções de recuperação foram enviadas.";

            if (usuario == null)
            {
                // Usuário não existe ou inativo: retorna 200 OK genérico
                return Ok(new { message = mensagemGenerica });
            }

            // Gera token criptográfico seguro de 32 bytes (64 caracteres hexadecimais)
            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLowerInvariant();
            usuario.PasswordResetToken = token;
            usuario.PasswordResetExpiresAt = DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync();

            var frontendBaseUrl = _configuration["Resend:FrontendBaseUrl"] ?? "http://localhost:3000";
            var resetLink = $"{frontendBaseUrl.TrimEnd('/')}/redefinir-senha?token={token}";

            await _emailService.SendPasswordResetEmailAsync(usuario.Email, resetLink);

            return Ok(new { message = mensagemGenerica });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ESQUECI-SENHA ERROR] {ex.Message} {ex.StackTrace}");
            return StatusCode(500, new { message = "Ocorreu um erro interno ao processar a solicitação de recuperação." });
        }
    }

    [HttpPost("redefinir-senha")]
    public async Task<IActionResult> RedefinirSenha([FromBody] RedefinirSenhaRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            if (string.IsNullOrWhiteSpace(dto.Token))
            {
                return BadRequest(new { message = "Token de recuperação não fornecido." });
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.PasswordResetToken == dto.Token);

            var expiresUtc = usuario?.PasswordResetExpiresAt?.ToUniversalTime();
            if (usuario == null || expiresUtc == null || DateTime.UtcNow > expiresUtc)
            {
                return BadRequest(new { message = "Token de recuperação inválido ou expirado. Por favor, solicite um novo link de redefinição." });
            }

            if (string.IsNullOrWhiteSpace(dto.NovaSenha) || dto.NovaSenha.Length < 8)
            {
                return BadRequest(new { message = "A nova senha deve ter no mínimo 8 caracteres." });
            }

            // Aplica novo hash seguro
            usuario.SenhaHash = PasswordHasher.HashPassword(dto.NovaSenha);
            usuario.PasswordResetToken = null;
            usuario.PasswordResetExpiresAt = null;

            // Invalida sessões anteriores / refresh tokens ativos por segurança
            var tokensAntigos = await _context.RefreshTokens
                .Where(rt => rt.UsuarioId == usuario.Id)
                .ToListAsync();
            if (tokensAntigos.Count > 0)
            {
                _context.RefreshTokens.RemoveRange(tokensAntigos);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Senha redefinida com sucesso! Você já pode acessar com sua nova senha." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[REDEFINIR-SENHA ERROR] {ex.Message} {ex.StackTrace}");
            return StatusCode(500, new { message = "Ocorreu um erro interno ao redefinir a senha." });
        }
    }
}

