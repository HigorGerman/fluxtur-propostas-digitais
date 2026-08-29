using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

/// <summary>
/// Sub-DTO para Passageiros da Viagem
/// </summary>
public class PassageirosDto
{
    public int Adultos { get; set; } = 2;
    public int Criancas { get; set; } = 0;
    public string? IdadesCriancas { get; set; }
}

/// <summary>
/// Sub-DTO para Hospedagem / Acomodação
/// </summary>
public class HospedagemDetalhadaDto
{
    public string? HotelNome { get; set; }
    public string? FotoUrl { get; set; }
    public string? GaleriaFotos { get; set; }
    public DateTime? CheckInData { get; set; }
    public string? CheckInHorario { get; set; }
    public DateTime? CheckOutData { get; set; }
    public string? CheckOutHorario { get; set; }
    public int QuantidadeNoites { get; set; }
    public string? TipoQuarto { get; set; }
    public string? RegimeAlimentacao { get; set; }
    public string? PoliticaCancelamento { get; set; }
}

/// <summary>
/// Sub-DTO para Detalhamento de Voo (Ida ou Volta)
/// </summary>
public class DetalhesVooDto
{
    public string? Companhia { get; set; }
    public string? Origem { get; set; }
    public string? Destino { get; set; }
    public DateTime? DataSaida { get; set; }
    public string? HorarioSaida { get; set; }
    public DateTime? DataChegada { get; set; }
    public string? HorarioChegada { get; set; }
    public string? Duracao { get; set; }
    public int Paradas { get; set; }
    public string? Conexoes { get; set; }
    public string? TrechosJson { get; set; }
}

/// <summary>
/// Sub-DTO para Agente Responsavel
/// </summary>
public class AgenteResponsavelDto
{
    public string? Nome { get; set; }
    public string? Telefone { get; set; }
    public string? Email { get; set; }
    public string? FotoUrl { get; set; }
}

public class OrcamentoCreateDto
{
    [Required(ErrorMessage = "O nome do cliente é obrigatório.")]
    [MaxLength(100)]
    public string ClienteNome { get; set; } = string.Empty;

    [MaxLength(150)]
    [EmailAddress]
    public string? ClienteEmail { get; set; }

    [Required(ErrorMessage = "O WhatsApp do cliente é obrigatório.")]
    [MaxLength(30)]
    public string ClienteWhatsapp { get; set; } = string.Empty;

    public int ValidadeDias { get; set; } = 7;

    public decimal ValorProdutos { get; set; }
    public decimal ValorTaxas { get; set; }

    [Required(ErrorMessage = "O valor total da proposta é obrigatório.")]
    [Range(0.01, 10000000.0, ErrorMessage = "Informe um valor total válido.")]
    public decimal ValorTotal { get; set; }

    [MaxLength(1000)]
    public string? Observacoes { get; set; }

    public Guid? HotelId { get; set; }
    public Guid? PacoteId { get; set; }

    [MaxLength(150)]
    public string? TituloCustomizado { get; set; }

    [MaxLength(150)]
    public string? DestinoCustomizado { get; set; }

    // Passageiros
    public int QuantidadeAdultos { get; set; } = 2;
    public int QuantidadeCriancas { get; set; } = 0;
    public string? IdadesCriancas { get; set; }

    // Hospedagem Estruturada
    public string? HotelNomeCustomizado { get; set; }
    public string? HotelFotoUrlCustomizada { get; set; }
    public string? HotelGaleriaFotos { get; set; }
    public DateTime? CheckInData { get; set; }
    public string? CheckInHorario { get; set; }
    public DateTime? CheckOutData { get; set; }
    public string? CheckOutHorario { get; set; }
    public int QuantidadeNoites { get; set; }
    public string? TipoQuarto { get; set; }
    public string? RegimeAlimentacao { get; set; }
    public string? PoliticaCancelamento { get; set; }

