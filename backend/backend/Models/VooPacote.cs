using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class VooPacote
{
    public Guid Id { get; set; }

    public Guid PacoteId { get; set; }

    public Pacote Pacote { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string TituloTrecho { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string NumeroVoo { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Companhia { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string AeroportoPartida { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string AeroportoChegada { get; set; } = string.Empty;

    public DateTime HorarioPartida { get; set; }

    [Required]
    [MaxLength(50)]
    public string FusoPartida { get; set; } = string.Empty;

    public DateTime HorarioChegada { get; set; }

    [Required]
    [MaxLength(50)]
    public string FusoChegada { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? UrlDocumento { get; set; }

    public bool EhVooDireto { get; set; } = true;

    public int QuantidadeParadas { get; set; } = 0;

    [MaxLength(100)]
    public string? AeroportoConexao { get; set; }

    public DateTime? HorarioChegadaConexao { get; set; }

    public DateTime? HorarioSaidaConexao { get; set; }
}
