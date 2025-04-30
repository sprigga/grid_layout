namespace GridLayoutEditor.Models
{
    public class GridItem
    {
        public int Id { get; set; }
        public int LayoutVersionId { get; set; }
        public LayoutVersion? LayoutVersion { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
}
