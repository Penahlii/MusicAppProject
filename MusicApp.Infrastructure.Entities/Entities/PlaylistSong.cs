using MusicApp.Infrastructure.Core.Repository.Abstraction;

namespace MusicApp.Infrastructure.Entities.Entities;

public class PlaylistSong : IEntity
{
    public int Id { get; set; }
    public int PlaylistId { get; set; }
    public int SongId { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public Playlist Playlist { get; set; } = null!;
    public Song Song { get; set; } = null!;
}
