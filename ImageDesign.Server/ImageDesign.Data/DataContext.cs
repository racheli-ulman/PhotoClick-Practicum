using Azure;
using ImageDesign.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Data
{
    public class DataContext : DbContext
    {
        
        public DataContext(DbContextOptions<DataContext> options): base(options)
        {

        }

        public virtual DbSet<Album> Albums { get; set; }

        public virtual DbSet<Photo> Photos { get; set; }

        public virtual DbSet<Tag> Tags { get; set; }

        public virtual DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=DESKTOP-P6FFS03;Initial Catalog=ImageDesign_DB1;Integrated Security=false;  Trusted_Connection = SSPI; MultipleActiveResultSets = true; TrustServerCertificate = true");
        }
    }
}
