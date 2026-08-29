using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;
    private readonly IAuthService _authService;

    public AuthController(IUsuarioService usuarioService, IAuthService authService)
    {
        _usuarioService = usuarioService;
        _authService = authService;
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
}
