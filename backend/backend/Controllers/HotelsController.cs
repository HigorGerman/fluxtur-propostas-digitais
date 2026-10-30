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
public class HotelsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IImageUploadService _imageUploadService;

    public HotelsController(AppDbContext context, IImageUploadService imageUploadService)
    {
        _context = context;
        _imageUploadService = imageUploadService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromForm] HotelCreateDto dto)
    {
        var fotoUrl = !string.IsNullOrWhiteSpace(dto.FotoUrl) ? dto.FotoUrl.Trim() : string.Empty;
        if (dto.Foto != null)
        {
            fotoUrl = await _imageUploadService.UploadImageAsync(dto.Foto);
        }

        var hotel = new Hotel
        {
            Nome = dto.Nome?.Trim() ?? string.Empty,
            Endereco = dto.Endereco?.Trim() ?? string.Empty,
            Cidade = dto.Cidade?.Trim() ?? string.Empty,
            Estrelas = dto.Estrelas > 0 ? Math.Clamp(dto.Estrelas, 1, 5) : 5,
            FotoUrl = fotoUrl,
            Telefone = dto.Telefone?.Trim() ?? string.Empty,
            EmailContato = dto.EmailContato?.Trim() ?? string.Empty
        };

        _context.Hoteis.Add(hotel);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = hotel.Id }, hotel);
    }

    [HttpPost("quick")]
    [Authorize]
    public async Task<IActionResult> QuickSave([FromBody] QuickHotelSaveDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
        {
            return BadRequest(new { message = "O nome do hotel é obrigatório." });
        }

        var trimmedNome = dto.Nome.Trim();
        var existing = await _context.Hoteis.FirstOrDefaultAsync(h => h.Nome.ToLower() == trimmedNome.ToLower());

        if (existing != null)
        {
            if (!string.IsNullOrWhiteSpace(dto.FotoUrl)) existing.FotoUrl = dto.FotoUrl.Trim();
            if (!string.IsNullOrWhiteSpace(dto.GaleriaFotos)) existing.GaleriaFotos = dto.GaleriaFotos.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Cidade)) existing.Cidade = dto.Cidade.Trim();
            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        var hotel = new Hotel
        {
            Nome = trimmedNome,
            Cidade = dto.Cidade?.Trim() ?? string.Empty,
            FotoUrl = dto.FotoUrl?.Trim() ?? string.Empty,
            GaleriaFotos = dto.GaleriaFotos?.Trim(),
            Estrelas = dto.Estrelas > 0 ? dto.Estrelas : 5,
            Endereco = string.Empty,
            Telefone = string.Empty,
            EmailContato = string.Empty
        };

        _context.Hoteis.Add(hotel);
        await _context.SaveChangesAsync();
        return Ok(hotel);
    }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? cidade, [FromQuery] string? estado)
    {
        var query = _context.Hoteis.AsQueryable();

        if (!string.IsNullOrWhiteSpace(cidade))
        {
            var c = cidade.Trim().ToLower();
            query = query.Where(h => h.Cidade.ToLower().Contains(c));
        }

        if (!string.IsNullOrWhiteSpace(estado))
        {
            var e = estado.Trim().ToLower();
            query = query.Where(h => h.Cidade.ToLower().Contains(e) || h.Endereco.ToLower().Contains(e));
        }

        var hotels = await query.ToListAsync();
        return Ok(hotels);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var hotel = await _context.Hoteis.FirstOrDefaultAsync(h => h.Id == id);
        if (hotel == null)
        {
            return NotFound(new { message = "Hotel nao encontrado." });
        }
        return Ok(hotel);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var hotel = await _context.Hoteis.FindAsync(id);
        if (hotel == null)
        {
            return NotFound(new { message = "Hotel não encontrado." });
        }

        _context.Hoteis.Remove(hotel);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Hotel removido com sucesso." });
    }
}
