using Microsoft.AspNetCore.Mvc;
using grid_layout_csharp.Data;
using grid_layout_csharp.Models;
using Microsoft.EntityFrameworkCore;

namespace grid_layout_csharp.Controllers
{
    public class GridController : Controller
    {
        private readonly ApplicationDbContext _context;

        public GridController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 顯示主頁面
        public IActionResult Index()
        {
            var grids = _context.Grids.ToList();
            return View(grids);
        }

        // 添加新方格
        [HttpPost]
        public async Task<IActionResult> AddGrid(Grid grid)
        {
            if (ModelState.IsValid)
            {
                _context.Add(grid);
                await _context.SaveChangesAsync();
                return Json(new { success = true, grid });
            }
            return Json(new { success = false });
        }

        // 更新方格位置和大小
        [HttpPost]
        public async Task<IActionResult> UpdateGrid(Grid grid)
        {
            var existingGrid = await _context.Grids.FindAsync(grid.Id);
            if (existingGrid == null)
            {
                return NotFound();
            }

            existingGrid.X = grid.X;
            existingGrid.Y = grid.Y;
            existingGrid.Width = grid.Width;
            existingGrid.Height = grid.Height;

            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }

        // 獲取所有方格
        [HttpGet]
        public IActionResult GetGrids()
        {
            var grids = _context.Grids.ToList();
            return Json(grids);
        }

        // 刪除方格
        [HttpPost]
        public async Task<IActionResult> DeleteGrid(int id)
        {
            var grid = await _context.Grids.FindAsync(id);
            if (grid == null)
            {
                return NotFound();
            }

            _context.Grids.Remove(grid);
            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }
    }
}