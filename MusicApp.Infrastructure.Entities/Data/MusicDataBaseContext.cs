using Microsoft.EntityFrameworkCore;
using MusicApp.Infrastructure.Entities.Entities;

namespace MusicApp.Infrastructure.Entities.Data;

public class MusicDataBaseContext : DbContext
{
    public MusicDataBaseContext(DbContextOptions<MusicDataBaseContext> options) : base(options) { }

    // DbSets for entities
    public virtual DbSet<Song> Songs { get; set; } = null!;
    public virtual DbSet<Playlist> Playlists { get; set; } = null!;
    public virtual DbSet<PlaylistSong> PlaylistSongs { get; set; } = null!;
    public virtual DbSet<Favorite> Favorites { get; set; } = null!;
    public virtual DbSet<Comment> Comments { get; set; } = null!;

    //OnModelCreating to configure relationships and constraints
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Song relationships
        modelBuilder.Entity<Song>()
            .HasMany(s => s.PlaylistSongs)
            .WithOne(ps => ps.Song)
            .HasForeignKey(ps => ps.SongId);

        modelBuilder.Entity<Song>()
            .HasMany(s => s.Favorites)
            .WithOne(f => f.Song)
            .HasForeignKey(f => f.SongId);

        modelBuilder.Entity<Song>()
            .HasMany(s => s.Comments)
            .WithOne(c => c.Song)
            .HasForeignKey(c => c.SongId);

        // Playlist relationships
        modelBuilder.Entity<Playlist>()
            .HasMany(p => p.PlaylistSongs)
            .WithOne(ps => ps.Playlist)
            .HasForeignKey(ps => ps.PlaylistId);

        // PlaylistSong relationships (many-to-many between Playlist and Song)
        modelBuilder.Entity<PlaylistSong>()
            .HasKey(ps => ps.Id);

        // Favorite relationships
        modelBuilder.Entity<Favorite>()
            .HasKey(f => f.Id);

        // Comment relationships
        modelBuilder.Entity<Comment>()
            .HasKey(c => c.Id);

        // Indexing for performance
        modelBuilder.Entity<Song>()
            .HasIndex(s => s.Artist);

        modelBuilder.Entity<Playlist>()
            .HasIndex(p => p.UserId);

        modelBuilder.Entity<Comment>()
            .HasIndex(c => c.UserId);
    }
}
