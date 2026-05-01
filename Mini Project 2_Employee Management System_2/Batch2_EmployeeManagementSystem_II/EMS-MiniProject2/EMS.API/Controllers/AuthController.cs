using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    public AuthController(AuthService authService) { _authService = authService; }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var result = await _authService.RegisterAsync(request);
        if (!result.Success) return Conflict(new { success = false, message = result.Message });
        return Ok(new { success = true, message = result.Message });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var result = await _authService.LoginAsync(request);
        if (!result.Success) return Unauthorized(new { success = false, message = result.Message });
        return Ok(result);
    }
}
