using EMS.API.Models;

namespace EMS.API.Services;

public interface IEmployeeRepository
{
    IQueryable<Employee> Query();
    Task<Employee?> GetByIdAsync(int id);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
    Task AddAsync(Employee employee);
    Task UpdateAsync(Employee employee);
    Task DeleteAsync(Employee employee);
}
