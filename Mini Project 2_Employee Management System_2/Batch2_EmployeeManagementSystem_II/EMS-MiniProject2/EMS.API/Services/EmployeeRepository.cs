using EMS.API.Data;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;
    public EmployeeRepository(AppDbContext context) { _context = context; }
    public IQueryable<Employee> Query() => _context.Employees.AsQueryable();
    public Task<Employee?> GetByIdAsync(int id) => _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
    public Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        var normalized = email.Trim().ToLower();
        return _context.Employees.AnyAsync(e => e.Email.ToLower() == normalized && (!excludeId.HasValue || e.Id != excludeId.Value));
    }
    public async Task AddAsync(Employee employee) { _context.Employees.Add(employee); await _context.SaveChangesAsync(); }
    public async Task UpdateAsync(Employee employee) { _context.Employees.Update(employee); await _context.SaveChangesAsync(); }
    public async Task DeleteAsync(Employee employee) { _context.Employees.Remove(employee); await _context.SaveChangesAsync(); }
}
