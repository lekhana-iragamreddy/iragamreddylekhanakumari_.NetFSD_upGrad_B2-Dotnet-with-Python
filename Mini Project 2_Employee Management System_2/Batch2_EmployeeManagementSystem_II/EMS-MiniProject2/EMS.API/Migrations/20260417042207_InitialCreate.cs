using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CreatedAt", "Department", "Designation", "Email", "FirstName", "JoinDate", "LastName", "Phone", "Salary", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2022, 6, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "Software Engineer", "umeshreddy@gmail.com", "Umesh", new DateTime(2022, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reddy", "9876543210", 750000m, "Active", new DateTime(2022, 6, 15, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2021, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Marketing", "Marketing Executive", "vinuhyakolisetty@gmail.com", "Vinuhya", new DateTime(2021, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kolisetty", "9876543211", 550000m, "Active", new DateTime(2021, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2020, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc), "HR", "HR Executive", "pravallikanaidu@gmail.com", "Pravallika", new DateTime(2020, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Naidu", "9876543212", 500000m, "Inactive", new DateTime(2020, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Finance", "Accountant", "lekhalekhana@gmail.com", "Lekhana", new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reddy", "9876543213", 650000m, "Active", new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2023, 1, 12, 0, 0, 0, 0, DateTimeKind.Utc), "Operations", "Operations Analyst", "kavyanair@gmail.com", "Kavya", new DateTime(2023, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nair", "9876543214", 600000m, "Active", new DateTime(2023, 1, 12, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, new DateTime(2022, 9, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "Frontend Developer", "ashokashok12@gmail.com", "Ashok", new DateTime(2022, 9, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reddy", "9876543215", 720000m, "Inactive", new DateTime(2022, 9, 18, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, new DateTime(2021, 12, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Marketing", "SEO Specialist", "sunilyadav@gmail.com", "Sunil", new DateTime(2021, 12, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Yadav", "9876543216", 530000m, "Active", new DateTime(2021, 12, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, new DateTime(2020, 4, 25, 0, 0, 0, 0, DateTimeKind.Utc), "HR", "Talent Acquisition Specialist", "rachanayadav@gmail.com", "Rachana", new DateTime(2020, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Yadav", "9876543217", 580000m, "Active", new DateTime(2020, 4, 25, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, new DateTime(2023, 5, 30, 0, 0, 0, 0, DateTimeKind.Utc), "Finance", "Financial Analyst", "karthikkarthik123@gmail.com", "Karthik", new DateTime(2023, 5, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Reddy", "9876543218", 800000m, "Active", new DateTime(2023, 5, 30, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, new DateTime(2018, 7, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Operations", "Operations Manager", "sureshkumar@gmail.com", "Suresh", new DateTime(2018, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kumar", "9876543219", 900000m, "Inactive", new DateTime(2018, 7, 14, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, new DateTime(2022, 2, 11, 0, 0, 0, 0, DateTimeKind.Utc), "Engineering", "Backend Developer", "divyarao@gmail.com", "Divya", new DateTime(2022, 2, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rao", "9876543220", 780000m, "Active", new DateTime(2022, 2, 11, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, new DateTime(2021, 6, 19, 0, 0, 0, 0, DateTimeKind.Utc), "Marketing", "Content Strategist", "kiranpillai@gmail.com", "Kiran", new DateTime(2021, 6, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pillai", "9876543221", 560000m, "Inactive", new DateTime(2021, 6, 19, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 13, new DateTime(2019, 10, 8, 0, 0, 0, 0, DateTimeKind.Utc), "HR", "HR Manager", "nehakapoor@gmail.com", "Neha", new DateTime(2019, 10, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kapoor", "9876543222", 850000m, "Active", new DateTime(2019, 10, 8, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 14, new DateTime(2020, 1, 17, 0, 0, 0, 0, DateTimeKind.Utc), "Finance", "Finance Manager", "adityasingh@gmail.com", "Aditya", new DateTime(2020, 1, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Singh", "9876543223", 950000m, "Active", new DateTime(2020, 1, 17, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 15, new DateTime(2023, 9, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Operations", "Logistics Coordinator", "poojachauhan@gmail.com", "Pooja", new DateTime(2023, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chauhan", "9876543224", 520000m, "Active", new DateTime(2023, 9, 9, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$aOF0.jF2lRGmNwy4lJDpaO41YxEtkwl9YPf89JN9klHgnORCgbY1u", "Admin", "admin" },
                    { 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$RM0rrGd1zhGfEdLrInBBmuzU8dmwRYoq0ibYZ4e.HNkfUvdbTq4EK", "Viewer", "viewer" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
