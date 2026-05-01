
var UiService = (() => {
  let employeeModalInstance = null;
  let viewEmployeeModalInstance = null;
  let deleteModalInstance = null;
  function initModals() {
    employeeModalInstance = new bootstrap.Modal(document.getElementById("employeeModal"));
    viewEmployeeModalInstance = new bootstrap.Modal(document.getElementById("viewEmployeeModal"));
    deleteModalInstance = new bootstrap.Modal(document.getElementById("deleteModal"));
  }
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
  }
  function getDepartmentClass(department) { return `department-${(department || "").toLowerCase()}`; }
  function getStatusClass(status) { return status === "Active" ? "status-active" : "status-inactive"; }
  function renderEmployeeTable(result, isAdmin) {
  const employees = result?.data || [];


    const $tbody = $("#employeeTableBody");
    $tbody.empty();
    if (!employees.length) {
      $tbody.html(`<tr><td colspan="10" class="empty-state">No employees found</td></tr>`);
    } else {
      employees.forEach(emp => {
        $tbody.append(`
        <tr>
          <td>${emp.id}</td>
          <td><div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px; font-size: 14px;">${(emp.firstName?.[0]||'').toUpperCase()}${(emp.lastName?.[0]||'').toUpperCase()}</div></td>
          <td>${emp.firstName} ${emp.lastName}</td>
          <td>${emp.email}</td>
          <td><span class="badge badge-department ${getDepartmentClass(emp.department)}">${emp.department}</span></td>
          <td>${emp.designation}</td>
          <td>${formatCurrency(emp.salary)}</td>
          <td>${(emp.joinDate || '').toString().substring(0,10)}</td>
          <td><span class="badge badge-status ${getStatusClass(emp.status)}">${emp.status}</span></td>
          <td class="text-center action-btns">
            <button class="btn btn-sm btn-outline-primary view-btn" data-id="${emp.id}"><i class="bi bi-eye"></i></button>
            ${isAdmin ? `<button class="btn btn-sm btn-outline-warning edit-btn" data-id="${emp.id}"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger delete-btn" data-id="${emp.id}"><i class="bi bi-trash"></i></button>` : ``}
          </td>
        </tr>`);
      });
    }
    const start = result.totalCount ? ((result.page - 1) * result.pageSize) + 1 : 0;
    const end = result.totalCount ? Math.min(result.page * result.pageSize, result.totalCount) : 0;
    $("#recordCountLabel").text(`Showing ${start}-${end} of ${result.totalCount || 0} employees`);
  }
  function renderPagination(result) {
    const $container = $("#paginationContainer");
    $container.empty();
    if (!result || (result.totalPages || 0) <= 1) return;
    const page = result.page;
    const totalPages = result.totalPages;
    const add = (label, target, disabled, active = false) => {
      $container.append(`<li class="page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}"><a class="page-link" href="#" data-page="${target}">${label}</a></li>`);
    };
    add('Prev', page - 1, page <= 1);
    for (let p = 1; p <= totalPages; p++) add(p, p, false, p === page);
    add('Next', page + 1, page >= totalPages);
  }
  function renderDashboard(data) {
    const summary = data.summary || {};
    $("#totalEmployeesCount").text(summary.total || 0);
    $("#activeEmployeesCount").text(summary.active || 0);
    $("#inactiveEmployeesCount").text(summary.inactive || 0);
    $("#departmentCount").text(summary.departments || 0);
    renderDepartmentBreakdown(data.departmentBreakdown || []);
    renderRecentEmployees(data.recentEmployees || []);
  }
  function renderDepartmentBreakdown(items) {
    const $container = $("#departmentBreakdownContainer");
    $container.empty();
    if (!items.length) { $container.html('<div class="empty-state">No department data available</div>'); return; }
    const max = Math.max(...items.map(i => i.count));
    items.forEach(item => {
      const width = max ? (item.count / max) * 100 : 0;
      $container.append(`<div class="breakdown-row"><div class="d-flex justify-content-between breakdown-label"><span>${item.department}</span><span>${item.count}</span></div><div class="breakdown-bar-wrap"><div class="breakdown-bar" style="width:${width}%"></div></div></div>`);
    });
  }
  function renderRecentEmployees(employees) {
    const $container = $("#recentEmployeesContainer");
    $container.empty();
    if (!employees.length) { $container.html('<div class="empty-state">No recent employees found</div>'); return; }
    employees.forEach(emp => {
      $container.append(`<div class="recent-employee-item"><div class="d-flex justify-content-between align-items-start gap-2 flex-wrap"><div><h6 class="mb-1">${emp.firstName} ${emp.lastName}</h6><div class="text-muted small">${emp.designation}</div></div><div class="text-end"><span class="badge badge-department ${getDepartmentClass(emp.department)}">${emp.department}</span><span class="badge badge-status ${getStatusClass(emp.status)} ms-1">${emp.status}</span></div></div></div>`);
    });
  }
  function showModal(type, data = null) {
    if (type === 'employee') employeeModalInstance.show();
    if (type === 'view') {
      $("#viewEmployeeContent").html(`<div class="row g-3"><div class="col-md-6"><strong>ID:</strong> ${data.id}</div><div class="col-md-6"><strong>Full Name:</strong> ${data.firstName} ${data.lastName}</div><div class="col-md-6"><strong>Email:</strong> ${data.email}</div><div class="col-md-6"><strong>Phone:</strong> ${data.phone}</div><div class="col-md-6"><strong>Department:</strong> ${data.department}</div><div class="col-md-6"><strong>Designation:</strong> ${data.designation}</div><div class="col-md-6"><strong>Salary:</strong> ${formatCurrency(data.salary)}</div><div class="col-md-6"><strong>Join Date:</strong> ${(data.joinDate||'').toString().substring(0,10)}</div><div class="col-md-6"><strong>Status:</strong> ${data.status}</div></div>`);
      viewEmployeeModalInstance.show();
    }
    if (type === 'delete') {
      $("#deleteMessage").text(`Are you sure you want to delete ${data.firstName} ${data.lastName}?`);
      deleteModalInstance.show();
    }
  }
  function hideModal(type) { if (type === 'employee') employeeModalInstance.hide(); if (type === 'view') viewEmployeeModalInstance.hide(); if (type === 'delete') deleteModalInstance.hide(); }
  function populateForm(employee) {
    $("#employeeId").val(employee.id); $("#firstName").val(employee.firstName); $("#lastName").val(employee.lastName); $("#email").val(employee.email); $("#phone").val(employee.phone); $("#department").val(employee.department); $("#designation").val(employee.designation); $("#salary").val(employee.salary); $("#joinDate").val((employee.joinDate||'').toString().substring(0,10)); $("#status").val(employee.status);
  }
  function clearForm() { $("#employeeForm")[0].reset(); $("#employeeId").val(""); clearInlineErrors(); }
  function showToast(message, type = 'success') {
    const toastId = `toast-${Date.now()}`;
    const bgClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';
    $("#toastContainer").append(`<div id="${toastId}" class="toast align-items-center ${bgClass} border-0" role="alert"><div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`);
    const toastElement = document.getElementById(toastId); const toast = new bootstrap.Toast(toastElement, { delay: 2500 }); toast.show(); toastElement.addEventListener('hidden.bs.toast', () => $(toastElement).remove());
  }
  function clearInlineErrors() { $(".error-message, #loginGeneralError, #signupGeneralError").text(""); }
  function showInlineErrors(errors) { clearInlineErrors(); Object.keys(errors).forEach(key => $(`#${key}Error`).text(errors[key])); }
  function applyRoleUI() {
    const isAdmin = AuthService.isAdmin();
    $("#roleBadge").removeClass("d-none").text(AuthService.getRole() || "Guest");
    $("#addEmployeeBtn").toggle(isAdmin);
    $("#viewerNotice").toggle(!isAdmin);
    $("body").toggleClass("viewer-mode", !isAdmin);
  }
  function setLoading(isLoading) { $("#loadingIndicator").toggleClass("d-none", !isLoading); }
  return { initModals, renderEmployeeTable, renderPagination, renderDashboard, showModal, hideModal, populateForm, clearForm, showToast, showInlineErrors, clearInlineErrors, applyRoleUI, setLoading };
})();
if (typeof globalThis !== "undefined") globalThis.UiService = UiService;
