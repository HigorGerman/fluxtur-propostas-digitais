using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils.Security;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<(LoginResponseDto Response, string RefreshToken)> LoginAsync(LoginRequestDto dto)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Identificador.ToLower());
        if (usuario != null)
        {
            if (!usuario.Ativo || !PasswordHasher.VerifyPassword(dto.Senha, usuario.SenhaHash))
            {
                throw new UnauthorizedAccessException("Credenciais invalidas.");
            }

            var effectiveRole = string.Equals(usuario.Role, "admin", StringComparison.OrdinalIgnoreCase) ? "Admin" : usuario.Role;

            if (usuario.Role != effectiveRole)
            {
                usuario.Role = effectiveRole;
                await _context.SaveChangesAsync();
            }

            var accessToken = GenerateAccessToken(usuario.Id, usuario.Email, usuario.Nome, effectiveRole);
            var refreshToken = await GenerateAndSaveRefreshTokenAsync(usuario.Id, null);

            return (new LoginResponseDto
            {
                UsuarioId = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                AccessToken = accessToken,
                Role = effectiveRole
            }, refreshToken);
        }

        var cleanedIdentificador = new string(dto.Identificador.Where(char.IsDigit).ToArray());
        var cliente = await _context.Clientes.FirstOrDefaultAsync(c =>
            c.Email.ToLower() == dto.Identificador.ToLower() ||
            (cleanedIdentificador.Length == 11 && c.Cpf == cleanedIdentificador)
        );

        if (cliente != null)
        {
            if (!PasswordHasher.VerifyPassword(dto.Senha, cliente.SenhaHash))
            {
                throw new UnauthorizedAccessException("Credenciais invalidas.");
            }

            var accessToken = GenerateAccessToken(cliente.Id, cliente.Email, cliente.Nome, "Cliente");
            var refreshToken = await GenerateAndSaveRefreshTokenAsync(null, cliente.Id);

            return (new LoginResponseDto
            {
                UsuarioId = cliente.Id,
                Nome = cliente.Nome,
                Email = cliente.Email,
                AccessToken = accessToken,
                Role = "Cliente"
            }, refreshToken);
        }

        throw new UnauthorizedAccessException("Credenciais invalidas.");
    }

    public async Task<(LoginResponseDto Response, string RefreshToken)> RefreshTokenAsync(string refreshToken)
    {
        var existingToken = await _context.RefreshTokens
            .Include(r => r.Usuario)
            .Include(r => r.Cliente)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (existingToken == null || existingToken.RevogadoEm != null || existingToken.DataExpiracao <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Token de atualizacao invalido ou expirado.");
        }

        existingToken.RevogadoEm = DateTime.UtcNow;

        Guid accountId;
        string email;
        string nome;
        string role;
        Guid? usuarioId = null;
        Guid? clienteId = null;

        if (existingToken.Usuario != null)
        {
            if (!existingToken.Usuario.Ativo)
            {
                throw new UnauthorizedAccessException("Usuario inativo.");
            }
            accountId = existingToken.Usuario.Id;
            email = existingToken.Usuario.Email;
            nome = existingToken.Usuario.Nome;
            role = string.Equals(existingToken.Usuario.Role, "admin", StringComparison.OrdinalIgnoreCase) ? "Admin" : existingToken.Usuario.Role;
            usuarioId = accountId;
        }
        else if (existingToken.Cliente != null)
        {
            accountId = existingToken.Cliente.Id;
            email = existingToken.Cliente.Email;
            nome = existingToken.Cliente.Nome;
            role = "Cliente";
            clienteId = accountId;
        }
        else
        {
            throw new UnauthorizedAccessException("Token de atualizacao nao esta associado a nenhuma conta.");
        }

        var newAccessToken = GenerateAccessToken(accountId, email, nome, role);
        var newRefreshToken = await GenerateAndSaveRefreshTokenAsync(usuarioId, clienteId);

        return (new LoginResponseDto
        {
            UsuarioId = accountId,
            Nome = nome,
            Email = email,
            AccessToken = newAccessToken,
            Role = role
        }, newRefreshToken);
    }

    private string GenerateAccessToken(Guid id, string email, string nome, string role)
    {
        var secretKey = _configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("SecretKey nao configurada.");
        var issuer = _configuration["JwtSettings:Issuer"];
        var audience = _configuration["JwtSettings:Audience"];

        var normalizedRole = string.IsNullOrWhiteSpace(role) ? "Admin" : (string.Equals(role, "admin", StringComparison.OrdinalIgnoreCase) ? "Admin" : role);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim("nome", nome),
            new Claim(ClaimTypes.Name, nome),
            new Claim(ClaimTypes.Role, normalizedRole),
            new Claim("role", normalizedRole),
            new Claim("Role", normalizedRole)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<string> GenerateAndSaveRefreshTokenAsync(Guid? usuarioId, Guid? clienteId)
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        var refreshTokenString = Convert.ToBase64String(randomNumber);

        var refreshToken = new RefreshToken
        {
            Token = refreshTokenString,
            UsuarioId = usuarioId,
            ClienteId = clienteId,
            CriadoEm = DateTime.UtcNow,
            DataExpiracao = DateTime.UtcNow.AddDays(7)
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return refreshTokenString;
    }
}
