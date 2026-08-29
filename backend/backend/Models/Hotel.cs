using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Hotel
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Endereco { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;

    public int Estrelas { get; set; }

    [MaxLength(500)]
    public string FotoUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Telefone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string EmailContato { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<Pacote> Pacotes { get; set; } = new List<Pacote>();
}
