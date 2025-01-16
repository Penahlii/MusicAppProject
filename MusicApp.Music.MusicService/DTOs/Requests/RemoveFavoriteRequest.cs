namespace MusicApp.Music.MusicService.DTOs.Requests;

public class RemoveFavoriteRequest
{
    public int SongId { get; set; }
    public string UserId { get; set; } = string.Empty; // UserId from Identity
}
