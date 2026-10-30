using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddOrcamentosAndPasswordReset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VoosPacote");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataCadastro",
                table: "Usuarios",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordResetExpiresAt",
                table: "Usuarios",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "Usuarios",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataSolicitacao",
                table: "ReservasPacote",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RevogadoEm",
                table: "RefreshTokens",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataExpiracao",
                table: "RefreshTokens",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CriadoEm",
                table: "RefreshTokens",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<string>(
                name: "CidadesConexao",
                table: "Pacotes",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EhVooDireto",
                table: "Pacotes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ObservacoesVoo",
                table: "Pacotes",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PossuiVoo",
                table: "Pacotes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "QuantidadeParadas",
                table: "Pacotes",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Telefone",
                table: "Hoteis",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Endereco",
                table: "Hoteis",
                type: "character varying(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250);

            migrationBuilder.AlterColumn<string>(
                name: "EmailContato",
                table: "Hoteis",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AddColumn<string>(
                name: "GaleriaFotos",
                table: "Hoteis",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataCadastro",
                table: "Clientes",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CriadoEm",
                table: "Alertas",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.CreateTable(
                name: "Orcamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    ClienteNome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ClienteEmail = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    ClienteWhatsapp = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Validade = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ValorTotal = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    ValorProdutos = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    ValorTaxas = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    HotelId = table.Column<Guid>(type: "uuid", nullable: true),
                    PacoteId = table.Column<Guid>(type: "uuid", nullable: true),
                    TituloCustomizado = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    DestinoCustomizado = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    QuantidadeAdultos = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeCriancas = table.Column<int>(type: "integer", nullable: false),
                    IdadesCriancas = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    HotelNomeCustomizado = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    HotelEnderecoCustomizado = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    HotelFotoUrlCustomizada = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    HotelGaleriaFotos = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CheckInData = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CheckInHorario = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    CheckOutData = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CheckOutHorario = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    QuantidadeNoites = table.Column<int>(type: "integer", nullable: false),
                    TipoQuarto = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    NumeroQuarto = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CodigoVoucher = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    RegimeAlimentacao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PoliticaCancelamento = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    VooIdaCompanhia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    VooIdaOrigem = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    VooIdaDestino = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    VooIdaDataSaida = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    VooIdaHorarioSaida = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    VooIdaDataChegada = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    VooIdaHorarioChegada = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    VooIdaDuracao = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    VooIdaParadas = table.Column<int>(type: "integer", nullable: false),
                    VooIdaConexoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    VooVoltaCompanhia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    VooVoltaOrigem = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    VooVoltaDestino = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    VooVoltaDataSaida = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    VooVoltaHorarioSaida = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    VooVoltaDataChegada = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    VooVoltaHorarioChegada = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    VooVoltaDuracao = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    VooVoltaParadas = table.Column<int>(type: "integer", nullable: false),
                    VooVoltaConexoes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    VooIdaTrechosJson = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    VooVoltaTrechosJson = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    ObservacoesVoo = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CidadesConexao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IncluiTransfer = table.Column<bool>(type: "boolean", nullable: false),
                    IncluiSeguro = table.Column<bool>(type: "boolean", nullable: false),
                    ObservacoesPagamento = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    MensagemCliente = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    AgenteNome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    AgenteTelefone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    AgenteEmail = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    AgenteFotoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orcamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orcamentos_Hoteis_HotelId",
                        column: x => x.HotelId,
                        principalTable: "Hoteis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Orcamentos_Pacotes_PacoteId",
                        column: x => x.PacoteId,
                        principalTable: "Pacotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_HotelId",
                table: "Orcamentos",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_PacoteId",
                table: "Orcamentos",
                column: "PacoteId");

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_Token",
                table: "Orcamentos",
                column: "Token",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Orcamentos");

            migrationBuilder.DropColumn(
                name: "PasswordResetExpiresAt",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "CidadesConexao",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "EhVooDireto",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "ObservacoesVoo",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "PossuiVoo",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "QuantidadeParadas",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "GaleriaFotos",
                table: "Hoteis");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataCadastro",
                table: "Usuarios",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataSolicitacao",
                table: "ReservasPacote",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RevogadoEm",
                table: "RefreshTokens",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataExpiracao",
                table: "RefreshTokens",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CriadoEm",
                table: "RefreshTokens",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Telefone",
                table: "Hoteis",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Endereco",
                table: "Hoteis",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmailContato",
                table: "Hoteis",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataCadastro",
                table: "Clientes",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CriadoEm",
                table: "Alertas",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.CreateTable(
                name: "VoosPacote",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PacoteId = table.Column<Guid>(type: "uuid", nullable: false),
                    AeroportoChegada = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AeroportoConexao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    AeroportoPartida = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Companhia = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EhVooDireto = table.Column<bool>(type: "boolean", nullable: false),
                    FusoChegada = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    FusoPartida = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    HorarioChegada = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    HorarioChegadaConexao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HorarioPartida = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    HorarioSaidaConexao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NumeroVoo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    QuantidadeParadas = table.Column<int>(type: "integer", nullable: false),
                    TituloTrecho = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
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

            migrationBuilder.CreateIndex(
                name: "IX_VoosPacote_PacoteId",
                table: "VoosPacote",
                column: "PacoteId");
        }
    }
}
