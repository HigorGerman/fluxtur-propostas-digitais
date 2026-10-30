namespace backend.DTOs;

public class HotelResponseDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Endereco { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public int Estrelas { get; set; } = 5;
    public string FotoUrl { get; set; } = string.Empty;
    public string? GaleriaFotos { get; set; }
    public string? Telefone { get; set; }
    public string? EmailContato { get; set; }
}
