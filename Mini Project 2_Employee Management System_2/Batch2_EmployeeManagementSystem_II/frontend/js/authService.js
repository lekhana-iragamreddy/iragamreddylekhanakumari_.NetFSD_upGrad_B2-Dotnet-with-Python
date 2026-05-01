
var AuthService = (() => {
  let _session = null;
  async function signup(username, password, role = "Viewer") {
    const result = await StorageService.register({ username, password, role });
    return result;
  }
  async function login(username, password) {
    const result = await StorageService.login({ username, password });
    _session = {
      username: result.username,
      role: result.role,
      token: result.token
    };
    return result;
  }
  function logout() { _session = null; }
  function isLoggedIn() { return !!(_session && _session.token); }
  function getCurrentUser() { return _session ? { username: _session.username, role: _session.role } : null; }
  function getToken() { return _session?.token || null; }
  function getRole() { return _session?.role || null; }
  function isAdmin() { return getRole() === "Admin"; }
  return { signup, login, logout, isLoggedIn, getCurrentUser, getToken, getRole, isAdmin };
})();
if (typeof globalThis !== "undefined") globalThis.AuthService = AuthService;
if (typeof module !== "undefined") module.exports = AuthService;
