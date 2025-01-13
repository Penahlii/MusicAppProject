using MusicApp.Infrastructure.Core.Repository.DataAccess.EntityFramework;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.DataAccess.Concrete.EFEntityFramework;

public class EFCommentDA : EFEntityRepositoryBase<Comment, MusicDataBaseContext>, ICommentDA
{
    public EFCommentDA(MusicDataBaseContext context) : base(context) { }
}
