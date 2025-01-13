using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Abstraction;

public interface IPlaylistSongService 
{
    Task<PlaylistSong> GetByIdAsync(int id);
    Task<List<PlaylistSong>> GetAllAsync(Expression<Func<PlaylistSong, bool>> filter = null);
    Task AddAsync(PlaylistSong playlistSong);
    Task DeleteAsync(PlaylistSong playlistSong);
    Task UpdateAsync(PlaylistSong playlistSong);
}
