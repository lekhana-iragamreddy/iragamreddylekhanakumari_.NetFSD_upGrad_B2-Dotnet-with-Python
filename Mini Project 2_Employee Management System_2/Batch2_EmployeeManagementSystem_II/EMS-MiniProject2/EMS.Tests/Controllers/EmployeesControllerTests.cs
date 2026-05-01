using EMS.API.Controllers;
using EMS.API.Services;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Controllers;

public class EmployeesControllerTests
{
    [Test]
    public void Controller_Should_Not_Be_Null()
    {
        var repo = new Mock<IEmployeeRepository>();
        var service = new EmployeeService(repo.Object);
        var controller = new EmployeesController(service);
        Assert.That(controller, Is.Not.Null);
    }
}