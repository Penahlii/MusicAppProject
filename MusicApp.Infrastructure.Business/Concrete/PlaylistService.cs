using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Concrete;

public class PlaylistService : IPlaylistService
{
    private readonly IPlaylistDA _playlistDA;

    public PlaylistService(IPlaylistDA playlistDA)
    {
        _playlistDA = playlistDA;
    }

    public async Task AddAsync(Playlist playlist)
    {
        await _playlistDA.Add(playlist);
    }

    public async Task DeleteAsync(Playlist playlist)
    {
        await _playlistDA.Delete(playlist);
    }

    public async Task<List<Playlist>> GetAllAsync(Expression<Func<Playlist, bool>> filter = null)
    {
        return await _playlistDA.GetList(filter);
    }

    public async Task<Playlist> GetByIdAsync(int id)
    {
        return await _playlistDA.Get(ps => ps.Id == id);
    }

    public async Task UpdateAsync(Playlist playlist)
    {
        await _playlistDA.Update(playlist);
    }
}
