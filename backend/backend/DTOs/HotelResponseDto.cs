namespace backend.DTOs;

public class HotelResponseDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public int Estrelas { get; set; }
    public string FotoUrl { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string EmailContato { get; set; } = string.Empty;
}
