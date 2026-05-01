$(document).ready(function () {
    let currentDeleteId = null;

    const refreshDashboard = () => {
        const summary = dashboardService.getSummary();
        const breakdown = dashboardService.getDepartmentBreakdown();
        const recentEmployees = dashboardService.getRecentEmployees(5);

        uiService.renderDashboardCards(summary);
        uiService.renderDepartmentBreakdown(breakdown);
        uiService.renderRecentEmployees(recentEmployees);
    };

    const populateDepartmentFilter = () => {
        const departments = employeeService.getDepartments();
        const $filter = $("#departmentFilter");

        $filter.html(`<option value="All Departments">All Departments</option>`);

        departments.forEach((dept) => {
            $filter.append(`<option value="${dept}">${dept}</option>`);
        });
    };

    const refreshEmployeeTable = () => {
        const searchQuery = $("#searchInput").val().trim();
        const department = $("#departmentFilter").val();
        const status = $('input[name="statusFilter"]:checked').val();
        const sortValue = $("#sortFilter").val();

        let employees = employeeService.applyFilters(searchQuery, department, status);

        if (sortValue) {
            const [field, direction] = sortValue.split("-");
            employees = employeeService.sortBy(employees, field, direction);
        }

        uiService.renderEmployeeTable(employees);
    };

    const showLoginView = () => {
        $("#authSection").removeClass("d-none");
        $("#appSection").addClass("d-none");
        $("#loginView").removeClass("d-none");
        $("#signupView").addClass("d-none");
        uiService.clearInlineErrors();
    };

    const showSignupView = () => {
        $("#authSection").removeClass("d-none");
        $("#appSection").addClass("d-none");
        $("#signupView").removeClass("d-none");
        $("#loginView").addClass("d-none");
        uiService.clearInlineErrors();
    };

    const showAppView = () => {
        $("#authSection").addClass("d-none");
        $("#appSection").removeClass("d-none");
        showDashboardSection();
    };

    const showDashboardSection = () => {
        $("#dashboardSection").removeClass("d-none");
        $("#employeesSection").addClass("d-none");
        $("#navDashboard").addClass("active");
        $("#navEmployees").removeClass("active");
        refreshDashboard();
    };

    const showEmployeesSection = () => {
        $("#employeesSection").removeClass("d-none");
        $("#dashboardSection").addClass("d-none");
        $("#navEmployees").addClass("active");
        $("#navDashboard").removeClass("active");
        populateDepartmentFilter();
        refreshEmployeeTable();
    };

    const getEmployeeFormData = () => {
        return {
            firstName: $("#firstName").val().trim(),
            lastName: $("#lastName").val().trim(),
            email: $("#email").val().trim(),
            phone: $("#phone").val().trim(),
            department: $("#department").val(),
            designation: $("#designation").val().trim(),
            salary: $("#salary").val().trim(),
            joinDate: $("#joinDate").val(),
            status: $("#status").val()
        };
    };

    const initializeApp = () => {
        uiService.initModals();

        if (authService.isLoggedIn()) {
            showAppView();
            refreshDashboard();
            refreshEmployeeTable();
        } else {
            showLoginView();
        }
    };

    $("#showSignupLink").on("click", function (e) {
        e.preventDefault();
        showSignupView();
    });

    $("#showLoginLink").on("click", function (e) {
        e.preventDefault();
        showLoginView();
    });

    $("#signupForm").on("submit", function (e) {
        e.preventDefault();

        const formData = {
            username: $("#signupUsername").val().trim(),
            password: $("#signupPassword").val().trim(),
            confirmPassword: $("#signupConfirmPassword").val().trim()
        };

        const errors = validationService.validateAuthForm(formData, "signup");

        if (Object.keys(errors).length > 0) {
            uiService.showInlineErrors(errors);
            return;
        }

        const result = authService.signup(formData.username, formData.password);

        if (!result.success) {
            $("#signupGeneralError").text(result.message);
            return;
        }

        uiService.showToast("Signup successful! Please login.", "success");
        $("#signupForm")[0].reset();
        showLoginView();
    });

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        const formData = {
            username: $("#loginUsername").val().trim(),
            password: $("#loginPassword").val().trim()
        };

        const errors = validationService.validateAuthForm(formData, "login");

        if (Object.keys(errors).length > 0) {
            uiService.showInlineErrors(errors);
            return;
        }

        const result = authService.login(formData.username, formData.password);

        if (!result.success) {
            $("#loginGeneralError").text(result.message);
            return;
        }

        uiService.showToast("Login successful!", "success");
        $("#loginForm")[0].reset();
        showAppView();
    });

    $("#logoutBtn").on("click", function () {
        authService.logout();
        uiService.showToast("Logged out successfully", "success");
        showLoginView();
    });

    $("#navDashboard").on("click", function (e) {
        e.preventDefault();

        if (!authService.isLoggedIn()) {
            showLoginView();
            return;
        }

        showDashboardSection();
    });

    $("#navEmployees").on("click", function (e) {
        e.preventDefault();

        if (!authService.isLoggedIn()) {
            showLoginView();
            return;
        }

        showEmployeesSection();
    });

    $("#addEmployeeBtn").on("click", function () {
        $("#employeeModalLabel").text("Add Employee");
        $("#employeeSubmitBtn").text("Save Employee");
        uiService.clearForm();
        uiService.showModal("employee");
    });

    $("#employeeForm").on("submit", function (e) {
        e.preventDefault();

        const employeeId = $("#employeeId").val();
        const formData = getEmployeeFormData();

        const errors = validationService.validateEmployeeForm(formData, employeeId);

        if (Object.keys(errors).length > 0) {
            uiService.showInlineErrors(errors);
            return;
        }

        if (employeeId) {
            employeeService.update(parseInt(employeeId), formData);
            uiService.showToast("Employee updated successfully", "success");
        } else {
            employeeService.add(formData);
            uiService.showToast("Employee added successfully", "success");
        }

        uiService.hideModal("employee");
        uiService.clearForm();
        populateDepartmentFilter();
        refreshEmployeeTable();
        refreshDashboard();
    });

    $("#searchInput").on("input", function () {
        refreshEmployeeTable();
    });

    $("#departmentFilter").on("change", function () {
        refreshEmployeeTable();
    });

    $('input[name="statusFilter"]').on("change", function () {
        refreshEmployeeTable();
    });

    $("#sortFilter").on("change", function () {
        refreshEmployeeTable();
    });

    $(document).on("click", ".view-btn", function () {
        const id = parseInt($(this).attr("data-id"));
        const employee = employeeService.getById(id);

        if (employee) {
            uiService.showModal("view", employee);
        }
    });

    $(document).on("click", ".edit-btn", function () {
        const id = parseInt($(this).attr("data-id"));
        const employee = employeeService.getById(id);

        if (employee) {
            $("#employeeModalLabel").text("Edit Employee");
            $("#employeeSubmitBtn").text("Update Employee");
            uiService.clearForm();
            uiService.populateForm(employee);
            uiService.showModal("employee");
        }
    });

    $(document).on("click", ".delete-btn", function () {
        const id = parseInt($(this).attr("data-id"));
        const employee = employeeService.getById(id);

        if (employee) {
            currentDeleteId = id;
            uiService.showModal("delete", employee);
        }
    });

    $("#confirmDeleteBtn").on("click", function () {
        if (currentDeleteId !== null) {
            employeeService.remove(currentDeleteId);
            uiService.hideModal("delete");
            uiService.showToast("Employee deleted successfully", "success");
            currentDeleteId = null;
            populateDepartmentFilter();
            refreshEmployeeTable();
            refreshDashboard();
        }
    });

    initializeApp();
});