    // Voo de Ida (Estruturado)
    public string? VooIdaCompanhia { get; set; }
    public string? VooIdaOrigem { get; set; }
    public string? VooIdaDestino { get; set; }
    public DateTime? VooIdaDataSaida { get; set; }
    public string? VooIdaHorarioSaida { get; set; }
    public DateTime? VooIdaDataChegada { get; set; }
    public string? VooIdaHorarioChegada { get; set; }
    public string? VooIdaDuracao { get; set; }
    public int VooIdaParadas { get; set; } = 0;
    public string? VooIdaConexoes { get; set; }
    public string? VooIdaTrechosJson { get; set; }

    // Voo de Volta (Estruturado)
    public string? VooVoltaCompanhia { get; set; }
    public string? VooVoltaOrigem { get; set; }
    public string? VooVoltaDestino { get; set; }
    public DateTime? VooVoltaDataSaida { get; set; }
    public string? VooVoltaHorarioSaida { get; set; }
    public DateTime? VooVoltaDataChegada { get; set; }
    public string? VooVoltaHorarioChegada { get; set; }
    public string? VooVoltaDuracao { get; set; }
    public int VooVoltaParadas { get; set; } = 0;
    public string? VooVoltaConexoes { get; set; }
    public string? VooVoltaTrechosJson { get; set; }

    // Legados/Opcionais
    public string? ObservacoesVoo { get; set; }
    public string? CidadesConexao { get; set; }
    public bool IncluiTransfer { get; set; } = true;
    public bool IncluiSeguro { get; set; } = true;
    public string? ObservacoesPagamento { get; set; }

    // Agente Responsavel
    public string? AgenteNome { get; set; }
    public string? AgenteTelefone { get; set; }
    public string? AgenteEmail { get; set; }
    public string? AgenteFotoUrl { get; set; }

    // Sub-DTOs para arquitetura modular
    public PassageirosDto? Passageiros { get; set; }
    public HospedagemDetalhadaDto? Hospedagem { get; set; }
    public DetalhesVooDto? VooIda { get; set; }
    public DetalhesVooDto? VooVolta { get; set; }
    public AgenteResponsavelDto? Agente { get; set; }
}

public class OrcamentoUpdateDto
{
    public string? ClienteNome { get; set; }
    public string? ClienteEmail { get; set; }
    public string? ClienteWhatsapp { get; set; }
    public DateTime? Validade { get; set; }
    public int? ValidadeDias { get; set; }

    public decimal? ValorProdutos { get; set; }
    public decimal? ValorTaxas { get; set; }
    public decimal? ValorTotal { get; set; }
    public string? Observacoes { get; set; }

    public Guid? HotelId { get; set; }
    public Guid? PacoteId { get; set; }

    public string? TituloCustomizado { get; set; }
    public string? DestinoCustomizado { get; set; }

    // Passageiros
    public int? QuantidadeAdultos { get; set; }
    public int? QuantidadeCriancas { get; set; }
    public string? IdadesCriancas { get; set; }

    // Hospedagem Estruturada
    public string? HotelNomeCustomizado { get; set; }
    public string? HotelFotoUrlCustomizada { get; set; }
    public string? HotelGaleriaFotos { get; set; }
    public DateTime? CheckInData { get; set; }
    public string? CheckInHorario { get; set; }
    public DateTime? CheckOutData { get; set; }
    public string? CheckOutHorario { get; set; }
    public int? QuantidadeNoites { get; set; }
    public string? TipoQuarto { get; set; }
    public string? RegimeAlimentacao { get; set; }
    public string? PoliticaCancelamento { get; set; }

    // Voo de Ida (Estruturado)
    public string? VooIdaCompanhia { get; set; }
    public string? VooIdaOrigem { get; set; }
    public string? VooIdaDestino { get; set; }
    public DateTime? VooIdaDataSaida { get; set; }
    public string? VooIdaHorarioSaida { get; set; }
    public DateTime? VooIdaDataChegada { get; set; }
    public string? VooIdaHorarioChegada { get; set; }
    public string? VooIdaDuracao { get; set; }
    public int? VooIdaParadas { get; set; }
    public string? VooIdaConexoes { get; set; }

