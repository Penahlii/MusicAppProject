using MusicApp.Infrastructure.Core.Repository.DataAccess.EntityFramework;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Concrete.EFEntityFramework;

public class EFPlaylistDA : EFEntityRepositoryBase<Playlist, MusicDataBaseContext>, IPlaylistDA
{
    public EFPlaylistDA(MusicDataBaseContext context) : base(context) { }
}
