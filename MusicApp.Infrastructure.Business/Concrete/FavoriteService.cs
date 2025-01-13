using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Concrete;

public class FavoriteService : IFavoriteService
{ 
    private readonly IFavoriteDA _favoriteDA;

    public FavoriteService(IFavoriteDA favoriteDA)
    {
        _favoriteDA = favoriteDA;
    }

    public async Task AddAsync(Favorite favorite)
    {
        await _favoriteDA.Add(favorite);
    }

    public async Task DeleteAsync(Favorite favorite)
    {
        await _favoriteDA.Delete(favorite);
    }

    public async Task<List<Favorite>> GetAllAsync(Expression<Func<Favorite, bool>> filter = null)
    {
        return await _favoriteDA.GetList(filter);
    }

    public async Task<Favorite> GetByIdAsync(int id)
    {
        return await _favoriteDA.Get(f => f.Id == id);
    }

    public async Task UpdateAsync(Favorite favorite)
    {
        await _favoriteDA.Update(favorite);
    }
}
