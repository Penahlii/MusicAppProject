using MusicApp.Infrastructure.Core.Repository.DataAccess.EntityFramework;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Concrete.EFEntityFramework;

public class EFFavoriteDA : EFEntityRepositoryBase<Favorite, MusicDataBaseContext>, IFavoriteDA
{
    public EFFavoriteDA(MusicDataBaseContext context) : base(context) { }
}
