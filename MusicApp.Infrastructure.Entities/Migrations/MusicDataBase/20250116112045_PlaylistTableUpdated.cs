using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicApp.Infrastructure.Entities.Migrations.MusicDataBase
{
    /// <inheritdoc />
    public partial class PlaylistTableUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Playlists",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Playlists");
        }
    }
}
