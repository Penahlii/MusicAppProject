using System.ComponentModel.DataAnnotations;

namespace MusicApp.Music.MusicService.DTOs;

public class CreatePlaylistDTO
{
    public string UserId { get; set; }
    [Required]
    public string Title { get; set; }
}
