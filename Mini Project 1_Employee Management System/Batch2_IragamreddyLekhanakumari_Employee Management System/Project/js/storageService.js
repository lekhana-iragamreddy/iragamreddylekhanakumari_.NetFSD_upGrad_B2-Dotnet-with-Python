var root =
    typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
        ? window
        : global;

const initialEmployees =
    root.employees ||
    (root.appData && Array.isArray(root.appData.employees) ? root.appData.employees : []);

const initialAdmins =
    root.adminCredentials ||
    (root.appData && Array.isArray(root.appData.admins) ? root.appData.admins : [
        { username: "admin", password: "admin123" }
    ]);


const storageService = (() => {
    let employeeStore = [...initialEmployees];
    let adminStore = [...initialAdmins];

    const getAll = () => [...employeeStore];

    const getById = (id) => employeeStore.find(emp => emp.id === Number(id));

    const add = (employee) => {
        employeeStore.push(employee);
        return employee;
    };

    const update = (id, updatedData) => {
        const index = employeeStore.findIndex(emp => emp.id === Number(id));
        if (index === -1) return null;

        employeeStore[index] = { ...employeeStore[index], ...updatedData };
        return employeeStore[index];
    };

    const remove = (id) => {
        const index = employeeStore.findIndex(emp => emp.id === Number(id));
        if (index === -1) return false;

        employeeStore.splice(index, 1);
        return true;
    };

    const nextId = () => {
        if (employeeStore.length === 0) return 1;
        return Math.max(...employeeStore.map(emp => emp.id)) + 1;
    };

    const getAllAdmins = () => [...adminStore];

    const addAdmin = (admin) => {
        adminStore.push(admin);
        return admin;
    };

    return {
        getAll,
        getById,
        add,
        update,
        remove,
        nextId,
        getAllAdmins,
        addAdmin
    };
})();

if (typeof globalThis !== "undefined") {
    globalThis.storageService = storageService;
}

if (typeof module !== "undefined") {
    module.exports = storageService;
}