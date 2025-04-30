using Microsoft.EntityFrameworkCore;
using GridLayoutEditor.Models;

namespace GridLayoutEditor.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<LayoutVersion> LayoutVersions { get; set; }
        public DbSet<GridItem> GridItems { get; set; }
    }
}
