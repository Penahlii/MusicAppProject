using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Music.MusicService.Services.Abstraction;

public interface IFavoriteInService
{
    Task<List<Song>> GetFavoriteSongsAsync(string userId);
    Task AddToFavoritesAsync(string userId, int musicId);
    Task RemoveFromFavoritesAsync(string userId, int musicId);
}
