using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Hotel
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Endereco { get; set; }

    [MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;

    public int Estrelas { get; set; } = 5;

    [MaxLength(500)]
    public string FotoUrl { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? GaleriaFotos { get; set; }

    [MaxLength(20)]
    public string? Telefone { get; set; }

    [MaxLength(150)]
    public string? EmailContato { get; set; }

    [JsonIgnore]
    public ICollection<Pacote> Pacotes { get; set; } = new List<Pacote>();
}
