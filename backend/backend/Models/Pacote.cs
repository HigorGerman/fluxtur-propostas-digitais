using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Pacote
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Titulo { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Destino { get; set; } = string.Empty;

    [MaxLength(100)]
    public string EstadoDestino { get; set; } = string.Empty;

    [MaxLength(100)]
    public string CidadeDestino { get; set; } = string.Empty;

    public Guid HotelId { get; set; }

    public Hotel Hotel { get; set; } = null!;

    [MaxLength(500)]
    public string FotoUrl { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoBase { get; set; }

    [Required]
    public string DescricaoAtividades { get; set; } = string.Empty;

    public bool PossuiTransfer { get; set; }

    [MaxLength(500)]
    public string? DescricaoTransfer { get; set; }

    public bool PossuiSeguroViagem { get; set; }

    [MaxLength(500)]
    public string? DescricaoSeguro { get; set; }

    public bool PossuiVoo { get; set; }

    public bool EhVooDireto { get; set; } = true;

    public int? QuantidadeParadas { get; set; }

    [MaxLength(500)]
    public string? CidadesConexao { get; set; }

    [MaxLength(1000)]
    public string? ObservacoesVoo { get; set; }

    public ICollection<ReservaPacote> Reservas { get; set; } = new List<ReservaPacote>();
}
