
const validationService = (() => {
    const validateAuthForm = (formData, type = "login") => {
        const errors = {};

        const username = (formData.username || "").trim();
        const password = formData.password || "";
        const confirmPassword = formData.confirmPassword || "";

        // if (!username) {
        //     errors.username = "Username is required";
        // }

        // if (!password) {
        //     errors.password = "Password is required";
        // } else if (type === "signup" && password.length < 6) {
        //     errors.password = "Password must be at least 6 characters";
        // }

        if (!username) {
    errors.loginUsername = "Username is required";
    errors.signupUsername = "Username is required";
}

if (!password) {
    errors.loginPassword = "Password is required";
    errors.signupPassword = "Password is required";
}

if (type === "signup") {
    if (!confirmPassword) {
        errors.signupConfirmPassword = "Confirm password required";
    } else if (password !== confirmPassword) {
        errors.signupConfirmPassword = "Passwords do not match";
    }
}
        // if (type === "signup") {
        //     if (!confirmPassword) {
        //         errors.confirmPassword = "Confirm Password is required";
        //     } else if (password !== confirmPassword) {
        //         errors.confirmPassword = "Passwords do not match";
        //     }
        // }

        return errors;
    };

    const validateEmployeeForm = (formData, employeeId = null) => {
        const errors = {};

        const firstName = (formData.firstName || "").trim();
        const lastName = (formData.lastName || "").trim();
        const email = (formData.email || "").trim();
        const phone = (formData.phone || "").trim();
        const department = (formData.department || "").trim();
        const designation = (formData.designation || "").trim();
        const salary = (formData.salary || "").toString().trim();
        const joinDate = (formData.joinDate || "").trim();
        const status = (formData.status || "").trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10}$/;

        if (!firstName) {
            errors.firstName = "First name is required";
        }

        if (!lastName) {
            errors.lastName = "Last name is required";
        }

        if (!email) {
            errors.email = "Email is required";
        } else if (!emailPattern.test(email)) {
            errors.email = "Enter a valid email address";
        } else if (employeeService.isEmailExists(email, employeeId)) {
            errors.email = "Email already exists";
        }

        if (!phone) {
            errors.phone = "Phone number is required";
        } else if (!phonePattern.test(phone)) {
            errors.phone = "Phone number must be exactly 10 digits";
        }

        if (!department) {
            errors.department = "Department is required";
        }

        if (!designation) {
            errors.designation = "Designation is required";
        }

        if (!salary) {
            errors.salary = "Salary is required";
        } else if (isNaN(salary) || Number(salary) <= 0) {
            errors.salary = "Salary must be a positive number";
        }

        if (!joinDate) {
            errors.joinDate = "Join date is required";
        }

        if (!status) {
            errors.status = "Status is required";
        }

        return errors;
    };

    return {
        validateAuthForm,
        validateEmployeeForm
    };
})();