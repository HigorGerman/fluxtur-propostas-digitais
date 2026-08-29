using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils.Security;

namespace backend.Services;

public class UsuarioService : IUsuarioService
{
    private readonly AppDbContext _context;

    public UsuarioService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario> RegisterAsync(UsuarioCreateDto dto)
    {
        var emailExists = await _context.Usuarios.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (emailExists)
        {
            throw new InvalidOperationException("E-mail ja cadastrado.");
        }

        var senhaHash = PasswordHasher.HashPassword(dto.Senha);

        var usuario = new Usuario
        {
            Nome = dto.Nome,
            Email = dto.Email.ToLower(),
            SenhaHash = senhaHash
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return usuario;
    }

    public async Task<Usuario?> GetByEmailAsync(string email)
    {
        return await _context.Usuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<Usuario?> GetByIdAsync(Guid id)
    {
        return await _context.Usuarios.FindAsync(id);
    }
}
