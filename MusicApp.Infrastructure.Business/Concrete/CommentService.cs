using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Concrete;

public class CommentService : ICommentService
{
    private readonly ICommentDA _commentDA;

    public CommentService(ICommentDA commentDA)
    {
        _commentDA = commentDA;
    }

    public async Task AddAsync(Comment comment)
    {
       await _commentDA.Add(comment);
    }

    public async Task DeleteAsync(Comment comment)
    {
        await _commentDA.Delete(comment);
    }

    public async Task<List<Comment>> GetAllAsync(Expression<Func<Comment, bool>> filter = null)
    {
        return await _commentDA.GetList(filter);
    }

    public async Task<Comment> GetByIdAsync(int id)
    {
        return await _commentDA.Get(c => c.Id == id);
    }

    public async Task UpdateAsync(Comment comment)
    {
        await _commentDA.Update(comment);
    }
}
