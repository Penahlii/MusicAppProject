namespace MusicApp.Music.MusicService.DTOs.Requests;

public class UploadSongRequest
{
    public string Title { get; set; } = string.Empty;
    public string UploadedBy { get; set; } = string.Empty; // UserId from Identity
    public IFormFile SongFile { get; set; } = null!;
    public IFormFile CoverImage { get; set; } = null!;
}
