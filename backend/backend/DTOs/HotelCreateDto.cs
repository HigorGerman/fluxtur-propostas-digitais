using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class HotelCreateDto
{
    [Required]
    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Endereco { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Estrelas { get; set; }

    [Required]
    [MaxLength(20)]
    public string Telefone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string EmailContato { get; set; } = string.Empty;

    public string? FotoUrl { get; set; }

    public IFormFile? Foto { get; set; }
}
