using Microsoft.EntityFrameworkCore;
using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Entities.Entities;
using MusicApp.Music.MusicService.DTOs;
using MusicApp.Music.MusicService.DTOs.Requests;
using MusicApp.Music.MusicService.DTOs.Responses;
using MusicApp.Music.MusicService.Services.Abstraction;

namespace MusicApp.Music.MusicService.Services.Concrete;

public class PlaylistInService : IPlaylistInService
{
    private readonly IPlaylistService _playlistService;
    private readonly ISongService _songService;
    private readonly IdentityDataBaseContext _context;

    public PlaylistInService(IPlaylistService playlistService, ISongService songService, IdentityDataBaseContext context)
    {
        _playlistService = playlistService;
        _songService = songService;
        _context = context;
    }


    public async Task<ServiceResponse<bool>> AddSongToPlaylistAsync(AddSongToPlaylistRequest request)
    {
        var playlist = await _playlistService.GetPlaylistByIdAsync(request.PlaylistId, request.UserId);

        if (playlist == null)
        {
            return ServiceResponse<bool>.Failure("Playlist not found.");
        }

        var song = await _songService.GetByIdAsync(request.SongId);

        if (song == null)
        {
            return ServiceResponse<bool>.Failure("Song not found.");
        }

        var playlistSong = new PlaylistSong
        {
            PlaylistId = request.PlaylistId,
            SongId = request.SongId
        };

        playlist.PlaylistSongs.Add(playlistSong);

        await _playlistService.UpdateAsync(playlist);

        return ServiceResponse<bool>.Success(true, "Song added to playlist successfully.");
    }

    public async Task<ServiceResponse<PlaylistDTO>> CreatePlaylistAsync(string userId, string title)
    {
        if (string.IsNullOrEmpty(title))
        {
            return ServiceResponse<PlaylistDTO>.Failure("Playlist title is required.");
        }

        // Check if the user exists
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return ServiceResponse<PlaylistDTO>.Failure("User not found.");
        }

        var playlist = new Playlist
        {
            Title = title,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _playlistService.AddAsync(playlist);
        await _context.SaveChangesAsync();

        var playlistDto = new PlaylistDTO
        {
            Id = playlist.Id,
            Title = playlist.Title,
            UserId = playlist.UserId
        };

        return ServiceResponse<PlaylistDTO>.Success(playlistDto, "Playlist created successfully.");
    }

    public async Task<ServiceResponse<List<Playlist>>> GetPlaylistsByUserIdAsync(string userId)
    {
        var playlists = await _playlistService.GetAllAsync(p => p.UserId == userId);

        if (playlists == null || playlists.Count == 0)
        {
            return ServiceResponse<List<Playlist>>.Failure("No playlists found for this user.");
        }

        return ServiceResponse<List<Playlist>>.Success(playlists, "Playlists retrieved successfully.");
    }

    public async Task<ServiceResponse<bool>> RemovePlaylistAsync(int playlistId, string userId)
    {
        var playlist = await _playlistService.GetPlaylistByIdAsync(playlistId, userId);

        if (playlist == null)
        {
            return ServiceResponse<bool>.Failure("Playlist not found.");
        }

        // Remove the PlaylistSongs from the database
        await _playlistService.RemovePlaylistSongsAsync(playlistId);

        // Remove the playlist itself
        await _playlistService.DeleteAsync(playlist); 

        return ServiceResponse<bool>.Success(true, "Playlist removed successfully.");
    }

    public async Task<ServiceResponse<bool>> RemoveSongFromPlaylistAsync(RemoveSongFromPlaylistRequest request)
    {
        var playlist = await _playlistService.GetPlaylistByIdAsync(request.PlaylistId, request.UserId);

        if (playlist == null || playlist.UserId != request.UserId)
        {
            return ServiceResponse<bool>.Failure("Playlist not found or you don't have permission to modify it.");
        }

        var playlistSong = playlist.PlaylistSongs.FirstOrDefault(ps => ps.SongId == request.SongId);

        if (playlistSong == null)
        {
            return ServiceResponse<bool>.Failure("Song not found in this playlist.");
        }

        playlist.PlaylistSongs.Remove(playlistSong);

        await _playlistService.UpdateAsync(playlist);

        return ServiceResponse<bool>.Success(true, "Song removed from playlist successfully.");
    }
}
