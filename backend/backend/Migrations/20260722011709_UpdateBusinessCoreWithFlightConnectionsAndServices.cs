using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBusinessCoreWithFlightConnectionsAndServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AeroportoConexao",
                table: "VoosPacote",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EhVooDireto",
                table: "VoosPacote",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "HorarioChegadaConexao",
                table: "VoosPacote",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "HorarioSaidaConexao",
                table: "VoosPacote",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuantidadeParadas",
                table: "VoosPacote",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CidadeDestino",
                table: "Pacotes",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescricaoSeguro",
                table: "Pacotes",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescricaoTransfer",
                table: "Pacotes",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EstadoDestino",
                table: "Pacotes",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "PossuiSeguroViagem",
                table: "Pacotes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PossuiTransfer",
                table: "Pacotes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AeroportoConexao",
                table: "VoosPacote");

            migrationBuilder.DropColumn(
                name: "EhVooDireto",
                table: "VoosPacote");

            migrationBuilder.DropColumn(
                name: "HorarioChegadaConexao",
                table: "VoosPacote");

            migrationBuilder.DropColumn(
                name: "HorarioSaidaConexao",
                table: "VoosPacote");

            migrationBuilder.DropColumn(
                name: "QuantidadeParadas",
                table: "VoosPacote");

            migrationBuilder.DropColumn(
                name: "CidadeDestino",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "DescricaoSeguro",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "DescricaoTransfer",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "EstadoDestino",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "PossuiSeguroViagem",
                table: "Pacotes");

            migrationBuilder.DropColumn(
                name: "PossuiTransfer",
                table: "Pacotes");
        }
    }
}
