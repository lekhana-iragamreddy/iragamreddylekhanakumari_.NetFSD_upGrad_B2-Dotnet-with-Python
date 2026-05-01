
$(document).ready(function () {
  let currentDeleteId = null;
  const state = { search: '', department: '', status: '', sortBy: 'name', sortDir: 'asc', page: 1, pageSize: (typeof Config !== 'undefined' ? Config.PAGE_SIZE : 10) };
  let searchTimer = null;
  function getEmployeeFormData() {
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
  }
  async function refreshDashboard() {
    if (!AuthService.isLoggedIn()) return;
    try { UiService.renderDashboard(await DashboardService.getDashboard()); }
    catch (error) { UiService.showToast(error.message || 'Failed to load dashboard', 'danger'); }
  }
  async function refreshEmployeeTable() {
    if (!AuthService.isLoggedIn()) return;
    try {
      UiService.setLoading(true);
      const result = await EmployeeService.getAll(state);
      UiService.renderEmployeeTable(result, AuthService.isAdmin());
      UiService.renderPagination(result);
      UiService.applyRoleUI();
    } catch (error) {
      UiService.showToast(error.message || 'Failed to load employees', 'danger');
    } finally { UiService.setLoading(false); }
  }
  function populateDepartmentFilter() {
    const departments = ['Engineering','Marketing','HR','Finance','Operations'];
    const $filter = $("#departmentFilter");
    $filter.html(`<option value="">All Departments</option>`);
    departments.forEach(d => $filter.append(`<option value="${d}">${d}</option>`));
  }
  function showLoginView() { $("#authSection").removeClass("d-none"); $("#appSection").addClass("d-none"); $("#loginView").removeClass("d-none"); $("#signupView").addClass("d-none"); UiService.clearInlineErrors(); }
  function showSignupView() { $("#authSection").removeClass("d-none"); $("#appSection").addClass("d-none"); $("#signupView").removeClass("d-none"); $("#loginView").addClass("d-none"); UiService.clearInlineErrors(); }
  async function showAppView() { $("#authSection").addClass("d-none"); $("#appSection").removeClass("d-none"); UiService.applyRoleUI(); showDashboardSection(); await refreshDashboard(); await refreshEmployeeTable(); }
  function showDashboardSection() { $("#dashboardSection").removeClass("d-none"); $("#employeesSection").addClass("d-none"); $("#navDashboard").addClass("active"); $("#navEmployees").removeClass("active"); }
  async function showEmployeesSection() { $("#employeesSection").removeClass("d-none"); $("#dashboardSection").addClass("d-none"); $("#navEmployees").addClass("active"); $("#navDashboard").removeClass("active"); populateDepartmentFilter(); await refreshEmployeeTable(); }

  UiService.initModals();
  showLoginView();

  $("#showSignupLink").on("click", function(e){ e.preventDefault(); showSignupView(); });
  $("#showLoginLink").on("click", function(e){ e.preventDefault(); showLoginView(); });
  $("#signupForm").on("submit", async function(e){
    e.preventDefault();
    const formData = { username: $("#signupUsername").val().trim(), password: $("#signupPassword").val().trim(), confirmPassword: $("#signupConfirmPassword").val().trim() };
    const errors = ValidationService.validateAuthForm(formData, 'signup');
    if (Object.keys(errors).length) return UiService.showInlineErrors(errors);
    try {
      const result = await AuthService.signup(formData.username, formData.password, 'Viewer');
      if (!result.success) { $("#signupGeneralError").text(result.message || 'Signup failed'); return; }
      UiService.showToast('Signup successful! Please login.', 'success'); $("#signupForm")[0].reset(); showLoginView();
    } catch (error) { $("#signupGeneralError").text(error.payload?.message || error.message || 'Signup failed'); }
  });
  $("#loginForm").on("submit", async function(e){
    e.preventDefault();
    const formData = { username: $("#loginUsername").val().trim(), password: $("#loginPassword").val().trim() };
    const errors = ValidationService.validateAuthForm(formData, 'login');
    if (Object.keys(errors).length) return UiService.showInlineErrors(errors);
    try {
      const result = await AuthService.login(formData.username, formData.password);
      if (!result.success) { $("#loginGeneralError").text(result.message || 'Login failed'); return; }
      UiService.showToast('Login successful!', 'success'); $("#loginForm")[0].reset(); await showAppView();
    } catch (error) { $("#loginGeneralError").text(error.payload?.message || error.message || 'Login failed'); }
  });
  $("#logoutBtn").on("click", function(){ AuthService.logout(); UiService.showToast('Logged out successfully', 'success'); showLoginView(); });
  $("#navDashboard").on("click", async function(e){ e.preventDefault(); showDashboardSection(); await refreshDashboard(); });
  $("#navEmployees").on("click", async function(e){ e.preventDefault(); await showEmployeesSection(); });
  $("#addEmployeeBtn").on("click", function(){ $("#employeeModalLabel").text('Add Employee'); $("#employeeSubmitBtn").text('Save Employee'); UiService.clearForm(); UiService.showModal('employee'); });
  $("#employeeForm").on("submit", async function(e){
    e.preventDefault();
    const employeeId = $("#employeeId").val();
    const formData = getEmployeeFormData();
    const errors = ValidationService.validateEmployeeForm(formData);
    if (Object.keys(errors).length) return UiService.showInlineErrors(errors);
    try {
      if (employeeId) { await EmployeeService.update(parseInt(employeeId,10), formData); UiService.showToast('Employee updated successfully', 'success'); }
      else { await EmployeeService.add(formData); UiService.showToast('Employee added successfully', 'success'); }
      UiService.hideModal('employee'); UiService.clearForm(); state.page = 1; await refreshEmployeeTable(); await refreshDashboard();
    } catch (error) {
      const serverErrors = ValidationService.mapServerErrors(error);
      if (Object.keys(serverErrors).length) UiService.showInlineErrors(serverErrors); else UiService.showToast(error.message || 'Save failed', 'danger');
    }
  });
  $("#searchInput").on("input", function(){ state.search = $(this).val().trim(); state.page = 1; clearTimeout(searchTimer); searchTimer = setTimeout(refreshEmployeeTable, 350); });
  $("#departmentFilter").on("change", function(){ state.department = $(this).val(); state.page = 1; refreshEmployeeTable(); });
  $('input[name="statusFilter"]').on("change", function(){ const value = $('input[name="statusFilter"]:checked').val(); state.status = value === 'All' ? '' : value; state.page = 1; refreshEmployeeTable(); });
  $("#sortFilter").on("change", function(){ const sortValue = $(this).val(); const parts = sortValue ? sortValue.split('-') : ['name', 'asc']; state.sortBy = parts[0]; state.sortDir = parts[1]; state.page = 1; refreshEmployeeTable(); });
  $(document).on('click', '#paginationContainer .page-link', function(e){ e.preventDefault(); const target = parseInt($(this).data('page'), 10); if (!isNaN(target) && target > 0) { state.page = target; refreshEmployeeTable(); } });
  $(document).on("click", ".view-btn", async function(){ const employee = await EmployeeService.getById(parseInt($(this).attr('data-id'),10)); UiService.showModal('view', employee); });
  $(document).on("click", ".edit-btn", async function(){ const employee = await EmployeeService.getById(parseInt($(this).attr('data-id'),10)); $("#employeeModalLabel").text('Edit Employee'); $("#employeeSubmitBtn").text('Update Employee'); UiService.clearForm(); UiService.populateForm(employee); UiService.showModal('employee'); });
  $(document).on("click", ".delete-btn", async function(){ const employee = await EmployeeService.getById(parseInt($(this).attr('data-id'),10)); currentDeleteId = employee.id; UiService.showModal('delete', employee); });
  $("#confirmDeleteBtn").on("click", async function(){ if (currentDeleteId !== null) { await EmployeeService.remove(currentDeleteId); UiService.hideModal('delete'); UiService.showToast('Employee deleted successfully', 'success'); currentDeleteId = null; state.page = 1; await refreshEmployeeTable(); await refreshDashboard(); } });
});
