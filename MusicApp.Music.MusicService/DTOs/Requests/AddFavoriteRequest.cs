namespace MusicApp.Music.MusicService.DTOs.Requests;

public class AddFavoriteRequest
{
    public int SongId { get; set; }
    public string UserId { get; set; } = string.Empty; // UserId from Identity
}
