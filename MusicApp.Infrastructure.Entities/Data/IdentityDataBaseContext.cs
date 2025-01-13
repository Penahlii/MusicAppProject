using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.Entities.Data;

public class IdentityDataBaseContext : IdentityDbContext<ApplicationUser>
{
    public IdentityDataBaseContext(DbContextOptions<IdentityDataBaseContext> options) : base(options) { }

}
