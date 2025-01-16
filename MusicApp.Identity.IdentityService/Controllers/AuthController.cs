using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MusicApp.Identity.IdentityService.DTOs;
using MusicApp.Infrastructure.Entities.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MusicApp.Identity.IdentityService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp(SignUpDTO dto)
    {
        var newUser = new ApplicationUser
        {
            UserName = dto.UserName,
            Email = dto.Email,
        };

        var result = await _userManager.CreateAsync(newUser, dto.Password);
        if (result.Succeeded)
        {
            if (!await _roleManager.RoleExistsAsync("User"))
                await _roleManager.CreateAsync(new IdentityRole("User"));

            await _userManager.AddToRoleAsync(newUser, "User");
            return Ok(new { Status = "Success", Message = "User created Successfully" });
        }
        return BadRequest(new { Status = "Error", Message = "User creation failed!", Errors = result.Errors });
    }

    [HttpPost("signin")]
    public async Task<IActionResult> SignIn([FromBody] SignInDTO dto)
    {
        var normalizedUserName = dto.UserName.ToUpperInvariant();
        var user = await _userManager.FindByNameAsync(normalizedUserName);

        if (user != null && await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = GetToken(authClaims);

            return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token), Expiration = token.ValidTo });
        }
        return Unauthorized(new { Status = "Error", Message = "Invalid username or password" });
    }


    [HttpPut("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest("Invalid input.");

        // Retrieve the user by their ID
        var user = await _userManager.FindByIdAsync(model.UserId);
        if (user == null)
            return NotFound("User not found.");

        // Update the username
        user.UserName = model.NewUsername;

        // Update the email
        user.Email = model.NewEmail;

        // Save changes to the user
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest($"Failed to update profile: {errors}");
        }

        return Ok("Profile updated successfully.");
    }


    [HttpDelete("delete-account/{userId}")]
    [Authorize]
    public async Task<IActionResult> DeleteAccount(string userId)
    {
        // Get the currently authenticated user's ID
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (currentUserId == null)
        {
            return Unauthorized(new { Status = "Error", Message = "Unauthorized request." });
        }

        // Retrieve the user to be deleted
        var userToDelete = await _userManager.FindByIdAsync(userId);
        if (userToDelete == null)
        {
            return NotFound(new { Status = "Error", Message = "User not found." });
        }

        // Check if the user is an Admin
        var isAdmin = (await _userManager.GetRolesAsync(userToDelete)).Contains("Admin");

        // Allow only the user themselves or an Admin to delete the account
        if (currentUserId != userToDelete.Id && !isAdmin)
        {
            return Forbid(); // User can only delete their own account
        }

        // Delete the user
        var result = await _userManager.DeleteAsync(userToDelete);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest(new { Status = "Error", Message = $"Failed to delete account: {errors}" });
        }

        return Ok(new { Status = "Success", Message = "Account deleted successfully." });
    }


    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigninKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Issuer"],
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256)
            );

        return token;
    }
}
