using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class HotelCreateDto
{
    [Required]
    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Endereco { get; set; }

    [MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Estrelas { get; set; } = 5;

    [MaxLength(20)]
    public string? Telefone { get; set; }

    [MaxLength(150)]
    public string? EmailContato { get; set; }

    public string? FotoUrl { get; set; }

    [MaxLength(2000)]
    public string? GaleriaFotos { get; set; }

    public IFormFile? Foto { get; set; }
}

public class QuickHotelSaveDto
{
    [Required]
    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Cidade { get; set; }

    [MaxLength(500)]
    public string? FotoUrl { get; set; }

    [MaxLength(2000)]
    public string? GaleriaFotos { get; set; }

    public int Estrelas { get; set; } = 5;
}
