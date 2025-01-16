using Microsoft.EntityFrameworkCore;
using MusicApp.Infrastructure.Core.Repository.DataAccess.EntityFramework;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Concrete.EFEntityFramework;

public class EFPlaylistDA : EFEntityRepositoryBase<Playlist, MusicDataBaseContext>, IPlaylistDA
{
    public EFPlaylistDA(MusicDataBaseContext context) : base(context) { }

    public async Task<Playlist?> GetPlaylistByIdAsync(int playlistId, string userId)
    {
        return await GetDbSet()
        .Include(p => p.PlaylistSongs)
        .FirstOrDefaultAsync(p => p.Id == playlistId && p.UserId == userId);
    }
}
