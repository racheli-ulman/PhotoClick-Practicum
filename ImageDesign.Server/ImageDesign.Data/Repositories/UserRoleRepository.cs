using ImageDesign.Core.Entities;
using ImageDesign.Core.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Data.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        protected readonly DataContext _dataContext;

        public UserRoleRepository(DataContext context)
        {
            _dataContext = context;
        }

        public async Task<UserRole> AddAsync(UserRole userRole)
        {
            await _dataContext.UserRoles.AddAsync(userRole);

            return userRole;
        }

        public async Task DeleteAsync(int id)
        {
            var userRole = await GetByIdAsync(id); // שיניתי ל-GetByIdAsync
            if (userRole != null)
            {
                _dataContext.UserRoles.Remove(userRole);
                await _dataContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<UserRole>> GetAllAsync() // שיניתי ל-Task<IEnumerable>
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role).ToListAsync();
        }

        public async Task<UserRole> GetByUserIdAsync(int id) // שיניתי ל-Task<UserRole>
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == id);
        }

        public async Task<UserRole> GetByIdAsync(int id) // שיניתי ל-Task<UserRole>
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.Id == id);
        }

        public async Task<bool> UpdateAsync(int id, UserRole userRole)
        {
            UserRole existingUserRole = await GetByIdAsync(id); // שיניתי ל-GetByIdAsync
            if (existingUserRole != null)
            {
                existingUserRole.UserId = userRole.UserId;
                existingUserRole.RoleId = userRole.RoleId;

                return true;
            }
            return false;
        }
    }
}
