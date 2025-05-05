using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GridLayoutEditor.Data;
using GridLayoutEditor.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace GridLayoutEditor.Controllers
{
    [Authorize]
    public class LayoutController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public LayoutController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromBody] List<GridItemDto> grids)
        {
            string? userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var layoutVersion = new LayoutVersion
            {
                VersionName = $"Version_{DateTime.Now:yyyyMMdd_HHmmss}",
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                GridItems = grids.Select(g => new GridItem
                {
                    X = g.X,
                    Y = g.Y,
                    Width = g.Width,
                    Height = g.Height
                }).ToList()
            };

            _context.LayoutVersions.Add(layoutVersion);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetVersions()
        {
            string? userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var versions = await _context.LayoutVersions
                .Where(v => v.UserId == userId)
                .OrderByDescending(v => v.CreatedAt)
                .Select(v => new
                {
                    v.Id,
                    v.VersionName,
                    CreatedAt = v.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                })
                .ToListAsync();

            return Json(versions);
        }

        [HttpGet]
        public async Task<IActionResult> Load(int versionId)
        {
            var grids = await _context.GridItems
                .Where(g => g.LayoutVersionId == versionId)
                .Select(g => new { g.X, g.Y, g.Width, g.Height })
                .ToListAsync();

            return Json(grids);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteVersion(int id)
        {
            var version = await _context.LayoutVersions
                .Include(v => v.GridItems)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (version == null)
                return NotFound();

            _context.GridItems.RemoveRange(version.GridItems);
            _context.LayoutVersions.Remove(version);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    public class GridItemDto
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
}
