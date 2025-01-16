namespace MusicApp.Music.MusicService.DTOs.Requests;

public class RemovePlaylistRequest
{
    public string UserId { get; set; }
    public int PlaylistId { get; set; }
}
