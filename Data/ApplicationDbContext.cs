using Microsoft.EntityFrameworkCore;
using grid_layout_csharp.Models;

namespace grid_layout_csharp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Grid> Grids { get; set; }
    }
}