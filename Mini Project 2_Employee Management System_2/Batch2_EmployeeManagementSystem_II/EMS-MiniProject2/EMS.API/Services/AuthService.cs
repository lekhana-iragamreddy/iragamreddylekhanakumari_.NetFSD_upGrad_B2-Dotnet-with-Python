using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EMS.API.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    public AuthService(AppDbContext context, IConfiguration config) { _context = context; _config = config; }

    public async Task<(bool Success, string Message)> RegisterAsync(RegisterRequestDto request)
    {
        var username = request.Username.Trim();
        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower())) return (false, "Username already exists");
        var role = string.IsNullOrWhiteSpace(request.Role) ? "Viewer" : request.Role.Trim();
        if (role is not ("Admin" or "Viewer")) return (false, "Role must be Admin or Viewer");
        var user = new AppUser { Username = username, PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12), Role = role, CreatedAt = DateTime.UtcNow };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return (true, "Registration successful");
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var username = request.Username.Trim();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return new AuthResponseDto { Success = false, Message = "Invalid credentials" };
        return new AuthResponseDto { Success = true, Username = user.Username, Role = user.Role, Token = GenerateToken(user), Message = "Login successful" };
    }

    private string GenerateToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpiryHours"] ?? "8")),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
