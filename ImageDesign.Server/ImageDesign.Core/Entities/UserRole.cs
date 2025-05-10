using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.Entities
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; } // מפתח זר ל-Users
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
        public int RoleId { get; set; } // מפתח זר ל-Roles
        [ForeignKey(nameof(RoleId))]
        public Role Role { get; set; }
    }
}
