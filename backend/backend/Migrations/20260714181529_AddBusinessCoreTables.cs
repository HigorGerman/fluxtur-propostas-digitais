using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessCoreTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hoteis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Endereco = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    Cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Estrelas = table.Column<int>(type: "integer", nullable: false),
                    FotoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    EmailContato = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hoteis", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pacotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Titulo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Destino = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    HotelId = table.Column<Guid>(type: "uuid", nullable: false),
                    FotoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    PrecoBase = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    DescricaoAtividades = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pacotes_Hoteis_HotelId",
                        column: x => x.HotelId,
                        principalTable: "Hoteis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReservasPacote",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClienteId = table.Column<Guid>(type: "uuid", nullable: false),
                    PacoteId = table.Column<Guid>(type: "uuid", nullable: false),
                    DataSolicitacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservasPacote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservasPacote_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReservasPacote_Pacotes_PacoteId",
                        column: x => x.PacoteId,
                        principalTable: "Pacotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VoosPacote",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PacoteId = table.Column<Guid>(type: "uuid", nullable: false),
                    TituloTrecho = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NumeroVoo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Companhia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AeroportoPartida = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AeroportoChegada = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    HorarioPartida = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FusoPartida = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    HorarioChegada = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FusoChegada = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UrlDocumento = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoosPacote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VoosPacote_Pacotes_PacoteId",
                        column: x => x.PacoteId,
                        principalTable: "Pacotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alertas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ReservaPacoteId = table.Column<Guid>(type: "uuid", nullable: false),
                    Lido = table.Column<bool>(type: "boolean", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alertas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alertas_ReservasPacote_ReservaPacoteId",
                        column: x => x.ReservaPacoteId,
                        principalTable: "ReservasPacote",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alertas_ReservaPacoteId",
                table: "Alertas",
                column: "ReservaPacoteId");

            migrationBuilder.CreateIndex(
                name: "IX_Pacotes_HotelId",
                table: "Pacotes",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservasPacote_ClienteId",
                table: "ReservasPacote",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservasPacote_PacoteId",
                table: "ReservasPacote",
                column: "PacoteId");

            migrationBuilder.CreateIndex(
                name: "IX_VoosPacote_PacoteId",
                table: "VoosPacote",
                column: "PacoteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Alertas");

            migrationBuilder.DropTable(
                name: "VoosPacote");

            migrationBuilder.DropTable(
                name: "ReservasPacote");

            migrationBuilder.DropTable(
                name: "Pacotes");

            migrationBuilder.DropTable(
                name: "Hoteis");
        }
    }
}
