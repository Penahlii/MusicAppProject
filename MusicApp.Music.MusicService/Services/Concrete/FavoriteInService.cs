using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.Entities.Entities;
using MusicApp.Music.MusicService.Services.Abstraction;
using StackExchange.Redis;

namespace MusicApp.Music.MusicService.Services.Concrete;

public class FavoriteInService : IFavoriteInService
{
    private readonly IDatabase _redisDatabase;
    private readonly ISongService _songService;

    public FavoriteInService(IConnectionMultiplexer redisConnection, ISongService songService)
    {
        _redisDatabase = redisConnection.GetDatabase();
        _songService = songService;
    }

    public async Task AddToFavoritesAsync(string userId, int musicId)
    {
        await _redisDatabase.ListRightPushAsync($"favorites:{userId}", musicId.ToString());
    }

    public async Task<List<Song>> GetFavoriteSongsAsync(string userId)
    {
        // Get favorite song IDs from Redis
        var favoriteIds = await _redisDatabase.ListRangeAsync($"favorites:{userId}");
        var songIds = favoriteIds.Select(fav => (int)fav).ToList();

        if (!songIds.Any())
            return new List<Song>();

        // Fetch song details from the repository
        var favoriteSongs = new List<Song>();
        foreach (var songId in songIds)
        {
            var song = await _songService.GetByIdAsync(songId);
            if (song != null)
                favoriteSongs.Add(song);
        }

        return favoriteSongs;
    }

    public async Task RemoveFromFavoritesAsync(string userId, int musicId)
    {
        await _redisDatabase.ListRemoveAsync($"favorites:{userId}", musicId.ToString());
    }
}
