using MusicApp.Infrastructure.Core.Repository.Abstraction;

namespace MusicApp.Infrastructure.Entities.Entities;

public class Song : IEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public string? Album { get; set; }
    public string? Genre { get; set; }
    public int? Duration { get; set; } // Duration in seconds
    public string FilePath { get; set; } = string.Empty;
    public string? UploadedBy { get; set; } // UserId from Identity Service
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
