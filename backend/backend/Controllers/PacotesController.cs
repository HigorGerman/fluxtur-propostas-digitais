using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PacotesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IImageUploadService _imageUploadService;

    public PacotesController(AppDbContext context, IImageUploadService imageUploadService)
    {
        _context = context;
        _imageUploadService = imageUploadService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromForm] PacoteCreateDto dto)
    {
        var hotelExists = await _context.Hoteis.AnyAsync(h => h.Id == dto.HotelId);
        if (!hotelExists)
        {
            return BadRequest(new { message = "Hotel nao encontrado." });
        }

        var fotoUrl = dto.FotoUrl ?? string.Empty;
        if (dto.Foto != null)
        {
            fotoUrl = await _imageUploadService.UploadImageAsync(dto.Foto);
        }

        var pacote = new Pacote
        {
            Titulo = dto.Titulo,
            Destino = dto.Destino,
            EstadoDestino = dto.EstadoDestino,
            CidadeDestino = dto.CidadeDestino,
            HotelId = dto.HotelId,
            PrecoBase = dto.PrecoBase,
            DescricaoAtividades = dto.DescricaoAtividades,
            PossuiTransfer = dto.PossuiTransfer,
            DescricaoTransfer = dto.PossuiTransfer ? dto.DescricaoTransfer : null,
            PossuiSeguroViagem = dto.PossuiSeguroViagem,
            DescricaoSeguro = dto.PossuiSeguroViagem ? dto.DescricaoSeguro : null,
            PossuiVoo = dto.PossuiVoo,
            EhVooDireto = dto.PossuiVoo ? dto.EhVooDireto : true,
            QuantidadeParadas = dto.PossuiVoo && !dto.EhVooDireto ? dto.QuantidadeParadas : null,
            CidadesConexao = dto.PossuiVoo && !dto.EhVooDireto ? dto.CidadesConexao : null,
            ObservacoesVoo = dto.PossuiVoo ? dto.ObservacoesVoo : null,
            FotoUrl = fotoUrl
        };

        _context.Pacotes.Add(pacote);
        await _context.SaveChangesAsync();

        var responseDto = MapToResponseDto(pacote);
        return CreatedAtAction(nameof(GetById), new { id = pacote.Id }, responseDto);
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var pacotes = await _context.Pacotes
            .Include(p => p.Hotel)
            .ToListAsync();

        var dtos = pacotes.Select(MapToResponseDto).ToList();
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var pacote = await _context.Pacotes
            .Include(p => p.Hotel)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pacote == null)
        {
            return NotFound(new { message = "Pacote nao encontrado." });
        }

        return Ok(MapToResponseDto(pacote));
    }

    private static PacoteResponseDto MapToResponseDto(Pacote p)
    {
        return new PacoteResponseDto
        {
            Id = p.Id,
            Titulo = p.Titulo,
            Destino = p.Destino,
            EstadoDestino = p.EstadoDestino,
            CidadeDestino = p.CidadeDestino,
            HotelId = p.HotelId,
            Hotel = p.Hotel != null ? new HotelResponseDto
            {
                Id = p.Hotel.Id,
                Nome = p.Hotel.Nome,
                Endereco = p.Hotel.Endereco,
                Cidade = p.Hotel.Cidade,
                Estrelas = p.Hotel.Estrelas,
                FotoUrl = p.Hotel.FotoUrl,
                Telefone = p.Hotel.Telefone,
                EmailContato = p.Hotel.EmailContato
            } : null,
            FotoUrl = p.FotoUrl,
            PrecoBase = p.PrecoBase,
            DescricaoAtividades = p.DescricaoAtividades,
            PossuiTransfer = p.PossuiTransfer,
            DescricaoTransfer = p.DescricaoTransfer,
            PossuiSeguroViagem = p.PossuiSeguroViagem,
            DescricaoSeguro = p.DescricaoSeguro,
            PossuiVoo = p.PossuiVoo,
            EhVooDireto = p.EhVooDireto,
            QuantidadeParadas = p.QuantidadeParadas,
            CidadesConexao = p.CidadesConexao,
            ObservacoesVoo = p.ObservacoesVoo
        };
    }
}
