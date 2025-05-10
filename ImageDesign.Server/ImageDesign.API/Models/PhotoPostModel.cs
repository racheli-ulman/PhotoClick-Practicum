namespace ImageDesign.API.Models
{
    public class PhotoPostModel
    {
        public int UserId { get; set; } // מזהה המשתמש
        public string PhotoName { get; set; } // שם התמונה
        public int? AlbumId { get; set; } // מזהה האלבום (אם קיים)
        public string PhotoPath { get; set; } // נתיב התמונה
        public int PhotoSize { get; set; } // גודל התמונה
        public int  TagId { get; set; }
        //public DateTime UpdatedAt { get; set; } // תאריך עדכון התמונה
    }
}
