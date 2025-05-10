using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.Entities
{
    public class Album
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string AlbumName { get; set; }
        public DateTime CreatedAt { get; set; }
        //public int? ParentId { get; set; }
        public string description { get; set; }
        public virtual User? User { get; set; }
        //public Album? Parent { get; set; }
        public bool IsDeleted { get; set; }

        public virtual ICollection<Photo> Photos { get; set; } = new List<Photo>();

    }
}
