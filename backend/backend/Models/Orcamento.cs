using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Orcamento
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(64)]
    public string Token { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ClienteNome { get; set; } = string.Empty;

    [MaxLength(150)]
    [EmailAddress]
    public string? ClienteEmail { get; set; }

    [Required]
    [MaxLength(30)]
    public string ClienteWhatsapp { get; set; } = string.Empty;

    public DateTime Validade { get; set; } = DateTime.UtcNow.AddDays(7);

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pendente"; // Pendente, Aprovado, Rejeitado, Expirado

    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorTotal { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorProdutos { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorTaxas { get; set; }

    [MaxLength(1000)]
    public string? Observacoes { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public Guid? HotelId { get; set; }
    public Hotel? Hotel { get; set; }

    public Guid? PacoteId { get; set; }
    public Pacote? Pacote { get; set; }

    [MaxLength(150)]
    public string? TituloCustomizado { get; set; }

    [MaxLength(150)]
    public string? DestinoCustomizado { get; set; }

    // Passageiros
    public int QuantidadeAdultos { get; set; } = 2;
    public int QuantidadeCriancas { get; set; } = 0;
    [MaxLength(100)]
    public string? IdadesCriancas { get; set; }

    // Hospedagem Estruturada
    [MaxLength(150)]
    public string? HotelNomeCustomizado { get; set; }
    [MaxLength(500)]
    public string? HotelFotoUrlCustomizada { get; set; }
    [MaxLength(2000)]
    public string? HotelGaleriaFotos { get; set; }
    public DateTime? CheckInData { get; set; }
    [MaxLength(10)]
    public string? CheckInHorario { get; set; }
    public DateTime? CheckOutData { get; set; }
    [MaxLength(10)]
    public string? CheckOutHorario { get; set; }
    public int QuantidadeNoites { get; set; }
    [MaxLength(150)]
    public string? TipoQuarto { get; set; }
    [MaxLength(100)]
    public string? RegimeAlimentacao { get; set; }
    [MaxLength(200)]
    public string? PoliticaCancelamento { get; set; }

    // Voo de Ida (Estruturado)
    [MaxLength(100)]
    public string? VooIdaCompanhia { get; set; }
    [MaxLength(100)]
    public string? VooIdaOrigem { get; set; }
    [MaxLength(100)]
    public string? VooIdaDestino { get; set; }
    public DateTime? VooIdaDataSaida { get; set; }
    [MaxLength(10)]
    public string? VooIdaHorarioSaida { get; set; }
    public DateTime? VooIdaDataChegada { get; set; }
    [MaxLength(10)]
    public string? VooIdaHorarioChegada { get; set; }
    [MaxLength(30)]
    public string? VooIdaDuracao { get; set; }
    public int VooIdaParadas { get; set; } = 0;
    [MaxLength(500)]
    public string? VooIdaConexoes { get; set; }

    // Voo de Volta (Estruturado)
    [MaxLength(100)]
    public string? VooVoltaCompanhia { get; set; }
    [MaxLength(100)]
    public string? VooVoltaOrigem { get; set; }
    [MaxLength(100)]
    public string? VooVoltaDestino { get; set; }
    public DateTime? VooVoltaDataSaida { get; set; }
    [MaxLength(10)]
    public string? VooVoltaHorarioSaida { get; set; }
    public DateTime? VooVoltaDataChegada { get; set; }
    [MaxLength(10)]
    public string? VooVoltaHorarioChegada { get; set; }
    [MaxLength(30)]
    public string? VooVoltaDuracao { get; set; }
    public int VooVoltaParadas { get; set; } = 0;
    [MaxLength(500)]
    public string? VooVoltaConexoes { get; set; }

    // Trechos Detalhados (JSON array de segmentos de voo)
    [MaxLength(4000)]
    public string? VooIdaTrechosJson { get; set; }
    [MaxLength(4000)]
    public string? VooVoltaTrechosJson { get; set; }

    // Legados/Genericos
    [MaxLength(1000)]
    public string? ObservacoesVoo { get; set; }
    [MaxLength(500)]
    public string? CidadesConexao { get; set; }
    public bool IncluiTransfer { get; set; }
    public bool IncluiSeguro { get; set; }
    [MaxLength(1000)]
    public string? ObservacoesPagamento { get; set; }
    [MaxLength(1000)]
    public string? MensagemCliente { get; set; }

    // Agente Responsavel
    [MaxLength(100)]
    public string? AgenteNome { get; set; }
    [MaxLength(30)]
    public string? AgenteTelefone { get; set; }
    [MaxLength(150)]
    public string? AgenteEmail { get; set; }
    [MaxLength(500)]
    public string? AgenteFotoUrl { get; set; }
}
