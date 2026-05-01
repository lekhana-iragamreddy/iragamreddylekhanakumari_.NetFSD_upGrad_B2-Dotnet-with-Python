using System.ComponentModel.DataAnnotations;

namespace EMS.API.DTOs
{

    public class EmployeeQueryParams
    {
        public string? Search { get; set; }
        public string? Department { get; set; }
        public string? Status { get; set; }
        public string SortBy { get; set; } = "name";
        public string SortDir { get; set; } = "asc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class EmployeeRequestDto
    {
        [Required, MaxLength(100)] public string FirstName { get; set; } = string.Empty;
        [Required, MaxLength(100)] public string LastName { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(200)] public string Email { get; set; } = string.Empty;
        [Required, RegularExpression(@"^\d{10}$")] public string Phone { get; set; } = string.Empty;
        [Required, RegularExpression("^(Engineering|Marketing|HR|Finance|Operations)$")] public string Department { get; set; } = string.Empty;
        [Required, MaxLength(100)] public string Designation { get; set; } = string.Empty;
        [Range(0.01, double.MaxValue)] public decimal Salary { get; set; }
        [Required] public DateTime JoinDate { get; set; }
        [Required, RegularExpression("^(Active|Inactive)$")] public string Status { get; set; } = string.Empty;
    }

    public class EmployeeResponseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime JoinDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class PagedResult<T>
    {
        public List<T> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPrevPage { get; set; }
    }

    public class DashboardSummaryDto
    {
        public SummaryDto Summary { get; set; } = new();
        public List<DepartmentBreakdownDto> DepartmentBreakdown { get; set; } = new();
        public List<EmployeeResponseDto> RecentEmployees { get; set; } = new();
    }

    public class SummaryDto
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int Inactive { get; set; }
        public int Departments { get; set; }
    }

    public class DepartmentBreakdownDto
    {
        public string Department { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class RegisterRequestDto
    {
        [Required, MaxLength(100)] public string Username { get; set; } = string.Empty;
        [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
        public string? Role { get; set; }
    }

    public class LoginRequestDto
    {
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}