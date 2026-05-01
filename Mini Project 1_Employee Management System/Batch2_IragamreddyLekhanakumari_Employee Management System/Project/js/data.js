var appData = (() => {
    const admins = [
        {
            username: "admin",
            password: "admin123"
        }
    ];

    const employees = [
        { id: 1, firstName: "Umesh", lastName: "Reddy", email: "umeshreddy@gmail.com", phone: "9876543210", department: "Engineering", designation: "Software Engineer", salary: 750000, joinDate: "2022-06-15", status: "Active" },
        { id: 2, firstName: "Vinuhya", lastName: "Kolisetty", email: "VinuhyaKolisetty@gmail.com", phone: "9876543211", department: "Marketing", designation: "Marketing Executive", salary: 550000, joinDate: "2021-03-10", status: "Active" },
        { id: 3, firstName: "Pravallika", lastName: "Naidu", email: "PravallikaNaidu@gmail.com", phone: "9876543212", department: "HR", designation: "HR Executive", salary: 500000, joinDate: "2020-11-20", status: "Inactive" },
        { id: 4, firstName: "Lekhana", lastName: "Reddy", email: "lekhalekhana@gmail.com", phone: "9876543213", department: "Finance", designation: "Accountant", salary: 650000, joinDate: "2019-08-01", status: "Active" },
        { id: 5, firstName: "Kavya", lastName: "Nair", email: "kavyanair@gmail.com", phone: "9876543214", department: "Operations", designation: "Operations Analyst", salary: 600000, joinDate: "2023-01-12", status: "Active" },
        { id: 6, firstName: "Ashok", lastName: "Reddy", email: "AshokAshok12@gmail.com", phone: "9876543215", department: "Engineering", designation: "Frontend Developer", salary: 720000, joinDate: "2022-09-18", status: "Inactive" },
        { id: 7, firstName: "Sunil", lastName: "Yadav", email: "sunilyadav@gmail.com", phone: "9876543216", department: "Marketing", designation: "SEO Specialist", salary: 530000, joinDate: "2021-12-05", status: "Active" },
        { id: 8, firstName: "Rachana", lastName: "Yadav", email: "rachanayadav@gmail.com", phone: "9876543217", department: "HR", designation: "Talent Acquisition Specialist", salary: 580000, joinDate: "2020-04-25", status: "Active" },
        { id: 9, firstName: "Karthik", lastName: "Reddy", email: "karthikkarthik123@gmail.com", phone: "9876543218", department: "Finance", designation: "Financial Analyst", salary: 800000, joinDate: "2023-05-30", status: "Active" },
        { id: 10, firstName: "Suresh", lastName: "Kumar", email: "sureshkumar@gmail.com", phone: "9876543219", department: "Operations", designation: "Operations Manager", salary: 900000, joinDate: "2018-07-14", status: "Inactive" },
        { id: 11, firstName: "Divya", lastName: "Rao", email: "divyarao@gmail.com", phone: "9876543220", department: "Engineering", designation: "Backend Developer", salary: 780000, joinDate: "2022-02-11", status: "Active" },
        { id: 12, firstName: "Kiran", lastName: "Pillai", email: "kiranpillai@gmail.com", phone: "9876543221", department: "Marketing", designation: "Content Strategist", salary: 560000, joinDate: "2021-06-19", status: "Inactive" },
        { id: 13, firstName: "Neha", lastName: "Kapoor", email: "nehakapoor@gmail.com", phone: "9876543222", department: "HR", designation: "HR Manager", salary: 850000, joinDate: "2019-10-08", status: "Active" },
        { id: 14, firstName: "Aditya", lastName: "Singh", email: "adityasingh@gmail.com", phone: "9876543223", department: "Finance", designation: "Finance Manager", salary: 950000, joinDate: "2020-01-17", status: "Active" },
        { id: 15, firstName: "Pooja", lastName: "Chauhan", email: "poojachauhan@gmail.com", phone: "9876543224", department: "Operations", designation: "Logistics Coordinator", salary: 520000, joinDate: "2023-09-09", status: "Active" },
        { id: 16, firstName: "Raj", lastName: "Kumar", email: "Rajareddy@gmail.com", phone: "9876543225", department: "Operations", designation: "Logistics Coordinator", salary: 520000, joinDate: "2023-09-09", status: "Active" }

    ];

    return {
        admins,
        employees
    };
})();