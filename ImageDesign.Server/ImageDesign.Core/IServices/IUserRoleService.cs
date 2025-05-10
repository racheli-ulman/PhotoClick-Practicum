using ImageDesign.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.IServices
{
    public interface IUserRoleService
    {
        public Task<UserRole> AddAsync(string role, int userId);

    }
}
