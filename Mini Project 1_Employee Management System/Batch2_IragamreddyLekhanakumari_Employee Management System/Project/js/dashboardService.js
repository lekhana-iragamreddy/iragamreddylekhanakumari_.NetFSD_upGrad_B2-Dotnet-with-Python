const dashboardService = (() => {
    const getSummary = () => {
        const employees = employeeService.getAll();
        const total = employees.length;
        const active = employees.filter(emp => emp.status === "Active").length;
        const inactive = employees.filter(emp => emp.status === "Inactive").length;
        const departments = new Set(employees.map(emp => emp.department)).size;

        return {
            total,
            active,
            inactive,
            departments
        };
    };

    const getDepartmentBreakdown = () => {
        const employees = employeeService.getAll();
        const breakdown = {};

        employees.forEach(emp => {
            if (breakdown[emp.department]) {
                breakdown[emp.department]++;
            } else {
                breakdown[emp.department] = 1;
            }
        });

        return breakdown;
    };

    const getRecentEmployees = (n = 5) => {
        const employees = employeeService.getAll();

        return [...employees]
            .sort((a, b) => b.id - a.id)
            .slice(0, n);
    };

    return {
        getSummary,
        getDepartmentBreakdown,
        getRecentEmployees
    };
})();

if (typeof globalThis !== "undefined") {
    globalThis.dashboardService = dashboardService;
}

if (typeof module !== "undefined") {
    module.exports = dashboardService;
}