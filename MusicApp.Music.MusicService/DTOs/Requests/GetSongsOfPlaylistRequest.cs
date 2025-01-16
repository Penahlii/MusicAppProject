namespace MusicApp.Music.MusicService.DTOs.Requests;

public class GetSongsOfPlaylistRequest
{
    public string UserId { get; set; }
    public int PlaylistId { get; set; }
}
