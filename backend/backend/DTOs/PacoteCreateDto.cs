using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class PacoteCreateDto
{
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

    public decimal PrecoBase { get; set; }

    [Required]
    public string DescricaoAtividades { get; set; } = string.Empty;

    public bool PossuiTransfer { get; set; }

    public string? DescricaoTransfer { get; set; }

    public bool PossuiSeguroViagem { get; set; }

    public string? DescricaoSeguro { get; set; }

    public bool PossuiVoo { get; set; }

    public bool EhVooDireto { get; set; } = true;

    public int? QuantidadeParadas { get; set; }

    public string? CidadesConexao { get; set; }

    public string? ObservacoesVoo { get; set; }

    public string? FotoUrl { get; set; }

    public IFormFile? Foto { get; set; }
}