    // Voo de Volta (Estruturado)
    public string? VooVoltaCompanhia { get; set; }
    public string? VooVoltaOrigem { get; set; }
    public string? VooVoltaDestino { get; set; }
    public DateTime? VooVoltaDataSaida { get; set; }
    public string? VooVoltaHorarioSaida { get; set; }
    public DateTime? VooVoltaDataChegada { get; set; }
    public string? VooVoltaHorarioChegada { get; set; }
    public string? VooVoltaDuracao { get; set; }
    public int? VooVoltaParadas { get; set; }
    public string? VooVoltaConexoes { get; set; }

    public string? VooIdaTrechosJson { get; set; }
    public string? VooVoltaTrechosJson { get; set; }

    public bool? IncluiTransfer { get; set; }
    public bool? IncluiSeguro { get; set; }
    public string? ObservacoesVoo { get; set; }
    public string? CidadesConexao { get; set; }
    public string? ObservacoesPagamento { get; set; }
    public string? Status { get; set; }

    // Agente Responsavel
    public string? AgenteNome { get; set; }
    public string? AgenteTelefone { get; set; }
    public string? AgenteEmail { get; set; }
    public string? AgenteFotoUrl { get; set; }

    // Sub-DTOs compostos
    public PassageirosDto? Passageiros { get; set; }
    public HospedagemDetalhadaDto? Hospedagem { get; set; }
    public DetalhesVooDto? VooIda { get; set; }
    public DetalhesVooDto? VooVolta { get; set; }
    public AgenteResponsavelDto? Agente { get; set; }
}

public class OrcamentoResponseDto
{
    public Guid Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public string ClienteNome { get; set; } = string.Empty;
    public string? ClienteEmail { get; set; }
    public string ClienteWhatsapp { get; set; } = string.Empty;
    public DateTime Validade { get; set; }
    public string Status { get; set; } = "Pendente";

    public decimal ValorTotal { get; set; }
    public decimal ValorProdutos { get; set; }
    public decimal ValorTaxas { get; set; }

    public string? Observacoes { get; set; }
    public DateTime CriadoEm { get; set; }

    public Guid? HotelId { get; set; }
    public HotelResponseDto? Hotel { get; set; }

    public Guid? PacoteId { get; set; }
    public PacoteResponseDto? Pacote { get; set; }

    public string? TituloCustomizado { get; set; }
    public string? DestinoCustomizado { get; set; }

    // Passageiros
    public int QuantidadeAdultos { get; set; }
    public int QuantidadeCriancas { get; set; }
    public string? IdadesCriancas { get; set; }

    // Hospedagem Estruturada
    public string? HotelNomeCustomizado { get; set; }
    public string? HotelFotoUrlCustomizada { get; set; }
    public string? HotelGaleriaFotos { get; set; }
    public DateTime? CheckInData { get; set; }
    public string? CheckInHorario { get; set; }
    public DateTime? CheckOutData { get; set; }
    public string? CheckOutHorario { get; set; }
    public int QuantidadeNoites { get; set; }
    public string? TipoQuarto { get; set; }
    public string? RegimeAlimentacao { get; set; }
    public string? PoliticaCancelamento { get; set; }

    // Voo de Ida (Estruturado)
    public string? VooIdaCompanhia { get; set; }
    public string? VooIdaOrigem { get; set; }
    public string? VooIdaDestino { get; set; }
    public DateTime? VooIdaDataSaida { get; set; }
    public string? VooIdaHorarioSaida { get; set; }
    public DateTime? VooIdaDataChegada { get; set; }
    public string? VooIdaHorarioChegada { get; set; }
    public string? VooIdaDuracao { get; set; }
    public int VooIdaParadas { get; set; }
    public string? VooIdaConexoes { get; set; }

