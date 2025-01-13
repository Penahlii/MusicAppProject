using MusicApp.Infrastructure.Core.Repository.DataAccess;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Abstraction;

public interface IFavoriteDA : IEntityRepository<Favorite>
{
}
