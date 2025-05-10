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
    public class UserRepository:IUserRepository
    {
        private readonly DataContext _dataContext;

        public UserRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _dataContext.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _dataContext.Users.FindAsync(id);
        }

        public async Task<User> AddUserAsync(User user)
        {
            await _dataContext.Users.AddAsync(user);
            return user;
        }

        public async Task<User> UpdateUserAsync(int id, User user)
        {
            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null) return null;
            existingUser.Id = id;
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;
            existingUser.CreatedAt = user.CreatedAt;

            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;

            _dataContext.Users.Remove(user);
            return await _dataContext.SaveChangesAsync() > 0;
        }
        public async Task<User> GetByUserByEmailAsync(string email)
        {
            return await _dataContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
