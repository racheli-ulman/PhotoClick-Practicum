namespace ImageDesign.API.Models
{
    public class AlbumPostModel
    {
        public int UserId { get; set; } // מזהה המשתמש
        public string AlbumName { get; set; } // שם האלבום
        //public int ParentId { get; set; }
        public string description { get; set; }
    }
}
