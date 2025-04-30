namespace GridLayoutEditor.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public ICollection<LayoutVersion> LayoutVersions { get; set; } = new List<LayoutVersion>();
    }
}
