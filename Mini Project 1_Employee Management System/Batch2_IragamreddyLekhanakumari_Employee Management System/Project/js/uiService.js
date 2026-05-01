
const uiService = (() => {
    let employeeModalInstance = null;
    let viewEmployeeModalInstance = null;
    let deleteModalInstance = null;

    const initModals = () => {
        employeeModalInstance = new bootstrap.Modal(document.getElementById("employeeModal"));
        viewEmployeeModalInstance = new bootstrap.Modal(document.getElementById("viewEmployeeModal"));
        deleteModalInstance = new bootstrap.Modal(document.getElementById("deleteModal"));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getDepartmentClass = (department) => {
        return `department-${department.toLowerCase()}`;
    };

    const getStatusClass = (status) => {
        return status === "Active" ? "status-active" : "status-inactive";
    };

    const renderEmployeeTable = (employees) => {
        const $tbody = $("#employeeTableBody");
        $tbody.empty();

        if (!employees || employees.length === 0) {
            $tbody.html(`
                <tr>
                    <td colspan="9" class="empty-state">No employees found</td>
                </tr>
            `);
            return;
        }

        employees.forEach((emp) => {
            $tbody.append(`
                <tr>
                    <td>${emp.id}</td>
                    
                    <td>
                        <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" 
                            style="width: 40px; height: 40px; font-size: 14px;">
                            ${(emp.firstName ? emp.firstName[0] : '').toUpperCase()}${(emp.lastName ? emp.lastName[0] : '').toUpperCase()}
                        </div>
                    </td>
                    <td>${emp.firstName} ${emp.lastName}</td>
                    <td>${emp.email}</td>
                    <td>
                        <span class="badge badge-department ${getDepartmentClass(emp.department)}">
                            ${emp.department}
                        </span>
                    </td>
                    <td>${emp.designation}</td>
                    <td>${formatCurrency(emp.salary)}</td>
                    <td>${emp.joinDate}</td>
                    <td>
                        <span class="badge badge-status ${getStatusClass(emp.status)}">
                            ${emp.status}
                        </span>
                    </td>
                    <td class="text-center action-btns">
                        <button class="btn btn-sm btn-outline-primary view-btn" data-id="${emp.id}">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${emp.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${emp.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    };

    const renderDashboardCards = (summary) => {
        $("#totalEmployeesCount").text(summary.total);
        $("#activeEmployeesCount").text(summary.active);
        $("#inactiveEmployeesCount").text(summary.inactive);
        $("#departmentCount").text(summary.departments);
    };

    const renderDepartmentBreakdown = (data) => {
        const $container = $("#departmentBreakdownContainer");
        $container.empty();

        const values = Object.values(data);
        const max = values.length ? Math.max(...values) : 1;

        Object.entries(data).forEach(([department, count]) => {
            const width = (count / max) * 100;

            $container.append(`
                <div class="breakdown-row">
                    <div class="d-flex justify-content-between breakdown-label">
                        <span>${department}</span>
                        <span>${count}</span>
                    </div>
                    <div class="breakdown-bar-wrap">
                        <div class="breakdown-bar" style="width: ${width}%"></div>
                    </div>
                </div>
            `);
        });

        if (Object.keys(data).length === 0) {
            $container.html(`<div class="empty-state">No department data available</div>`);
        }
    };

    const renderRecentEmployees = (employees) => {
        const $container = $("#recentEmployeesContainer");
        $container.empty();

        if (!employees || employees.length === 0) {
            $container.html(`<div class="empty-state">No recent employees found</div>`);
            return;
        }

        employees.forEach((emp) => {
            $container.append(`
                <div class="recent-employee-item">
                    <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                        <div>
                            <h6 class="mb-1">${emp.firstName} ${emp.lastName}</h6>
                            <div class="text-muted small">${emp.designation}</div>
                        </div>
                        <div class="text-end">
                            <span class="badge badge-department ${getDepartmentClass(emp.department)}">${emp.department}</span>
                            <span class="badge badge-status ${getStatusClass(emp.status)} ms-1">${emp.status}</span>
                        </div>
                    </div>
                </div>
            `);
        });
    };

    const showModal = (type, data = null) => {
        if (type === "employee") {
            employeeModalInstance.show();
        } else if (type === "view") {
            $("#viewEmployeeContent").html(`
                <div class="row g-3">
                    <div class="col-md-6"><strong>ID:</strong> ${data.id}</div>
                    <div class="col-md-6"><strong>Full Name:</strong> ${data.firstName} ${data.lastName}</div>
                    <div class="col-md-6"><strong>Email:</strong> ${data.email}</div>
                    <div class="col-md-6"><strong>Phone:</strong> ${data.phone}</div>
                    <div class="col-md-6"><strong>Department:</strong> ${data.department}</div>
                    <div class="col-md-6"><strong>Designation:</strong> ${data.designation}</div>
                    <div class="col-md-6"><strong>Salary:</strong> ${formatCurrency(data.salary)}</div>
                    <div class="col-md-6"><strong>Join Date:</strong> ${data.joinDate}</div>
                    <div class="col-md-6"><strong>Status:</strong> ${data.status}</div>
                </div>
            `);
            viewEmployeeModalInstance.show();
        } else if (type === "delete") {
            $("#deleteMessage").text(`Are you sure you want to delete ${data.firstName} ${data.lastName}?`);
            $("#confirmDeleteBtn").attr("data-id", data.id);
            deleteModalInstance.show();
        }
    };

    const hideModal = (type) => {
        if (type === "employee") {
            employeeModalInstance.hide();
        } else if (type === "view") {
            viewEmployeeModalInstance.hide();
        } else if (type === "delete") {
            deleteModalInstance.hide();
        }
    };

    const populateForm = (employee) => {
        $("#employeeId").val(employee.id);
        $("#firstName").val(employee.firstName);
        $("#lastName").val(employee.lastName);
        $("#email").val(employee.email);
        $("#phone").val(employee.phone);
        $("#department").val(employee.department);
        $("#designation").val(employee.designation);
        $("#salary").val(employee.salary);
        $("#joinDate").val(employee.joinDate);
        $("#status").val(employee.status);
    };

    const clearForm = () => {
        $("#employeeForm")[0].reset();
        $("#employeeId").val("");
        clearInlineErrors();
    };

    const showToast = (message, type = "success") => {
        const toastId = `toast-${Date.now()}`;
        const bgClass = type === "success" ? "text-bg-success" : "text-bg-danger";

        $("#toastContainer").append(`
            <div id="${toastId}" class="toast align-items-center ${bgClass} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 2500 });
        toast.show();

        toastElement.addEventListener("hidden.bs.toast", () => {
            $(toastElement).remove();
        });
    };

    const clearInlineErrors = () => {
        $(".error-message").text("");
        $("#firstNameError").text("");
        $("#lastNameError").text("");
        $("#emailError").text("");
        $("#phoneError").text("");
        $("#departmentError").text("");
        $("#designationError").text("");
        $("#salaryError").text("");
        $("#joinDateError").text("");
        $("#statusError").text("");
        $("#loginGeneralError").text("");
        $("#signupGeneralError").text("");
    };

    const showInlineErrors = (errors) => {
        clearInlineErrors();

        Object.keys(errors).forEach((key) => {
            $(`#${key}Error`).text(errors[key]);
        });
    };

    return {
        initModals,
        renderEmployeeTable,
        renderDashboardCards,
        renderDepartmentBreakdown,
        renderRecentEmployees,
        showModal,
        hideModal,
        populateForm,
        clearForm,
        showToast,
        showInlineErrors,
        clearInlineErrors,
        formatCurrency
    };
})();