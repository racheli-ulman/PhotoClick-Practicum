using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.Entities
{
    public class Tag
    {
        public int Id { get; set; }
        public string TagName { get; set; }

        public DateTime? CreatedAt { get; set; }
          
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Photo> Photos { get; set; } = new List<Photo>();
    }
}
