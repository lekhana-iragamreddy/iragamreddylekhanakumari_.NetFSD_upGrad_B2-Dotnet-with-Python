
var EmployeeService = (() => {
  async function getAll(params) { return StorageService.getAll(params); }
  async function getById(id) { return StorageService.getById(id); }
  async function add(data) {
    return StorageService.add({
      firstName: (data.firstName || "").trim(),
      lastName: (data.lastName || "").trim(),
      email: (data.email || "").trim().toLowerCase(),
      phone: (data.phone || "").trim(),
      department: data.department,
      designation: (data.designation || "").trim(),
      salary: Number(data.salary),
      joinDate: data.joinDate,
      status: data.status
    });
  }
  async function update(id, data) {
    return StorageService.update(id, {
      id: Number(id),
      firstName: (data.firstName || "").trim(),
      lastName: (data.lastName || "").trim(),
      email: (data.email || "").trim().toLowerCase(),
      phone: (data.phone || "").trim(),
      department: data.department,
      designation: (data.designation || "").trim(),
      salary: Number(data.salary),
      joinDate: data.joinDate,
      status: data.status
    });
  }
  async function remove(id) { return StorageService.remove(id); }
  return { getAll, getById, add, update, remove };
})();
if (typeof globalThis !== "undefined") globalThis.EmployeeService = EmployeeService;
if (typeof module !== "undefined") module.exports = EmployeeService;

