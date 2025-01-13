using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Abstraction;

public interface ISongService
{
    Task<Song> GetByIdAsync(int id);
    Task<List<Song>> GetAllAsync(Expression<Func<Song, bool>> filter = null);
    Task AddAsync(Song song);
    Task DeleteAsync(Song song);
    Task UpdateAsync(Song song);
}
