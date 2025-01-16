using MusicApp.Infrastructure.Entities.Entities;
using MusicApp.Music.MusicService.DTOs;
using MusicApp.Music.MusicService.DTOs.Requests;
using MusicApp.Music.MusicService.DTOs.Responses;

namespace MusicApp.Music.MusicService.Services.Abstraction;

public interface ISongInService
{
    Task<ServiceResponse<Song>> UploadSongAsync(UploadSongRequest request);
    Task<ServiceResponse<bool>> DeleteSongAsync(int songId);
    Task<ServiceResponse<SongDTO>> GetSongByIdAsync(int songId);
    Task<ServiceResponse<List<SongDTO>>> GetAllSongsAsync();
    Task<List<SongDTO>> GetAllSongsOfUser(string userId);
    Task<ServiceResponse<byte[]>> DownloadSongAsync(int songId);
}
