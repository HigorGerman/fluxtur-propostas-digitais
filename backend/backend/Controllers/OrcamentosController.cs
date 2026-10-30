using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrcamentosController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrcamentosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] OrcamentoCreateDto dto)
    {
        if (dto.HotelId.HasValue)
        {
            var hotelExists = await _context.Hoteis.AnyAsync(h => h.Id == dto.HotelId.Value);
            if (!hotelExists)
            {
                return BadRequest(new { message = "Hotel especificado nao encontrado." });
            }
        }

        if (dto.PacoteId.HasValue)
        {
            var pacoteExists = await _context.Pacotes.AnyAsync(p => p.Id == dto.PacoteId.Value);
            if (!pacoteExists)
            {
                return BadRequest(new { message = "Pacote de viagem especificado nao encontrado." });
            }
        }

        Guid? resolvedHotelId = dto.HotelId;
        if (!resolvedHotelId.HasValue && !string.IsNullOrWhiteSpace(dto.HotelNomeCustomizado) && dto.SalvarNoCatalogo)
        {
            var trimmedNome = dto.HotelNomeCustomizado.Trim();
            var existingHotel = await _context.Hoteis.FirstOrDefaultAsync(h => h.Nome.ToLower() == trimmedNome.ToLower());
            if (existingHotel != null)
            {
                resolvedHotelId = existingHotel.Id;
                if (!string.IsNullOrWhiteSpace(dto.HotelFotoUrlCustomizada) && string.IsNullOrWhiteSpace(existingHotel.FotoUrl))
                {
                    existingHotel.FotoUrl = dto.HotelFotoUrlCustomizada.Trim();
                }
                if (!string.IsNullOrWhiteSpace(dto.HotelGaleriaFotos) && string.IsNullOrWhiteSpace(existingHotel.GaleriaFotos))
                {
                    existingHotel.GaleriaFotos = dto.HotelGaleriaFotos.Trim();
                }
                if (!string.IsNullOrWhiteSpace(dto.HotelEnderecoCustomizado) && string.IsNullOrWhiteSpace(existingHotel.Endereco))
                {
                    existingHotel.Endereco = dto.HotelEnderecoCustomizado.Trim();
                }
            }
            else
            {
                var newHotel = new Hotel
                {
                    Nome = trimmedNome,
                    Cidade = dto.DestinoCustomizado?.Trim() ?? string.Empty,
                    FotoUrl = dto.HotelFotoUrlCustomizada?.Trim() ?? string.Empty,
                    GaleriaFotos = dto.HotelGaleriaFotos?.Trim(),
                    Endereco = dto.HotelEnderecoCustomizado?.Trim() ?? string.Empty,
                    Estrelas = 5,
                    Telefone = string.Empty,
                    EmailContato = string.Empty
                };
                _context.Hoteis.Add(newHotel);
                await _context.SaveChangesAsync();
                resolvedHotelId = newHotel.Id;
            }
        }

        var token = GenerateUniqueToken();

        var orcamento = new Orcamento
        {
            Token = token,
            ClienteNome = dto.ClienteNome,
            ClienteEmail = dto.ClienteEmail,
            ClienteWhatsapp = dto.ClienteWhatsapp,
            Validade = DateTime.UtcNow.AddDays(dto.ValidadeDias > 0 ? dto.ValidadeDias : 7),
            Status = "Pendente",

            ValorTotal = dto.ValorTotal > 0 ? dto.ValorTotal : (dto.ValorProdutos + dto.ValorTaxas),
            ValorProdutos = dto.ValorProdutos,
            ValorTaxas = dto.ValorTaxas,

            Observacoes = dto.Observacoes,
            CriadoEm = DateTime.UtcNow,
            HotelId = resolvedHotelId,
            PacoteId = dto.PacoteId,
            TituloCustomizado = dto.TituloCustomizado,
            DestinoCustomizado = dto.DestinoCustomizado,

            // Passageiros
            QuantidadeAdultos = dto.QuantidadeAdultos > 0 ? dto.QuantidadeAdultos : 2,
            QuantidadeCriancas = dto.QuantidadeCriancas,
            IdadesCriancas = dto.IdadesCriancas,

            // Hospedagem Estruturada
            HotelNomeCustomizado = dto.HotelNomeCustomizado,
            HotelEnderecoCustomizado = dto.HotelEnderecoCustomizado,
            HotelFotoUrlCustomizada = dto.HotelFotoUrlCustomizada,
            HotelGaleriaFotos = dto.HotelGaleriaFotos,
            CheckInData = EnsureUtc(dto.CheckInData),
            CheckInHorario = dto.CheckInHorario,
            CheckOutData = EnsureUtc(dto.CheckOutData),
            CheckOutHorario = dto.CheckOutHorario,
            QuantidadeNoites = dto.QuantidadeNoites,
            TipoQuarto = dto.TipoQuarto,
            NumeroQuarto = dto.NumeroQuarto,
            CodigoVoucher = dto.CodigoVoucher,
            RegimeAlimentacao = dto.RegimeAlimentacao,
            PoliticaCancelamento = dto.PoliticaCancelamento,

            // Voo Ida
            VooIdaCompanhia = dto.VooIdaCompanhia,
            VooIdaOrigem = dto.VooIdaOrigem,
            VooIdaDestino = dto.VooIdaDestino,
            VooIdaDataSaida = EnsureUtc(dto.VooIdaDataSaida),
            VooIdaHorarioSaida = dto.VooIdaHorarioSaida,
            VooIdaDataChegada = EnsureUtc(dto.VooIdaDataChegada),
            VooIdaHorarioChegada = dto.VooIdaHorarioChegada,
            VooIdaDuracao = dto.VooIdaDuracao,
            VooIdaParadas = dto.VooIdaParadas,
            VooIdaConexoes = dto.VooIdaConexoes,

            // Voo Volta
            VooVoltaCompanhia = dto.VooVoltaCompanhia,
            VooVoltaOrigem = dto.VooVoltaOrigem,
            VooVoltaDestino = dto.VooVoltaDestino,
            VooVoltaDataSaida = EnsureUtc(dto.VooVoltaDataSaida),
            VooVoltaHorarioSaida = dto.VooVoltaHorarioSaida,
            VooVoltaDataChegada = EnsureUtc(dto.VooVoltaDataChegada),
            VooVoltaHorarioChegada = dto.VooVoltaHorarioChegada,
            VooVoltaDuracao = dto.VooVoltaDuracao,
            VooVoltaParadas = dto.VooVoltaParadas,
            VooVoltaConexoes = dto.VooVoltaConexoes,
            VooIdaTrechosJson = dto.VooIdaTrechosJson,
            VooVoltaTrechosJson = dto.VooVoltaTrechosJson,

            // Legado / Opcionais
            ObservacoesVoo = dto.ObservacoesVoo,
            CidadesConexao = dto.CidadesConexao,
            IncluiTransfer = dto.IncluiTransfer,
            IncluiSeguro = dto.IncluiSeguro,
            ObservacoesPagamento = dto.ObservacoesPagamento,

            // Agente Responsavel
            AgenteNome = dto.AgenteNome,
            AgenteTelefone = dto.AgenteTelefone,
            AgenteEmail = dto.AgenteEmail,
            AgenteFotoUrl = dto.AgenteFotoUrl
        };

        _context.Orcamentos.Add(orcamento);
        await _context.SaveChangesAsync();

        var createdOrcamento = await GetOrcamentoFullAsync(o => o.Id == orcamento.Id);
        return CreatedAtAction(nameof(GetById), new { id = orcamento.Id }, MapToResponseDto(createdOrcamento!));
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> List()
    {
        var orcamentos = await _context.Orcamentos
            .Include(o => o.Hotel)
            .Include(o => o.Pacote)
                .ThenInclude(p => p!.Hotel)
            .OrderByDescending(o => o.CriadoEm)
            .ToListAsync();

        var now = DateTime.UtcNow;
        var updated = false;
        foreach (var item in orcamentos)
        {
            if (item.Status == "Pendente" && item.Validade < now)
            {
                item.Status = "Expirado";
                updated = true;
            }
        }

        if (updated)
        {
            await _context.SaveChangesAsync();
        }

        var dtos = orcamentos.Select(MapToResponseDto).ToList();
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var orcamento = await GetOrcamentoFullAsync(o => o.Id == id);
        if (orcamento == null)
        {
            return NotFound(new { message = "Orcamento nao encontrado." });
        }

        CheckAndExpireStatus(orcamento);
        await _context.SaveChangesAsync();

        return Ok(MapToResponseDto(orcamento));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var orcamento = await _context.Orcamentos.FindAsync(id);
        if (orcamento == null)
        {
            return NotFound(new { message = "Orcamento nao encontrado." });
        }

        _context.Orcamentos.Remove(orcamento);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] OrcamentoUpdateDto dto)
    {
        var orcamento = await _context.Orcamentos.FindAsync(id);
        if (orcamento == null)
        {
            return NotFound(new { message = "Orcamento nao encontrado." });
        }

        if (!string.IsNullOrWhiteSpace(dto.ClienteNome)) orcamento.ClienteNome = dto.ClienteNome;
        if (dto.ClienteEmail != null) orcamento.ClienteEmail = dto.ClienteEmail;
        if (!string.IsNullOrWhiteSpace(dto.ClienteWhatsapp)) orcamento.ClienteWhatsapp = dto.ClienteWhatsapp;
        if (dto.ValidadeDias.HasValue && dto.ValidadeDias.Value > 0)
            orcamento.Validade = DateTime.UtcNow.AddDays(dto.ValidadeDias.Value);

        if (dto.ValorTotal.HasValue) orcamento.ValorTotal = dto.ValorTotal.Value;
        if (dto.ValorProdutos.HasValue) orcamento.ValorProdutos = dto.ValorProdutos.Value;
        if (dto.ValorTaxas.HasValue) orcamento.ValorTaxas = dto.ValorTaxas.Value;

        if (dto.Observacoes != null) orcamento.Observacoes = dto.Observacoes;
        if (dto.HotelId.HasValue) orcamento.HotelId = dto.HotelId.Value == Guid.Empty ? null : dto.HotelId;
        if (dto.PacoteId.HasValue) orcamento.PacoteId = dto.PacoteId.Value == Guid.Empty ? null : dto.PacoteId;
        if (dto.TituloCustomizado != null) orcamento.TituloCustomizado = dto.TituloCustomizado;
        if (dto.DestinoCustomizado != null) orcamento.DestinoCustomizado = dto.DestinoCustomizado;

        // Passageiros
        if (dto.QuantidadeAdultos.HasValue) orcamento.QuantidadeAdultos = dto.QuantidadeAdultos.Value;
        if (dto.QuantidadeCriancas.HasValue) orcamento.QuantidadeCriancas = dto.QuantidadeCriancas.Value;
        if (dto.IdadesCriancas != null) orcamento.IdadesCriancas = dto.IdadesCriancas;

        // Hospedagem
        if (dto.HotelNomeCustomizado != null) orcamento.HotelNomeCustomizado = dto.HotelNomeCustomizado;
        if (dto.HotelEnderecoCustomizado != null) orcamento.HotelEnderecoCustomizado = dto.HotelEnderecoCustomizado;
        if (dto.HotelFotoUrlCustomizada != null) orcamento.HotelFotoUrlCustomizada = dto.HotelFotoUrlCustomizada;
        if (dto.HotelGaleriaFotos != null) orcamento.HotelGaleriaFotos = dto.HotelGaleriaFotos;
        if (dto.CheckInData.HasValue) orcamento.CheckInData = EnsureUtc(dto.CheckInData);
        if (dto.CheckInHorario != null) orcamento.CheckInHorario = dto.CheckInHorario;
        if (dto.CheckOutData.HasValue) orcamento.CheckOutData = EnsureUtc(dto.CheckOutData);
        if (dto.CheckOutHorario != null) orcamento.CheckOutHorario = dto.CheckOutHorario;
        if (dto.QuantidadeNoites.HasValue) orcamento.QuantidadeNoites = dto.QuantidadeNoites.Value;
        if (dto.TipoQuarto != null) orcamento.TipoQuarto = dto.TipoQuarto;
        if (dto.NumeroQuarto != null) orcamento.NumeroQuarto = dto.NumeroQuarto;
        if (dto.CodigoVoucher != null) orcamento.CodigoVoucher = dto.CodigoVoucher;
        if (dto.RegimeAlimentacao != null) orcamento.RegimeAlimentacao = dto.RegimeAlimentacao;
        if (dto.PoliticaCancelamento != null) orcamento.PoliticaCancelamento = dto.PoliticaCancelamento;

        // Voo Ida
        if (dto.VooIdaCompanhia != null) orcamento.VooIdaCompanhia = dto.VooIdaCompanhia;
        if (dto.VooIdaOrigem != null) orcamento.VooIdaOrigem = dto.VooIdaOrigem;
        if (dto.VooIdaDestino != null) orcamento.VooIdaDestino = dto.VooIdaDestino;
        if (dto.VooIdaDataSaida.HasValue) orcamento.VooIdaDataSaida = EnsureUtc(dto.VooIdaDataSaida);
        if (dto.VooIdaHorarioSaida != null) orcamento.VooIdaHorarioSaida = dto.VooIdaHorarioSaida;
        if (dto.VooIdaDataChegada.HasValue) orcamento.VooIdaDataChegada = EnsureUtc(dto.VooIdaDataChegada);
        if (dto.VooIdaHorarioChegada != null) orcamento.VooIdaHorarioChegada = dto.VooIdaHorarioChegada;
        if (dto.VooIdaDuracao != null) orcamento.VooIdaDuracao = dto.VooIdaDuracao;
        if (dto.VooIdaParadas.HasValue) orcamento.VooIdaParadas = dto.VooIdaParadas.Value;
        if (dto.VooIdaConexoes != null) orcamento.VooIdaConexoes = dto.VooIdaConexoes;

        // Voo Volta
        if (dto.VooVoltaCompanhia != null) orcamento.VooVoltaCompanhia = dto.VooVoltaCompanhia;
        if (dto.VooVoltaOrigem != null) orcamento.VooVoltaOrigem = dto.VooVoltaOrigem;
        if (dto.VooVoltaDestino != null) orcamento.VooVoltaDestino = dto.VooVoltaDestino;
        if (dto.VooVoltaDataSaida.HasValue) orcamento.VooVoltaDataSaida = EnsureUtc(dto.VooVoltaDataSaida);
        if (dto.VooVoltaHorarioSaida != null) orcamento.VooVoltaHorarioSaida = dto.VooVoltaHorarioSaida;
        if (dto.VooVoltaDataChegada.HasValue) orcamento.VooVoltaDataChegada = EnsureUtc(dto.VooVoltaDataChegada);
        if (dto.VooVoltaHorarioChegada != null) orcamento.VooVoltaHorarioChegada = dto.VooVoltaHorarioChegada;
        if (dto.VooVoltaDuracao != null) orcamento.VooVoltaDuracao = dto.VooVoltaDuracao;
        if (dto.VooVoltaParadas.HasValue) orcamento.VooVoltaParadas = dto.VooVoltaParadas.Value;
        if (dto.VooVoltaConexoes != null) orcamento.VooVoltaConexoes = dto.VooVoltaConexoes;
        if (dto.VooIdaTrechosJson != null) orcamento.VooIdaTrechosJson = dto.VooIdaTrechosJson;
        if (dto.VooVoltaTrechosJson != null) orcamento.VooVoltaTrechosJson = dto.VooVoltaTrechosJson;

        if (dto.ObservacoesVoo != null) orcamento.ObservacoesVoo = dto.ObservacoesVoo;
        if (dto.CidadesConexao != null) orcamento.CidadesConexao = dto.CidadesConexao;
        if (dto.IncluiTransfer.HasValue) orcamento.IncluiTransfer = dto.IncluiTransfer.Value;
        if (dto.IncluiSeguro.HasValue) orcamento.IncluiSeguro = dto.IncluiSeguro.Value;
        if (dto.ObservacoesPagamento != null) orcamento.ObservacoesPagamento = dto.ObservacoesPagamento;
        if (!string.IsNullOrWhiteSpace(dto.Status)) orcamento.Status = dto.Status;

        // Agente Responsavel
        if (dto.AgenteNome != null) orcamento.AgenteNome = dto.AgenteNome;
        if (dto.AgenteTelefone != null) orcamento.AgenteTelefone = dto.AgenteTelefone;
        if (dto.AgenteEmail != null) orcamento.AgenteEmail = dto.AgenteEmail;
        if (dto.AgenteFotoUrl != null) orcamento.AgenteFotoUrl = dto.AgenteFotoUrl;

        await _context.SaveChangesAsync();

        var updatedOrcamento = await GetOrcamentoFullAsync(o => o.Id == id);
        return Ok(MapToResponseDto(updatedOrcamento!));
    }

    [HttpGet("public/{token}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByTokenPublic(string token)
    {
        var orcamento = await GetOrcamentoFullAsync(o => o.Token == token);
        if (orcamento == null)
        {
            return NotFound(new { message = "Proposta ou orcamento nao encontrado." });
        }

        if (orcamento.Status == "Pendente" && orcamento.Validade < DateTime.UtcNow)
        {
            orcamento.Status = "Expirado";
            await _context.SaveChangesAsync();
        }

        return Ok(MapToResponseDto(orcamento));
    }

    [HttpPost("public/{token}/aprovar")]
    [AllowAnonymous]
    public async Task<IActionResult> AprovarPublic(string token, [FromBody] AprovarOrcamentoDto dto)
    {
        var orcamento = await GetOrcamentoFullAsync(o => o.Token == token);
        if (orcamento == null)
        {
            return NotFound(new { message = "Proposta ou orcamento nao encontrado." });
        }

        if (orcamento.Status == "Expirado")
        {
            return BadRequest(new { message = "Esta proposta ja esta expirada." });
        }

        orcamento.Status = !string.IsNullOrWhiteSpace(dto.Status) ? dto.Status : "Aprovado";
        if (!string.IsNullOrWhiteSpace(dto.MensagemCliente))
        {
            orcamento.MensagemCliente = dto.MensagemCliente;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Proposta atualizada com sucesso!",
            orcamento = MapToResponseDto(orcamento)
        });
    }

    private async Task<Orcamento?> GetOrcamentoFullAsync(System.Linq.Expressions.Expression<Func<Orcamento, bool>> predicate)
    {
        return await _context.Orcamentos
            .Include(o => o.Hotel)
            .Include(o => o.Pacote)
                .ThenInclude(p => p!.Hotel)
            .FirstOrDefaultAsync(predicate);
    }

    private static void CheckAndExpireStatus(Orcamento orcamento)
    {
        if (orcamento.Status == "Pendente" && orcamento.Validade < DateTime.UtcNow)
        {
            orcamento.Status = "Expirado";
        }
    }

    private static string GenerateUniqueToken()
    {
        var bytes = new byte[6];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToHexString(bytes).ToLower(); // e.g. "a1b2c3d4e5f6"
    }

    private static OrcamentoResponseDto MapToResponseDto(Orcamento o)
    {
        return new OrcamentoResponseDto
        {
            Id = o.Id,
            Token = o.Token,
            ClienteNome = o.ClienteNome,
            ClienteEmail = o.ClienteEmail,
            ClienteWhatsapp = o.ClienteWhatsapp,
            Validade = o.Validade,
            Status = o.Status,

            ValorTotal = o.ValorTotal,
            ValorProdutos = o.ValorProdutos,
            ValorTaxas = o.ValorTaxas,

            Observacoes = o.Observacoes,
            CriadoEm = o.CriadoEm,
            HotelId = o.HotelId,
            Hotel = o.Hotel != null ? new HotelResponseDto
            {
                Id = o.Hotel.Id,
                Nome = o.Hotel.Nome,
                Endereco = o.Hotel.Endereco,
                Cidade = o.Hotel.Cidade,
                Estrelas = o.Hotel.Estrelas,
                FotoUrl = o.Hotel.FotoUrl,
                Telefone = o.Hotel.Telefone,
                EmailContato = o.Hotel.EmailContato
            } : (o.Pacote?.Hotel != null ? new HotelResponseDto
            {
                Id = o.Pacote.Hotel.Id,
                Nome = o.Pacote.Hotel.Nome,
                Endereco = o.Pacote.Hotel.Endereco,
                Cidade = o.Pacote.Hotel.Cidade,
                Estrelas = o.Pacote.Hotel.Estrelas,
                FotoUrl = o.Pacote.Hotel.FotoUrl,
                Telefone = o.Pacote.Hotel.Telefone,
                EmailContato = o.Pacote.Hotel.EmailContato
            } : null),
            PacoteId = o.PacoteId,
            Pacote = o.Pacote != null ? new PacoteResponseDto
            {
                Id = o.Pacote.Id,
                Titulo = o.Pacote.Titulo,
                Destino = o.Pacote.Destino,
                EstadoDestino = o.Pacote.EstadoDestino,
                CidadeDestino = o.Pacote.CidadeDestino,
                HotelId = o.Pacote.HotelId,
                FotoUrl = o.Pacote.FotoUrl,
                PrecoBase = o.Pacote.PrecoBase,
                DescricaoAtividades = o.Pacote.DescricaoAtividades,
                PossuiTransfer = o.Pacote.PossuiTransfer,
                DescricaoTransfer = o.Pacote.DescricaoTransfer,
                PossuiSeguroViagem = o.Pacote.PossuiSeguroViagem,
                DescricaoSeguro = o.Pacote.DescricaoSeguro,
                PossuiVoo = o.Pacote.PossuiVoo,
                EhVooDireto = o.Pacote.EhVooDireto,
                QuantidadeParadas = o.Pacote.QuantidadeParadas,
                CidadesConexao = o.Pacote.CidadesConexao,
                ObservacoesVoo = o.Pacote.ObservacoesVoo
            } : null,

            TituloCustomizado = o.TituloCustomizado,
            DestinoCustomizado = o.DestinoCustomizado,

            // Passageiros
            QuantidadeAdultos = o.QuantidadeAdultos,
            QuantidadeCriancas = o.QuantidadeCriancas,
            IdadesCriancas = o.IdadesCriancas,

            // Hospedagem
            HotelNomeCustomizado = o.HotelNomeCustomizado,
            HotelEnderecoCustomizado = o.HotelEnderecoCustomizado ?? o.Hotel?.Endereco ?? o.Pacote?.Hotel?.Endereco,
            HotelFotoUrlCustomizada = o.HotelFotoUrlCustomizada,
            HotelGaleriaFotos = o.HotelGaleriaFotos,
            CheckInData = o.CheckInData,
            CheckInHorario = o.CheckInHorario,
            CheckOutData = o.CheckOutData,
            CheckOutHorario = o.CheckOutHorario,
            QuantidadeNoites = o.QuantidadeNoites,
            TipoQuarto = o.TipoQuarto,
            NumeroQuarto = o.NumeroQuarto,
            CodigoVoucher = o.CodigoVoucher,
            RegimeAlimentacao = o.RegimeAlimentacao,
            PoliticaCancelamento = o.PoliticaCancelamento,

            // Voo Ida
            VooIdaCompanhia = o.VooIdaCompanhia,
            VooIdaOrigem = o.VooIdaOrigem,
            VooIdaDestino = o.VooIdaDestino,
            VooIdaDataSaida = o.VooIdaDataSaida,
            VooIdaHorarioSaida = o.VooIdaHorarioSaida,
            VooIdaDataChegada = o.VooIdaDataChegada,
            VooIdaHorarioChegada = o.VooIdaHorarioChegada,
            VooIdaDuracao = o.VooIdaDuracao,
            VooIdaParadas = o.VooIdaParadas,
            VooIdaConexoes = o.VooIdaConexoes,

            // Voo Volta
            VooVoltaCompanhia = o.VooVoltaCompanhia,
            VooVoltaOrigem = o.VooVoltaOrigem,
            VooVoltaDestino = o.VooVoltaDestino,
            VooVoltaDataSaida = o.VooVoltaDataSaida,
            VooVoltaHorarioSaida = o.VooVoltaHorarioSaida,
            VooVoltaDataChegada = o.VooVoltaDataChegada,
            VooVoltaHorarioChegada = o.VooVoltaHorarioChegada,
            VooVoltaDuracao = o.VooVoltaDuracao,
            VooVoltaParadas = o.VooVoltaParadas,
            VooVoltaConexoes = o.VooVoltaConexoes,
            VooIdaTrechosJson = o.VooIdaTrechosJson,
            VooVoltaTrechosJson = o.VooVoltaTrechosJson,

            ObservacoesVoo = o.ObservacoesVoo,
            CidadesConexao = o.CidadesConexao,
            IncluiTransfer = o.IncluiTransfer,
            IncluiSeguro = o.IncluiSeguro,
            ObservacoesPagamento = o.ObservacoesPagamento,
            MensagemCliente = o.MensagemCliente,

            // Agente Responsavel
            AgenteNome = o.AgenteNome,
            AgenteTelefone = o.AgenteTelefone,
            AgenteEmail = o.AgenteEmail,
            AgenteFotoUrl = o.AgenteFotoUrl
        };
    }

    private static DateTime? EnsureUtc(DateTime? dt)
    {
        if (!dt.HasValue) return null;
        return DateTime.SpecifyKind(dt.Value, DateTimeKind.Utc);
    }
}
