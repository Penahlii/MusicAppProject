using MusicApp.Infrastructure.Core.Repository.DataAccess.EntityFramework;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Concrete.EFEntityFramework;

public class EFPlaylistSongDA : EFEntityRepositoryBase<PlaylistSong, MusicDataBaseContext>, IPlaylistSongDA
{
    public EFPlaylistSongDA(MusicDataBaseContext context) : base(context) { }
}
