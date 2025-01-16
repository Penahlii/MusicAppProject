namespace MusicApp.Identity.IdentityService.DTOs;

public class UpdateProfileDTO
{
    public string UserId { get; set; }
    public string NewUsername { get; set; }
    public string NewEmail { get; set; }
}
