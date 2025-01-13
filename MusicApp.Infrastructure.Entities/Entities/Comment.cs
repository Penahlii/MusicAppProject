using MusicApp.Infrastructure.Core.Repository.Abstraction;

namespace MusicApp.Infrastructure.Entities.Entities;

public class Comment : IEntity
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty; // References Identity Service UserId
    public int SongId { get; set; }
    public string CommentText { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Song Song { get; set; } = null!;
}
