using MusicApp.Infrastructure.Entities.Entities;
using MusicApp.Music.MusicService.DTOs;
using MusicApp.Music.MusicService.DTOs.Requests;
using MusicApp.Music.MusicService.DTOs.Responses;

namespace MusicApp.Music.MusicService.Services.Abstraction;

public interface IPlaylistInService
{
    Task<ServiceResponse<PlaylistDTO>> CreatePlaylistAsync(string userId, string title);
    Task<ServiceResponse<bool>> AddSongToPlaylistAsync(AddSongToPlaylistRequest request);
    Task<ServiceResponse<List<Playlist>>> GetPlaylistsByUserIdAsync(string userId);
    Task<ServiceResponse<bool>> RemoveSongFromPlaylistAsync(RemoveSongFromPlaylistRequest request);
    Task<ServiceResponse<bool>> RemovePlaylistAsync(int playlistId, string userId);
}
