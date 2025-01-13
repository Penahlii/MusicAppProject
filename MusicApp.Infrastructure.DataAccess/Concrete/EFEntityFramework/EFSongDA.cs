using MusicApp.Infrastructure.Core.Repository.DataAccess.EntityFramework;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Concrete.EFEntityFramework;

public class EFSongDA : EFEntityRepositoryBase<Song, MusicDataBaseContext>, ISongDA
{
    public EFSongDA(MusicDataBaseContext context) : base(context) { }
}
