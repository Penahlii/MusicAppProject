using Microsoft.AspNetCore.Mvc;
using MusicApp.Music.MusicService.Services.Abstraction;

namespace MusicApp.Music.MusicService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FavoriteController : ControllerBase
{
    private readonly IFavoriteInService _favoriteInService;

    public FavoriteController(IFavoriteInService favoriteInService)
    {
        _favoriteInService = favoriteInService;
    }


    [HttpPost("add")]
    public async Task<IActionResult> AddToFavorites([FromQuery] string userId, [FromQuery] int musicId)
    {
        await _favoriteInService.AddToFavoritesAsync(userId, musicId);
        return Ok(new { message = "Song added to favorites successfully." });
    }


    [HttpGet("user-favorites/{userId}")]
    public async Task<IActionResult> GetFavorites(string userId)
    {
        var favoriteSongs = await _favoriteInService.GetFavoriteSongsAsync(userId);
        return Ok(favoriteSongs);
    }


    [HttpDelete("remove")]
    public async Task<IActionResult> RemoveFromFavorites([FromQuery] string userId, [FromQuery] int musicId)
    {
        await _favoriteInService.RemoveFromFavoritesAsync(userId, musicId);
        return Ok(new { message = "Song removed from favorites successfully." });
    }
}
