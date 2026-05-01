
var root = typeof globalThis !== "undefined" ? globalThis : window;
const StorageService = (() => {
  const _base = (typeof Config !== "undefined" ? Config.API_BASE_URL : "http://localhost:5000/api").replace(/\/$/, "");
  function _headers(withAuth = true) {
    const headers = { "Content-Type": "application/json" };
    const token = withAuth && root.AuthService && typeof root.AuthService.getToken === "function"
      ? root.AuthService.getToken()
      : null;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }
  async function _fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    let payload = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = text ? { message: text } : null;
    }
    if (!response.ok) {
      const error = new Error(payload?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }
  async function register(data) {
    return _fetchJson(`${_base}/auth/register`, {
      method: "POST",
      headers: _headers(false),
      body: JSON.stringify(data)
    });
  }
  async function login(data) {
    return _fetchJson(`${_base}/auth/login`, {
      method: "POST",
      headers: _headers(false),
      body: JSON.stringify(data)
    });
  }
  async function getAll(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== "") query.append(k, v);
    });
    return _fetchJson(`${_base}/employees?${query.toString()}`, {
      headers: _headers(true)
    });
  }
  async function getById(id) {
    return _fetchJson(`${_base}/employees/${id}`, { headers: _headers(true) });
  }
  async function add(employee) {
    return _fetchJson(`${_base}/employees`, {
      method: "POST",
      headers: _headers(true),
      body: JSON.stringify(employee)
    });
  }
  async function update(id, employee) {
    return _fetchJson(`${_base}/employees/${id}`, {
      method: "PUT",
      headers: _headers(true),
      body: JSON.stringify(employee)
    });
  }
  async function remove(id) {
    return _fetchJson(`${_base}/employees/${id}`, {
      method: "DELETE",
      headers: _headers(true)
    });
  }
  async function getDashboard() {
    return _fetchJson(`${_base}/employees/dashboard`, { headers: _headers(true) });
  }
  return { register, login, getAll, getById, add, update, remove, getDashboard };
})();
if (typeof globalThis !== "undefined") globalThis.StorageService = StorageService;
if (typeof module !== "undefined") module.exports = StorageService;
