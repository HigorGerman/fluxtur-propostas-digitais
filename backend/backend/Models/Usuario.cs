using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Usuario
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string SenhaHash { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;

    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "Funcionario";

    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
