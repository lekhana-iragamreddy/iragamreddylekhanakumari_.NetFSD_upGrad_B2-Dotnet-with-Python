
var ValidationService = (() => {
  function validateAuthForm(formData, type = "login") {
    const errors = {};
    const username = (formData.username || "").trim();
    const password = formData.password || "";
    const confirmPassword = formData.confirmPassword || "";
    if (!username) errors[type === "login" ? "loginUsername" : "signupUsername"] = "Username is required";
    if (!password) errors[type === "login" ? "loginPassword" : "signupPassword"] = "Password is required";
    else if (type === "signup" && password.length < 6) errors.signupPassword = "Password must be at least 6 characters";
    if (type === "signup") {
      if (!confirmPassword) errors.signupConfirmPassword = "Confirm password required";
      else if (password !== confirmPassword) errors.signupConfirmPassword = "Passwords do not match";
    }
    return errors;
  }
  function validateEmployeeForm(formData) {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    if (!(formData.firstName || "").trim()) errors.firstName = "First name is required";
    if (!(formData.lastName || "").trim()) errors.lastName = "Last name is required";
    if (!(formData.email || "").trim()) errors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) errors.email = "Enter a valid email address";
    if (!(formData.phone || "").trim()) errors.phone = "Phone number is required";
    else if (!phonePattern.test(formData.phone)) errors.phone = "Phone number must be exactly 10 digits";
    if (!(formData.department || "").trim()) errors.department = "Department is required";
    if (!(formData.designation || "").trim()) errors.designation = "Designation is required";
    if ((formData.salary || "").toString().trim() === "") errors.salary = "Salary is required";
    else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) errors.salary = "Salary must be a positive number";
    if (!(formData.joinDate || "").trim()) errors.joinDate = "Join date is required";
    if (!(formData.status || "").trim()) errors.status = "Status is required";
    return errors;
  }
  function mapServerErrors(error) {
    const errors = {};
    if (error?.status === 409) errors.email = error.payload?.message || "Email already exists";
    if (error?.status === 400 && error.payload?.errors) {
      Object.entries(error.payload.errors).forEach(([key, value]) => {
        const normalized = key.charAt(0).toLowerCase() + key.slice(1);
        errors[normalized] = Array.isArray(value) ? value[0] : value;
      });
    }
    return errors;
  }
  return { validateAuthForm, validateEmployeeForm, mapServerErrors };
})();
if (typeof globalThis !== "undefined") globalThis.ValidationService = ValidationService;
if (typeof module !== "undefined") module.exports = ValidationService;
