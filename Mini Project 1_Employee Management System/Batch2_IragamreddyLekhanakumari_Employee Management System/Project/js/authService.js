var root =
    typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
        ? window
        : global;

const memoryStorage = (() => {
    const store = {};
    return {
        getItem: (key) => (key in store ? store[key] : null),
        setItem: (key, value) => {
            store[key] = String(value);
        },
        removeItem: (key) => {
            delete store[key];
        }
    };
})();

const safeLocalStorage =
    typeof localStorage !== "undefined" ? localStorage : memoryStorage;

if (typeof storageService === "undefined" && typeof require !== "undefined") {
    root.storageService = require("./storageService.js");
}

const authService = (() => {
    let currentUser = null;

    if (storageService.getAllAdmins().length === 0) {
        storageService.addAdmin({ username: "admin", password: "admin123" });
    }

    const signup = (username, password) => {
        const existingAdmin = storageService
            .getAllAdmins()
            .find(admin => admin.username.toLowerCase() === username.toLowerCase());

        if (existingAdmin) {
            return {
                success: false,
                message: "Username already exists"
            };
        }

        const newAdmin = {
            username: username.trim(),
            password: password
        };

        storageService.addAdmin(newAdmin);

        return {
            success: true,
            message: "Signup successful"
        };
    };

    const login = (username, password) => {
        const admin = storageService
            .getAllAdmins()
            .find(
                item =>
                    item.username === username.trim() &&
                    item.password === password
            );

        if (!admin) {
            return {
                success: false,
                message: "Invalid username or password"
            };
        }

        currentUser = {
            username: admin.username
        };

        safeLocalStorage.setItem("currentUser", admin.username);

        return {
            success: true,
            message: "Login successful",
            user: currentUser
        };
    };

    const logout = () => {
        currentUser = null;
        safeLocalStorage.removeItem("currentUser");

        return {
            success: true,
            message: "Logged out successfully"
        };
    };

    // const isLoggedIn = () => currentUser !== null;
    const isLoggedIn = () => {
    if (currentUser) return true;

    const savedUser = safeLocalStorage.getItem("currentUser");

    if (savedUser) {
        currentUser = { username: savedUser };
        return true;
    }

    return false;
};

    const getCurrentUser = () => currentUser;

    return {
        signup,
        login,
        logout,
        isLoggedIn,
        getCurrentUser
    };
})();

if (typeof globalThis !== "undefined") {
    globalThis.authService = authService;
}

if (typeof module !== "undefined") {
    module.exports = authService;
}