using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VoosController : ControllerBase
{
    private readonly AppDbContext _context;

    public VoosController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Método básico para listar os voos vinculados aos pacotes de viagem.
    /// </summary>
    /// <param name="destino">Filtro opcional por destino ou cidade.</param>
    /// <param name="vooDireto">Filtro opcional para apenas voos diretos.</param>
    /// <param name="cidadeConexao">Filtro opcional por cidade de conexão.</param>
    /// <returns>Lista de voos e informações do pacote/hotel associado.</returns>
    [HttpGet]
    public async Task<IActionResult> ListarVoos(
        [FromQuery] string? destino,
        [FromQuery] bool? vooDireto,
        [FromQuery] string? cidadeConexao)
    {
        var query = _context.Pacotes
            .Include(p => p.Hotel)
            .Where(p => p.PossuiVoo);

        if (!string.IsNullOrWhiteSpace(destino))
        {
            var d = destino.Trim().ToLower();
            query = query.Where(p => p.Destino.ToLower().Contains(d) || p.CidadeDestino.ToLower().Contains(d));
        }

        if (vooDireto.HasValue)
        {
            query = query.Where(p => p.EhVooDireto == vooDireto.Value);
        }

        if (!string.IsNullOrWhiteSpace(cidadeConexao))
        {
            var c = cidadeConexao.Trim().ToLower();
            query = query.Where(p => p.CidadesConexao != null && p.CidadesConexao.ToLower().Contains(c));
        }

        var voos = await query.Select(p => new
        {
            PacoteId = p.Id,
            PacoteTitulo = p.Titulo,
            Destino = p.Destino,
            CidadeDestino = p.CidadeDestino,
            PrecoBase = p.PrecoBase,
            PossuiVoo = p.PossuiVoo,
            EhVooDireto = p.EhVooDireto,
            QuantidadeParadas = p.QuantidadeParadas,
            CidadesConexao = p.CidadesConexao,
            ObservacoesVoo = p.ObservacoesVoo,
            Hotel = new
            {
                p.Hotel.Id,
                p.Hotel.Nome,
                p.Hotel.Cidade
            }
        }).ToListAsync();

        return Ok(voos);
    }
}
