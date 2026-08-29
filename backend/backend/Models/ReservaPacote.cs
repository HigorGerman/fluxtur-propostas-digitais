using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class ReservaPacote
{
    public Guid Id { get; set; }

    public Guid ClienteId { get; set; }

    public Cliente Cliente { get; set; } = null!;

    public Guid PacoteId { get; set; }

    public Pacote Pacote { get; set; } = null!;

    public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pendente";

    public ICollection<Alerta> Alertas { get; set; } = new List<Alerta>();
}
