using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;

namespace EMS.Tests.Services;

public class AuthServiceTests
{
    private AppDbContext _context = null!;
    private AuthService _service = null!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        _context = new AppDbContext(options);
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> { { "Jwt:Key", "TestSecretKey_32CharactersLong!!" }, { "Jwt:Issuer", "EMS.API" }, { "Jwt:Audience", "EMS.Client" }, { "Jwt:ExpiryHours", "8" } }).Build();
        _service = new AuthService(_context, config);
    }

    [Test]
    public async Task Register_NewUser_ReturnsSuccess()
    {
        var result = await _service.RegisterAsync(new RegisterRequestDto { Username = "user1", Password = "pass123", Role = "Admin" });
        Assert.That(result.Success, Is.True);
    }

    [Test]
    public async Task Login_InvalidUser_ReturnsFail()
    {
        var result = await _service.LoginAsync(new LoginRequestDto { Username = "wrong", Password = "123456" });
        Assert.That(result.Success, Is.False);
    }

    [Test]
    public async Task Login_ValidUser_ReturnsToken()
    {
        await _service.RegisterAsync(new RegisterRequestDto { Username = "user2", Password = "pass123", Role = "Viewer" });
        var result = await _service.LoginAsync(new LoginRequestDto { Username = "user2", Password = "pass123" });
        Assert.That(result.Success, Is.True);
        Assert.That(result.Token, Is.Not.Empty);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }
}