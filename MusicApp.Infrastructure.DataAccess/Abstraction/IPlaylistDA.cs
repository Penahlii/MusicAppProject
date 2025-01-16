using MusicApp.Infrastructure.Core.Repository.DataAccess;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Abstraction;

public interface IPlaylistDA : IEntityRepository<Playlist>
{
    Task<Playlist?> GetPlaylistByIdAsync(int playlistId, string userId);
    Task RemovePlaylistSongsAsync(int playlistId);
}
