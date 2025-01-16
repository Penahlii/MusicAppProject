namespace MusicApp.Music.MusicService.DTOs;

public class SongDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? AlbumCover { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string? UploadedBy { get; set; } // UserId from Identity Service
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
