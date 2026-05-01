using EMS.API.DTOs;
using EMS.API.Models;
using EMS.API.Services;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Services;

public class EmployeeServiceTests
{
    [Test]
    public async Task GetByIdAsync_ValidId_ReturnsMappedDto()
    {
        var repo = new Mock<IEmployeeRepository>();
        repo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Employee { Id = 1, FirstName = "Priya", LastName = "Prabhu", Email = "p@h.com", Phone = "1234567890", Department = "HR", Designation = "HR Executive", Salary = 1000, JoinDate = DateTime.UtcNow, Status = "Active" });
        var service = new EmployeeService(repo.Object);
        var result = await service.GetByIdAsync(1);
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.FirstName, Is.EqualTo("Priya"));
    }

    [Test]
    public async Task GetByIdAsync_InvalidId_ReturnsNull()
    {
        var repo = new Mock<IEmployeeRepository>();
        repo.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Employee?)null);
        var service = new EmployeeService(repo.Object);
        var result = await service.GetByIdAsync(999);
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task CreateAsync_DuplicateEmail_ReturnsFailure()
    {
        var repo = new Mock<IEmployeeRepository>();
        repo.Setup(r => r.EmailExistsAsync("a@b.com", null)).ReturnsAsync(true);
        var service = new EmployeeService(repo.Object);
        var result = await service.CreateAsync(new EmployeeRequestDto { FirstName = "A", LastName = "B", Email = "a@b.com", Phone = "1234567890", Department = "HR", Designation = "X", Salary = 10, JoinDate = DateTime.UtcNow, Status = "Active" });
        Assert.That(result.Success, Is.False);
    }
}