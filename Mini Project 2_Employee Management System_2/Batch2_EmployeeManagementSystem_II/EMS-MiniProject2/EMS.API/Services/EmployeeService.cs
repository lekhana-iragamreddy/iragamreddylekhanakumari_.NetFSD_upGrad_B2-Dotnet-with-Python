using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services;

public class EmployeeService
{
    private readonly IEmployeeRepository _repo;
    public EmployeeService(IEmployeeRepository repo) { _repo = repo; }

    public async Task<PagedResult<EmployeeResponseDto>> GetEmployeesAsync(EmployeeQueryParams query)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 10 : Math.Min(query.PageSize, 100);
        IQueryable<Employee> employees = _repo.Query();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            employees = employees.Where(e =>
                ((e.FirstName + " " + e.LastName).ToLower().Contains(search)) ||
                e.Email.ToLower().Contains(search));
        }
        if (!string.IsNullOrWhiteSpace(query.Department)) employees = employees.Where(e => e.Department == query.Department);
        if (!string.IsNullOrWhiteSpace(query.Status)) employees = employees.Where(e => e.Status == query.Status);

        employees = (query.SortBy?.ToLower(), query.SortDir?.ToLower()) switch
        {
            ("salary", "desc") => employees.OrderByDescending(e => e.Salary),
            ("salary", _) => employees.OrderBy(e => e.Salary),
            ("joindate", "desc") => employees.OrderByDescending(e => e.JoinDate),
            ("joindate", _) => employees.OrderBy(e => e.JoinDate),
            (_, "desc") => employees.OrderByDescending(e => e.FirstName + " " + e.LastName),
            _ => employees.OrderBy(e => e.FirstName + " " + e.LastName)
            //            (_, "desc") => employees.OrderByDescending(e => e.LastName).ThenByDescending(e => e.FirstName),
            //_ => employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
        };

        var totalCount = await employees.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        var data = await employees.Skip((page - 1) * pageSize).Take(pageSize).Select(e => Map(e)).ToListAsync();
        return new PagedResult<EmployeeResponseDto>
        {
            Data = data,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasNextPage = page < totalPages,
            HasPrevPage = page > 1
        };
    }

    public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
    {
        var employee = await _repo.GetByIdAsync(id);
        return employee is null ? null : Map(employee);
    }

    public async Task<(bool Success, string Message, EmployeeResponseDto? Employee)> CreateAsync(EmployeeRequestDto dto)
    {
        if (await _repo.EmailExistsAsync(dto.Email)) return (false, "Email already exists", null);
        var employee = new Employee
        {
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Email = dto.Email.Trim().ToLower(),
            Phone = dto.Phone.Trim(),
            Department = dto.Department,
            Designation = dto.Designation.Trim(),
            Salary = dto.Salary,
            JoinDate = DateTime.SpecifyKind(dto.JoinDate, DateTimeKind.Utc),
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(employee);
        return (true, string.Empty, Map(employee));
    }

    public async Task<(bool Success, string Message, EmployeeResponseDto? Employee)> UpdateAsync(int id, EmployeeRequestDto dto)
    {
        var employee = await _repo.GetByIdAsync(id);
        if (employee is null) return (false, "Employee not found", null);
        if (await _repo.EmailExistsAsync(dto.Email, id)) return (false, "Email already exists", null);
        employee.FirstName = dto.FirstName.Trim();
        employee.LastName = dto.LastName.Trim();
        employee.Email = dto.Email.Trim().ToLower();
        employee.Phone = dto.Phone.Trim();
        employee.Department = dto.Department;
        employee.Designation = dto.Designation.Trim();
        employee.Salary = dto.Salary;
        employee.JoinDate = DateTime.SpecifyKind(dto.JoinDate, DateTimeKind.Utc);
        employee.Status = dto.Status;
        employee.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(employee);
        return (true, string.Empty, Map(employee));
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _repo.GetByIdAsync(id);
        if (employee is null) return false;
        await _repo.DeleteAsync(employee);
        return true;
    }

    public async Task<DashboardSummaryDto> GetDashboardAsync()
    {
        var query = _repo.Query();
        var total = await query.CountAsync();
        var active = await query.CountAsync(e => e.Status == "Active");
        var inactive = await query.CountAsync(e => e.Status == "Inactive");
        var departments = await query.Select(e => e.Department).Distinct().CountAsync();
        var breakdown = await query.GroupBy(e => e.Department)
            .Select(g => new DepartmentBreakdownDto
            {
                Department = g.Key,
                Count = g.Count(),
                Percentage = total == 0 ? 0 : Math.Round((decimal)g.Count() * 100 / total, 2)
            }).OrderBy(x => x.Department).ToListAsync();
        var recent = await query.OrderByDescending(e => e.CreatedAt).ThenByDescending(e => e.Id).Take(5).Select(e => Map(e)).ToListAsync();
        return new DashboardSummaryDto
        {
            Summary = new SummaryDto { Total = total, Active = active, Inactive = inactive, Departments = departments },
            DepartmentBreakdown = breakdown,
            RecentEmployees = recent
        };
    }

    private static EmployeeResponseDto Map(Employee e) => new()
    {
        Id = e.Id,
        FirstName = e.FirstName,
        LastName = e.LastName,
        Email = e.Email,
        Phone = e.Phone,
        Department = e.Department,
        Designation = e.Designation,
        Salary = e.Salary,
        JoinDate = e.JoinDate,
        Status = e.Status
    };
}
