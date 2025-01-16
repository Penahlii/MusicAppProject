using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.Entities.Entities;
using MusicApp.Music.MusicService.DTOs;
using MusicApp.Music.MusicService.DTOs.Requests;
using MusicApp.Music.MusicService.DTOs.Responses;
using MusicApp.Music.MusicService.Helpers;
using MusicApp.Music.MusicService.Services.Abstraction;

namespace MusicApp.Music.MusicService.Services.Concrete;

public class SongInService : ISongInService
{
    private readonly ISongService _songService;
    private readonly IPlaylistService _playlistService;
    private readonly CloudinaryService _cloudinaryService;
    private readonly IMapper _mapper;

    public SongInService(ISongService songService, CloudinaryService cloudinaryService, IMapper mapper, IPlaylistService playlistService)
    {
        _songService = songService;
        _cloudinaryService = cloudinaryService;
        _mapper = mapper;
        _playlistService = playlistService;
    }

    public async Task<ServiceResponse<Song>> UploadSongAsync(UploadSongRequest request)
    {
        try
        {
            // Upload the song file to Cloudinary
            var songFileUrl = await _cloudinaryService.UploadFileAsync(request.SongFile, "songs");

            // Upload the cover image to Cloudinary
            var coverImageUrl = await _cloudinaryService.UploadImageAsync(request.CoverImage, "covers");

            // Create the song object
            var song = new Song
            {
                Title = request.Title,
                UploadedBy = request.UploadedBy,
                FilePath = songFileUrl,
                AlbumCover = coverImageUrl,
                UploadedAt = DateTime.UtcNow
            };

            // Save the song to the database
            await _songService.AddAsync(song);

            // Return success response with the song object
            return ServiceResponse<Song>.Success(song, "Song uploaded successfully!");
        }
        catch (Exception ex)
        {
            // Return failure response if an error occurs
            return ServiceResponse<Song>.Failure($"An error occurred: {ex.Message}");
        }
    }


    public async Task<ServiceResponse<bool>> DeleteSongAsync(int songId)
    {
        try
        {
            // Retrieve the song from the database
            var song = await _songService.GetByIdAsync(songId);

            if (song == null)
            {
                return ServiceResponse<bool>.Failure("Song not found.");
            }

            //// Remove the song file and cover image from Cloudinary
            //await _cloudinaryService.DeleteFileAsync(song.FilePath);
            //if (!string.IsNullOrEmpty(song.AlbumCover))
            //{
            //    await _cloudinaryService.DeleteFileAsync(song.AlbumCover);
            //}

            // Delete the song from the database
            await _songService.DeleteAsync(song);

            // Return success response
            return ServiceResponse<bool>.Success(true, "Song deleted successfully.");
        }
        catch (Exception ex)
        {
            // Return failure response with error message
            return ServiceResponse<bool>.Failure($"An error occurred: {ex.Message}");
        }
    }

    public async Task<ServiceResponse<SongDTO>> GetSongByIdAsync(int songId)
    {
        // Retrieve the song from the database
        var song = await _songService.GetAllAsync(s => s.Id == songId);

        // Check if the song exists
        if (song == null)
        {
            return ServiceResponse<SongDTO>.Failure("Song not found.");
        }

        // Use AutoMapper to map the song to SongDTO
        var songDto = _mapper.Map<SongDTO>(song);

        // Return the result
        return ServiceResponse<SongDTO>.Success(songDto, "Song retrieved successfully.");
    }

    public async Task<ServiceResponse<List<SongDTO>>> GetAllSongsAsync()
    {
        // Retrieve all songs from the database
        var songs = await _songService.GetAllAsync();

        // Check if there are any songs
        if (songs == null || !songs.Any())
        {
            return ServiceResponse<List<SongDTO>>.Failure("No songs found.");
        }

        var songDtos = _mapper.Map<List<SongDTO>>(songs);

        return ServiceResponse<List<SongDTO>>.Success(songDtos, "Songs retrieved successfully.");
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

    public async Task<List<SongDTO>> GetAllSongsOfUser(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));

        var songs = await _songService.GetAllAsync(s => s.UploadedBy == userId);

        var songDtos = _mapper.Map<List<SongDTO>>(songs);
        return songDtos;
    }

    public async Task<ServiceResponse<byte[]>> DownloadSongAsync(int songId)
    {
        try
        {
            // Retrieve the song entity from the database
            var song = await _songService.GetByIdAsync(songId);
            if (song == null)
            {
                return ServiceResponse<byte[]>.Failure("Song not found.");
            }

            // Get the Cloudinary URL for the file
            var songUrl = song.FilePath;
            if (string.IsNullOrEmpty(songUrl))
            {
                return ServiceResponse<byte[]>.Failure("Song file URL is missing.");
            }

            // Download the file using HttpClient
            using var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(songUrl);

            if (!response.IsSuccessStatusCode)
            {
                return ServiceResponse<byte[]>.Failure("Failed to download the song file.");
            }

            var fileData = await response.Content.ReadAsByteArrayAsync();

            return ServiceResponse<byte[]>.Success(fileData, "Song downloaded successfully.");
        }
        catch (Exception ex)
        {
            return ServiceResponse<byte[]>.Failure($"An error occurred: {ex.Message}");
        }
    }
}
