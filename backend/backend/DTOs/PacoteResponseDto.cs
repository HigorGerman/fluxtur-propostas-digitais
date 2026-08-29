namespace backend.DTOs;

public class PacoteResponseDto
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public string EstadoDestino { get; set; } = string.Empty;
    public string CidadeDestino { get; set; } = string.Empty;
    public Guid HotelId { get; set; }
    public HotelResponseDto? Hotel { get; set; }
    public string FotoUrl { get; set; } = string.Empty;
    public decimal PrecoBase { get; set; }
    public string DescricaoAtividades { get; set; } = string.Empty;
    public bool PossuiTransfer { get; set; }
    public string? DescricaoTransfer { get; set; }
    public bool PossuiSeguroViagem { get; set; }
    public string? DescricaoSeguro { get; set; }
    public bool PossuiVoo { get; set; }
    public bool EhVooDireto { get; set; }
    public int? QuantidadeParadas { get; set; }
    public string? CidadesConexao { get; set; }
    public string? ObservacoesVoo { get; set; }
}
