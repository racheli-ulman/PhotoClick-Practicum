using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.DTOs
{
    public class AlbumsDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string AlbumName { get; set; }
        //public int ParentId {  get; set; }
        public string description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
