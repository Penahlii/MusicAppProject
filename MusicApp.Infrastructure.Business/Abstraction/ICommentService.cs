using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Abstraction;

public interface ICommentService
{
    Task<Comment> GetByIdAsync(int id);
    Task<List<Comment>> GetAllAsync(Expression<Func<Comment, bool>> filter = null);
    Task AddAsync(Comment comment);
    Task DeleteAsync(Comment comment);
    Task UpdateAsync(Comment comment);
}
