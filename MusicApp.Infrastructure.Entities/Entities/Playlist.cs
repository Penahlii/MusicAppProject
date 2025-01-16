using MusicApp.Infrastructure.Core.Repository.Abstraction;

namespace MusicApp.Infrastructure.Entities.Entities;

public class Playlist : IEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string UserId { get; set; } = string.Empty; // References Identity Service UserId
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Relationships
    public ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();
}
