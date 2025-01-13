using MusicApp.Infrastructure.Core.Repository.DataAccess;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Abstraction;

public interface ISongDA : IEntityRepository<Song>
{
}
