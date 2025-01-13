using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Concrete;

public class PlaylistSongService : IPlaylistSongService
{
    private readonly IPlaylistSongDA _playlistSongDA;

    public PlaylistSongService(IPlaylistSongDA playlistSongDA)
    {
        _playlistSongDA = playlistSongDA;
    }

    public async Task AddAsync(PlaylistSong playlistSong)
    {
        await _playlistSongDA.Add(playlistSong);
    }

    public async Task DeleteAsync(PlaylistSong playlistSong)
    {
        await _playlistSongDA.Delete(playlistSong); 
    }

    public async Task<List<PlaylistSong>> GetAllAsync(Expression<Func<PlaylistSong, bool>> filter = null)
    {
        return await _playlistSongDA.GetList(filter);
    }

    public async Task<PlaylistSong> GetByIdAsync(int id)
    {
        return await _playlistSongDA.Get(psS => psS.Id == id);
    }

    public async Task UpdateAsync(PlaylistSong playlistSong)
    {
        await _playlistSongDA.Update(playlistSong);
    }
}
