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
    }
];

require("../js/storageService.js");
require("../js/employeeService.js");

describe("employeeService", () => {
    test("should return all employees", () => {
        expect(employeeService.getAll().length).toBe(2);
    });

    test("should get employee by id", () => {
        const employee = employeeService.getById(1);
        expect(employee.firstName).toBe("Amit");
    });

    test("should add employee", () => {
        const newEmployee = {
            firstName: "Priya",
            lastName: "Menon",
            email: "priya.menon@xyz.com",
            phone: "9876543212",
            department: "Finance",
            designation: "Analyst",
            salary: 600000,
            joinDate: "2023-03-15",
            status: "Active"
        };

        const added = employeeService.add(newEmployee);
        expect(added.id).toBe(3);
        expect(employeeService.getAll().length).toBe(3);
    });

    test("should update employee", () => {
        employeeService.update(1, { designation: "Senior Software Engineer" });
        expect(employeeService.getById(1).designation).toBe("Senior Software Engineer");
    });

    test("should remove employee", () => {
        employeeService.remove(2);
        expect(employeeService.getById(2)).toBeUndefined();
    });

    test("should search employees by name or email", () => {
        const results = employeeService.search("amit");
        expect(results.length).toBe(1);
    });

    test("should filter by department", () => {
        const results = employeeService.filterByDepartment("Engineering");
        expect(results.length).toBe(1);
    });

    test("should filter by status", () => {
        const results = employeeService.filterByStatus("Active");
        expect(results.length).toBeGreaterThan(0);
    });

    test("should apply combined filters", () => {
        const results = employeeService.applyFilters("amit", "Engineering", "Active");
        expect(results.length).toBe(1);
    });

    test("should sort by salary ascending", () => {
        const results = employeeService.sortBy(employeeService.getAll(), "salary", "asc");
        expect(results[0].salary).toBeLessThanOrEqual(results[1].salary);
    });
});