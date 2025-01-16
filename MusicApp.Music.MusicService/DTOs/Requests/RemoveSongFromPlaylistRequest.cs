namespace MusicApp.Music.MusicService.DTOs.Requests;

public class RemoveSongFromPlaylistRequest
{
    public int PlaylistId { get; set; }
    public int SongId { get; set; }
    public string UserId { get; set; } = string.Empty; // UserId from Identity
}
