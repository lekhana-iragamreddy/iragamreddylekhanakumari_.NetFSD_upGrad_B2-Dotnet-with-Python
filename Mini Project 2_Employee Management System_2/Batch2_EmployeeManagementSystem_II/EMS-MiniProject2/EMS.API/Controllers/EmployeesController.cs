using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{

    [ApiController]
    [Route("api/employees")]
    [Authorize(Roles = "Admin,Viewer")]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _employeeService;
        public EmployeesController(EmployeeService employeeService) { _employeeService = employeeService; }

        [HttpGet]
        public async Task<ActionResult<PagedResult<EmployeeResponseDto>>> GetEmployees([FromQuery] EmployeeQueryParams query)
            => Ok(await _employeeService.GetEmployeesAsync(query));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<EmployeeResponseDto>> GetById(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            return employee is null ? NotFound(new { message = "Employee not found" }) : Ok(employee);
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardSummaryDto>> Dashboard() => Ok(await _employeeService.GetDashboardAsync());

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] EmployeeRequestDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var result = await _employeeService.CreateAsync(dto);
            if (!result.Success) return Conflict(new { message = result.Message });
            return CreatedAtAction(nameof(GetById), new { id = result.Employee!.Id }, result.Employee);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeRequestDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var result = await _employeeService.UpdateAsync(id, dto);
            if (!result.Success && result.Message == "Employee not found") return NotFound(new { message = result.Message });
            if (!result.Success) return Conflict(new { message = result.Message });
            return Ok(result.Employee);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _employeeService.DeleteAsync(id);
            return deleted ? Ok(new { message = "Employee deleted successfully" }) : NotFound(new { message = "Employee not found" });
        }
    }
}