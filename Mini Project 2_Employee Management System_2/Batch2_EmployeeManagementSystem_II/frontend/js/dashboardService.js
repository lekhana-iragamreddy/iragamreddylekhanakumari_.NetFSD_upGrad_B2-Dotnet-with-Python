
var DashboardService = (() => {
  async function getDashboard() { return StorageService.getDashboard(); }
  return { getDashboard };
})();
if (typeof globalThis !== "undefined") globalThis.DashboardService = DashboardService;
if (typeof module !== "undefined") module.exports = DashboardService;

