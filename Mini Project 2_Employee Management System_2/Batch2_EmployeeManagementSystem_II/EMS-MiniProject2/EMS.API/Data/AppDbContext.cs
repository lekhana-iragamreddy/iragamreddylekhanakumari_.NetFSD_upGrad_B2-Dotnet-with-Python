using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<AppUser> Users => Set<AppUser>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Employee>().HasIndex(e => e.Email).IsUnique();
            modelBuilder.Entity<Employee>().Property(e => e.Salary).HasPrecision(18, 2);
            modelBuilder.Entity<AppUser>().HasIndex(u => u.Username).IsUnique();

            var employees = new[]
            {
            new Employee{Id=1,FirstName="Umesh",LastName="Reddy",Email="umeshreddy@gmail.com",Phone="9876543210",Department="Engineering",Designation="Software Engineer",Salary=750000,JoinDate=new DateTime(2022,6,15),Status="Active",CreatedAt=new DateTime(2022,6,15,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2022,6,15,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=2,FirstName="Vinuhya",LastName="Kolisetty",Email="vinuhyakolisetty@gmail.com",Phone="9876543211",Department="Marketing",Designation="Marketing Executive",Salary=550000,JoinDate=new DateTime(2021,3,10),Status="Active",CreatedAt=new DateTime(2021,3,10,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2021,3,10,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=3,FirstName="Pravallika",LastName="Naidu",Email="pravallikanaidu@gmail.com",Phone="9876543212",Department="HR",Designation="HR Executive",Salary=500000,JoinDate=new DateTime(2020,11,20),Status="Inactive",CreatedAt=new DateTime(2020,11,20,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2020,11,20,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=4,FirstName="Lekhana",LastName="Reddy",Email="lekhalekhana@gmail.com",Phone="9876543213",Department="Finance",Designation="Accountant",Salary=650000,JoinDate=new DateTime(2019,8,1),Status="Active",CreatedAt=new DateTime(2019,8,1,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2019,8,1,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=5,FirstName="Kavya",LastName="Nair",Email="kavyanair@gmail.com",Phone="9876543214",Department="Operations",Designation="Operations Analyst",Salary=600000,JoinDate=new DateTime(2023,1,12),Status="Active",CreatedAt=new DateTime(2023,1,12,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2023,1,12,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=6,FirstName="Ashok",LastName="Reddy",Email="ashokashok12@gmail.com",Phone="9876543215",Department="Engineering",Designation="Frontend Developer",Salary=720000,JoinDate=new DateTime(2022,9,18),Status="Inactive",CreatedAt=new DateTime(2022,9,18,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2022,9,18,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=7,FirstName="Sunil",LastName="Yadav",Email="sunilyadav@gmail.com",Phone="9876543216",Department="Marketing",Designation="SEO Specialist",Salary=530000,JoinDate=new DateTime(2021,12,5),Status="Active",CreatedAt=new DateTime(2021,12,5,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2021,12,5,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=8,FirstName="Rachana",LastName="Yadav",Email="rachanayadav@gmail.com",Phone="9876543217",Department="HR",Designation="Talent Acquisition Specialist",Salary=580000,JoinDate=new DateTime(2020,4,25),Status="Active",CreatedAt=new DateTime(2020,4,25,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2020,4,25,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=9,FirstName="Karthik",LastName="Reddy",Email="karthikkarthik123@gmail.com",Phone="9876543218",Department="Finance",Designation="Financial Analyst",Salary=800000,JoinDate=new DateTime(2023,5,30),Status="Active",CreatedAt=new DateTime(2023,5,30,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2023,5,30,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=10,FirstName="Suresh",LastName="Kumar",Email="sureshkumar@gmail.com",Phone="9876543219",Department="Operations",Designation="Operations Manager",Salary=900000,JoinDate=new DateTime(2018,7,14),Status="Inactive",CreatedAt=new DateTime(2018,7,14,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2018,7,14,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=11,FirstName="Divya",LastName="Rao",Email="divyarao@gmail.com",Phone="9876543220",Department="Engineering",Designation="Backend Developer",Salary=780000,JoinDate=new DateTime(2022,2,11),Status="Active",CreatedAt=new DateTime(2022,2,11,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2022,2,11,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=12,FirstName="Kiran",LastName="Pillai",Email="kiranpillai@gmail.com",Phone="9876543221",Department="Marketing",Designation="Content Strategist",Salary=560000,JoinDate=new DateTime(2021,6,19),Status="Inactive",CreatedAt=new DateTime(2021,6,19,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2021,6,19,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=13,FirstName="Neha",LastName="Kapoor",Email="nehakapoor@gmail.com",Phone="9876543222",Department="HR",Designation="HR Manager",Salary=850000,JoinDate=new DateTime(2019,10,8),Status="Active",CreatedAt=new DateTime(2019,10,8,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2019,10,8,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=14,FirstName="Aditya",LastName="Singh",Email="adityasingh@gmail.com",Phone="9876543223",Department="Finance",Designation="Finance Manager",Salary=950000,JoinDate=new DateTime(2020,1,17),Status="Active",CreatedAt=new DateTime(2020,1,17,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2020,1,17,0,0,0,DateTimeKind.Utc)},
            new Employee{Id=15,FirstName="Pooja",LastName="Chauhan",Email="poojachauhan@gmail.com",Phone="9876543224",Department="Operations",Designation="Logistics Coordinator",Salary=520000,JoinDate=new DateTime(2023,9,9),Status="Active",CreatedAt=new DateTime(2023,9,9,0,0,0,DateTimeKind.Utc),UpdatedAt=new DateTime(2023,9,9,0,0,0,DateTimeKind.Utc)}
        };
            modelBuilder.Entity<Employee>().HasData(employees);
            modelBuilder.Entity<AppUser>().HasData(
                new AppUser { Id = 1, Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), Role = "Admin", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new AppUser { Id = 2, Username = "viewer", PasswordHash = BCrypt.Net.BCrypt.HashPassword("viewer123"), Role = "Viewer", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
            );
        }
    }
}