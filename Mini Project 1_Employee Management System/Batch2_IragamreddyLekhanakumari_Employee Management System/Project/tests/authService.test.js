global.adminCredentials = [
    {
        username: "admin",
        password: "admin123"
    }
];

// require("../js/authService.js");
global.authService = require("../js/authService.js");

describe("authService", () => {
    beforeEach(() => {
        authService.logout();
    });

    test("should login with valid credentials", () => {
        const result = authService.login("admin", "admin123");
        expect(result.success).toBe(true);
        expect(authService.isLoggedIn()).toBe(true);
    });

    test("should fail login with invalid credentials", () => {
        const result = authService.login("wronguser", "wrongpass");
        expect(result.success).toBe(false);
        expect(authService.isLoggedIn()).toBe(false);
    });

    test("should signup a new admin", () => {
        const result = authService.signup("newadmin", "password123");
        expect(result.success).toBe(true);
    });

    test("should reject duplicate username on signup", () => {
        const result = authService.signup("admin", "password123");
        expect(result.success).toBe(false);
    });

    test("should logout properly", () => {
        authService.login("admin", "admin123");
        authService.logout();
        expect(authService.isLoggedIn()).toBe(false);
    });

    test("should return current user after login", () => {
        authService.login("admin", "admin123");
        const user = authService.getCurrentUser();
        expect(user.username).toBe("admin");
    });
});