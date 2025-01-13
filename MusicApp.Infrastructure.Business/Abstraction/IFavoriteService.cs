using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Abstraction;

public interface IFavoriteService
{
    Task<Favorite> GetByIdAsync(int id);
    Task<List<Favorite>> GetAllAsync(Expression<Func<Favorite, bool>> filter = null);
    Task AddAsync(Favorite favorite);
    Task DeleteAsync(Favorite favorite);
    Task UpdateAsync(Favorite favorite);
}
