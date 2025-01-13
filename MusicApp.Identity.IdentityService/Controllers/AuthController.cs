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
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
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
