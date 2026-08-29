using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<Cliente> Clientes { get; set; } = null!;
    public DbSet<Hotel> Hoteis { get; set; } = null!;
    public DbSet<Pacote> Pacotes { get; set; } = null!;
    public DbSet<ReservaPacote> ReservasPacote { get; set; } = null!;
    public DbSet<Alerta> Alertas { get; set; } = null!;
    public DbSet<Orcamento> Orcamentos { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Orcamento>(entity =>
        {
            entity.HasIndex(o => o.Token).IsUnique();

            entity.HasOne(o => o.Hotel)
                .WithMany()
                .HasForeignKey(o => o.HotelId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            entity.HasOne(o => o.Pacote)
                .WithMany()
                .HasForeignKey(o => o.PacoteId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasOne(rt => rt.Usuario)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            entity.HasOne(rt => rt.Cliente)
                .WithMany(c => c.RefreshTokens)
                .HasForeignKey(rt => rt.ClienteId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasIndex(c => c.Cpf).IsUnique();
        });

        modelBuilder.Entity<Pacote>(entity =>
        {
            entity.HasOne(p => p.Hotel)
                .WithMany(h => h.Pacotes)
                .HasForeignKey(p => p.HotelId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ReservaPacote>(entity =>
        {
            entity.HasOne(r => r.Cliente)
                .WithMany()
                .HasForeignKey(r => r.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Pacote)
                .WithMany(p => p.Reservas)
                .HasForeignKey(r => r.PacoteId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Alerta>(entity =>
        {
            entity.HasOne(a => a.ReservaPacote)
                .WithMany(r => r.Alertas)
                .HasForeignKey(a => a.ReservaPacoteId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
