using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicApp.Music.MusicService.DTOs.Requests;
using MusicApp.Music.MusicService.Services.Abstraction;

namespace MusicApp.Music.MusicService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SongController : ControllerBase
{
    private readonly ISongInService _songInService;
    private readonly ILogger<SongController> _logger;


    public SongController(ISongInService songInService, ILogger<SongController> logger)
    {
        _songInService = songInService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadSong([FromForm] UploadSongRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid request.");
        }

        var result = await _songInService.UploadSongAsync(request);

        if (!result.SuccessProperty)
        {
            return BadRequest(result.Message);
        }

        return Ok(result);
    }

    [HttpGet("usersongs/{userId}")]
    public async Task<IActionResult> GetSongsByUser(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return BadRequest("User ID cannot be null or empty.");
        }

        try
        {
            var songs = await _songInService.GetAllSongsOfUser(userId);

            if (songs == null || !songs.Any())
            {
                return NotFound($"No songs found for user with ID '{userId}'.");
            }

            return Ok(songs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving songs for user ID '{userId}'.");
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    [HttpDelete("{songId}")]
    public async Task<IActionResult> DeleteSong(int songId)
    {
        var response = await _songInService.DeleteSongAsync(songId);

        return Ok(new { message = response.Message });
    }

    [HttpGet("all-songs")]
    public async Task<IActionResult> GetAllSongs()
    {
        try
        {
            var result = await _songInService.GetAllSongsAsync();

            if (!result.SuccessProperty)
                return NotFound(result.Message);

            return Ok(result.Data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("download/{songId}")]
    public async Task<IActionResult> DownloadSong(int songId)
    {
        var response = await _songInService.DownloadSongAsync(songId);

        if (!response.SuccessProperty)
        {
            return BadRequest(response.Message);
        }

        // Return the file for download
        var fileName = $"song_{songId}.mp3";
        return File(response.Data, "application/octet-stream", fileName);
    }

}
