using AutoMapper;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.Entities;
using ImageDesign.Core.IRepositories;
using ImageDesign.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        private readonly IUserRoleRepository _userrolerepository;
        private readonly IRoleRepository _rolerepository;
        public UserService(IRepositoryManager repositoryManager, IMapper mapper, IUserRoleRepository userrolerepository, IRoleRepository rolerepository, IUserRepository userRepository)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _userrolerepository = userrolerepository;
            _rolerepository = rolerepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var user = await _repositoryManager.UserM.GetAllUsersAsync();
            return _mapper.Map<IEnumerable<UserDto>>(user);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _repositoryManager.UserM.GetUserByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> AddUserAsync(UserDto user)
        {
            int id = await _rolerepository.GetIdByRoleAsync("User");
            var addeUser = _mapper.Map<User>(user);
            addeUser.CreatedAt = DateTime.Now;
            var createUser = await _userRepository.AddUserAsync(addeUser);

            await _repositoryManager.saveAsync();
         var r=   await _userrolerepository.AddAsync(new UserRole() { RoleId = id, UserId = createUser.Id });
            Console.WriteLine(r);
            await _repositoryManager.saveAsync();
            return _mapper.Map<UserDto>(createUser);
        }


        public async Task<UserDto> UpdateUserAsync(int id, UserDto user)
        {
            if (id < 0 || user == null)
                return null;
            var updateUser = _mapper.Map<User>(user);
            var result = await _repositoryManager.UserM.UpdateUserAsync(id, updateUser);
            Console.WriteLine("נקודת עצירה");
            await _repositoryManager.saveAsync();

            return _mapper.Map<UserDto>(result);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            await _repositoryManager.saveAsync();
            return await _repositoryManager.UserM.DeleteUserAsync(id);
        }
        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            var user = await _repositoryManager.UserM.GetByUserByEmailAsync(email);
            return _mapper.Map<UserDto>(user);
        }
        public async Task<string> AuthenticateAsync(string email, string password)
        {
            User user = await _repositoryManager.UserM.GetByUserByEmailAsync(email);
            if (user == null || !user.Password.Equals(password))
            {
                return null;
            }
             
            var userRole = await _userrolerepository.GetByUserIdAsync(user.Id);
            if (userRole == null)
                return null;

            return userRole.Role.RoleName;
        }


        public async Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var monthlyRegistrations = users
                .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                .Select(g => new MonthlyRegistrationsDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                }).ToList();

            return monthlyRegistrations;
        }


    }

}
