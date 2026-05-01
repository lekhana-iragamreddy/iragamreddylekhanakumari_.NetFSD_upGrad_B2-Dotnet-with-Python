const employeeService = (() => {
    const getAll = () => {
        return storageService.getAll();
    };

    const getById = (id) => {
        return storageService.getById(id);
    };

    const add = (data) => {
        const newEmployee = {
            id: storageService.nextId(),
            firstName: (data.firstName || "").trim(),
            lastName: (data.lastName || "").trim(),
            email: (data.email || "").trim().toLowerCase(),
            phone: (data.phone || "").trim(),
            department: data.department || "",
            designation: (data.designation || "").trim(),
            salary: Number(data.salary),
            joinDate: data.joinDate || "",
            status: data.status || ""
        };

        return storageService.add(newEmployee);
    };

    const update = (id, data) => {
        const existingEmployee = storageService.getById(id);
        if (!existingEmployee) return null;

        const updatedEmployee = {
            firstName: data.firstName !== undefined ? data.firstName.trim() : existingEmployee.firstName,
            lastName: data.lastName !== undefined ? data.lastName.trim() : existingEmployee.lastName,
            email: data.email !== undefined ? data.email.trim().toLowerCase() : existingEmployee.email,
            phone: data.phone !== undefined ? data.phone.trim() : existingEmployee.phone,
            department: data.department !== undefined ? data.department : existingEmployee.department,
            designation: data.designation !== undefined ? data.designation.trim() : existingEmployee.designation,
            salary: data.salary !== undefined ? Number(data.salary) : existingEmployee.salary,
            joinDate: data.joinDate !== undefined ? data.joinDate : existingEmployee.joinDate,
            status: data.status !== undefined ? data.status : existingEmployee.status
        };

        return storageService.update(id, updatedEmployee);
    };

    const remove = (id) => {
        return storageService.remove(id);
    };

    const search = (query) => {
        const employees = storageService.getAll();
        const keyword = (query || "").trim().toLowerCase();

        if (!keyword) return employees;

        return employees.filter(emp => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            const email = emp.email.toLowerCase();

            return fullName.includes(keyword) || email.includes(keyword);
        });
    };

    const filterByDepartment = (dept) => {
        const employees = storageService.getAll();

        if (!dept || dept === "All Departments") {
            return employees;
        }

        return employees.filter(emp => emp.department === dept);
    };

    const filterByStatus = (status) => {
        const employees = storageService.getAll();

        if (!status || status === "All") {
            return employees;
        }

        return employees.filter(emp => emp.status === status);
    };

    const applyFilters = (searchQuery = "", dept = "All Departments", status = "All") => {
        const employees = storageService.getAll();
        const keyword = searchQuery.trim().toLowerCase();

        return employees.filter(emp => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            const email = emp.email.toLowerCase();

            const matchesSearch =
                !keyword ||
                fullName.includes(keyword) ||
                email.includes(keyword);

            const matchesDepartment =
                !dept ||
                dept === "All Departments" ||
                emp.department === dept;

            const matchesStatus =
                !status ||
                status === "All" ||
                emp.status === status;

            return matchesSearch && matchesDepartment && matchesStatus;
        });
    };

    const sortBy = (employees, field, direction = "asc") => {
        const sortedEmployees = [...employees];

        sortedEmployees.sort((a, b) => {
            let valueA;
            let valueB;

            if (field === "name") {
                valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
                valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
            } else if (field === "salary") {
                valueA = Number(a.salary);
                valueB = Number(b.salary);
            } else if (field === "joinDate") {
                valueA = new Date(a.joinDate);
                valueB = new Date(b.joinDate);
            } else {
                valueA = a[field];
                valueB = b[field];
            }

            if (valueA < valueB) return direction === "asc" ? -1 : 1;
            if (valueA > valueB) return direction === "asc" ? 1 : -1;
            return 0;
        });

        return sortedEmployees;
    };

    const getDepartments = () => {
        const employees = storageService.getAll();
        return [...new Set(employees.map(emp => emp.department))];
    };

    const isEmailExists = (email, excludeId = null) => {
        const employees = storageService.getAll();
        const normalizedEmail = (email || "").trim().toLowerCase();

        return employees.some(emp =>
            emp.email.toLowerCase() === normalizedEmail &&
            emp.id !== Number(excludeId)
        );
    };

    return {
        getAll,
        getById,
        add,
        update,
        remove,
        search,
        filterByDepartment,
        filterByStatus,
        applyFilters,
        sortBy,
        getDepartments,
        isEmailExists
    };
})();

if (typeof globalThis !== "undefined") {
    globalThis.employeeService = employeeService;
}

if (typeof module !== "undefined") {
    module.exports = employeeService;
}