using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class RefreshToken
{
    public Guid Id { get; set; }

    public Guid? UsuarioId { get; set; }

    public Guid? ClienteId { get; set; }

    [Required]
    public string Token { get; set; } = string.Empty;

    public DateTime DataExpiracao { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public DateTime? RevogadoEm { get; set; }

    public Usuario? Usuario { get; set; }

    public Cliente? Cliente { get; set; }
}
