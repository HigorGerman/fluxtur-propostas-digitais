using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface IUsuarioService
{
    Task<Usuario> RegisterAsync(UsuarioCreateDto dto);
    Task<Usuario?> GetByEmailAsync(string email);
    Task<Usuario?> GetByIdAsync(Guid id);
}
