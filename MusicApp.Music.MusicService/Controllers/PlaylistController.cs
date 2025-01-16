using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicApp.Music.MusicService.DTOs;
using MusicApp.Music.MusicService.DTOs.Requests;
using MusicApp.Music.MusicService.Services.Abstraction;
using System.Security.Claims;

namespace MusicApp.Music.MusicService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PlaylistController : ControllerBase
{
    private readonly IPlaylistInService _playlistInService;

    public PlaylistController(IPlaylistInService playlistInService)
    {
        _playlistInService = playlistInService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest("Invalid input.");

        var result = await _playlistInService.CreatePlaylistAsync(model.UserId, model.Title);

        if (!result.SuccessProperty)
            return BadRequest(result.Message);

        return Ok(result);
    }


    [HttpPost("add-song")]
    public async Task<IActionResult> AddSongToPlaylist([FromBody] AddSongToPlaylistRequest request)
    {
        if (request == null || request.PlaylistId <= 0 || request.SongId <= 0 || string.IsNullOrEmpty(request.UserId))
        {
            return BadRequest("Invalid request.");
        }

        var response = await _playlistInService.AddSongToPlaylistAsync(request);

        if (!response.SuccessProperty)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }

    [HttpGet("user-playlists/{userId}")]
    public async Task<IActionResult> GetUserPlaylists(string userId)
    {
        var response = await _playlistInService.GetPlaylistsByUserIdAsync(userId);

        if (!response.SuccessProperty)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpDelete("remove-song")]
    public async Task<IActionResult> RemoveSongFromPlaylist([FromBody] RemoveSongFromPlaylistRequest request)
    {
        var response = await _playlistInService.RemoveSongFromPlaylistAsync(request);

        if (!response.SuccessProperty)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("remove-playlist")]
    public async Task<IActionResult> RemovePlaylist([FromBody] RemovePlaylistRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            return Unauthorized(new { message = "User is not authenticated." });
        }

        var response = await _playlistInService.RemovePlaylistAsync(request.PlaylistId, request.UserId);

        if (!response.SuccessProperty)
        {
            return BadRequest(new { message = response.Message });
        }

        return Ok(new { message = "Playlist removed successfully." });
    }

    [HttpPost("playlist-songs")]
    public async Task<IActionResult> GetSongsByPlaylist([FromBody] GetSongsOfPlaylistRequest request)
    {
        var result = await _playlistInService.GetSongsByPlaylistIdAsync(request.PlaylistId, request.UserId);

        if (!result.SuccessProperty)
        {
            return BadRequest(result.Message);
        }

        return Ok(result);
    }

}
