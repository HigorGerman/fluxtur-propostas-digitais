namespace backend.Models;

public class Alerta
{
    public Guid Id { get; set; }

    public Guid ReservaPacoteId { get; set; }

    public ReservaPacote ReservaPacote { get; set; } = null!;

    public bool Lido { get; set; } = false;

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
