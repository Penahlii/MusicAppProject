namespace MusicApp.Music.MusicService.DTOs.Requests;

public class CreatePlaylistRequest
{
    public string UserId { get; set; } = string.Empty; // UserId from Identity
    public string Name { get; set; } = string.Empty;
}
