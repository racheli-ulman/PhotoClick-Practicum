using ImageDesign.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(int id);
        Task<UserDto> AddUserAsync(UserDto user);
        Task<UserDto> UpdateUserAsync(int id, UserDto user);
        Task<bool> DeleteUserAsync(int id);
        Task<UserDto> GetUserByEmailAsync(string email);
        Task<string> AuthenticateAsync(string email, string password);
        Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync();

    }
}
