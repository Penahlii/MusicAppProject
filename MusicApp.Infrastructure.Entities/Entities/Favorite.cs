using MusicApp.Infrastructure.Core.Repository.Abstraction;

namespace MusicApp.Infrastructure.Entities.Entities;

public class Favorite : IEntity // Favorites will be stored in database apart from REDIS for Data Persistence
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty; // References Identity Service UserId
    public int SongId { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Song Song { get; set; } = null!;
}