    // Voo de Volta (Estruturado)
    public string? VooVoltaCompanhia { get; set; }
    public string? VooVoltaOrigem { get; set; }
    public string? VooVoltaDestino { get; set; }
    public DateTime? VooVoltaDataSaida { get; set; }
    public string? VooVoltaHorarioSaida { get; set; }
    public DateTime? VooVoltaDataChegada { get; set; }
    public string? VooVoltaHorarioChegada { get; set; }
    public string? VooVoltaDuracao { get; set; }
    public int VooVoltaParadas { get; set; }
    public string? VooVoltaConexoes { get; set; }

    public string? VooIdaTrechosJson { get; set; }
    public string? VooVoltaTrechosJson { get; set; }

    public bool IncluiTransfer { get; set; }
    public bool IncluiSeguro { get; set; }
    public string? ObservacoesVoo { get; set; }
    public string? CidadesConexao { get; set; }
    public string? ObservacoesPagamento { get; set; }
    public string? MensagemCliente { get; set; }

    // Agente Responsavel
    public string? AgenteNome { get; set; }
    public string? AgenteTelefone { get; set; }
    public string? AgenteEmail { get; set; }
    public string? AgenteFotoUrl { get; set; }

    // Sub-DTOs compostos
    public PassageirosDto Passageiros => new PassageirosDto
    {
        Adultos = QuantidadeAdultos,
        Criancas = QuantidadeCriancas,
        IdadesCriancas = IdadesCriancas
    };

    public HospedagemDetalhadaDto Hospedagem => new HospedagemDetalhadaDto
    {
        HotelNome = HotelNomeCustomizado ?? Hotel?.Nome,
        FotoUrl = HotelFotoUrlCustomizada ?? Hotel?.FotoUrl,
        GaleriaFotos = HotelGaleriaFotos,
        CheckInData = CheckInData,
        CheckInHorario = CheckInHorario,
        CheckOutData = CheckOutData,
        CheckOutHorario = CheckOutHorario,
        QuantidadeNoites = QuantidadeNoites,
        TipoQuarto = TipoQuarto,
        RegimeAlimentacao = RegimeAlimentacao,
        PoliticaCancelamento = PoliticaCancelamento
    };

    public DetalhesVooDto VooIda => new DetalhesVooDto
    {
        Companhia = VooIdaCompanhia,
        Origem = VooIdaOrigem,
        Destino = VooIdaDestino,
        DataSaida = VooIdaDataSaida,
        HorarioSaida = VooIdaHorarioSaida,
        DataChegada = VooIdaDataChegada,
        HorarioChegada = VooIdaHorarioChegada,
        Duracao = VooIdaDuracao,
        Paradas = VooIdaParadas,
        Conexoes = VooIdaConexoes,
        TrechosJson = VooIdaTrechosJson
    };

    public DetalhesVooDto VooVolta => new DetalhesVooDto
    {
        Companhia = VooVoltaCompanhia,
        Origem = VooVoltaOrigem,
        Destino = VooVoltaDestino,
        DataSaida = VooVoltaDataSaida,
        HorarioSaida = VooVoltaHorarioSaida,
        DataChegada = VooVoltaDataChegada,
        HorarioChegada = VooVoltaHorarioChegada,
        Duracao = VooVoltaDuracao,
        Paradas = VooVoltaParadas,
        Conexoes = VooVoltaConexoes,
        TrechosJson = VooVoltaTrechosJson
    };

    public AgenteResponsavelDto Agente => new AgenteResponsavelDto
    {
        Nome = AgenteNome,
        Telefone = AgenteTelefone,
        Email = AgenteEmail,
        FotoUrl = AgenteFotoUrl
    };
}

public class AprovarOrcamentoDto
{
    public string Status { get; set; } = "Aprovado";
    public string? MensagemCliente { get; set; }
}
