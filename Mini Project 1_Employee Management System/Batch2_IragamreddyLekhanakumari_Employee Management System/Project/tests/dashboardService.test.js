global.employees = [
    {
        id: 1,
        firstName: "Amit",
        lastName: "Sharma",
        email: "amitsharma@gmail.com",
        phone: "9876543210",
        department: "Engineering",
        designation: "Software Engineer",
        salary: 700000,
        joinDate: "2022-01-10",
        status: "Active"
    },
    {
        id: 2,
        firstName: "Neha",
        lastName: "Verma",
        email: "nehaverma@gmail.com",
        phone: "9876543211",
        department: "HR",
        designation: "HR Executive",
        salary: 500000,
        joinDate: "2021-05-12",
        status: "Inactive"
    },
    {
        id: 3,
        firstName: "Priya",
        lastName: "Menon",
        email: "priyamenon@gmail.com",
        phone: "9876543212",
        department: "Finance",
        designation: "Analyst",
        salary: 600000,
        joinDate: "2023-03-15",
        status: "Active"
    }
];

require("../js/storageService.js");
require("../js/employeeService.js");
require("../js/dashboardService.js");

describe("dashboardService", () => {
    test("should return correct summary", () => {
        const summary = dashboardService.getSummary();

        expect(summary.total).toBe(3);
        expect(summary.active).toBe(2);
        expect(summary.inactive).toBe(1);
        expect(summary.departments).toBe(3);
    });

    test("should return department breakdown", () => {
        const breakdown = dashboardService.getDepartmentBreakdown();

        expect(breakdown.Engineering).toBe(1);
        expect(breakdown.HR).toBe(1);
        expect(breakdown.Finance).toBe(1);
    });

    test("should return recent employees", () => {
        const recent = dashboardService.getRecentEmployees(2);

        expect(recent.length).toBe(2);
        expect(recent[0].id).toBe(3);
        expect(recent[1].id).toBe(2);
    });
});