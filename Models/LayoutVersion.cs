namespace GridLayoutEditor.Models
{
    public class LayoutVersion
    {
        public int Id { get; set; }
        public string VersionName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public ICollection<GridItem> GridItems { get; set; } = new List<GridItem>();
    }
}
