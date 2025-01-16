using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicApp.Infrastructure.Entities.Migrations.MusicDataBase
{
    /// <inheritdoc />
    public partial class SongEntityUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Songs_Artist",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Artist",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Songs");

            migrationBuilder.RenameColumn(
                name: "Album",
                table: "Songs",
                newName: "AlbumCover");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AlbumCover",
                table: "Songs",
                newName: "Album");

            migrationBuilder.AddColumn<string>(
                name: "Artist",
                table: "Songs",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Duration",
                table: "Songs",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Songs_Artist",
                table: "Songs",
                column: "Artist");
        }
    }
}
