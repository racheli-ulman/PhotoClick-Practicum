using AutoMapper;
using ImageDesign.API.Models;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.IRepositories;
using ImageDesign.Core.IServices;
using ImageDesign.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ImageDesign.API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IUserRoleService _userRoleService;
        private readonly IRoleRepository _roleRpository;


        public AuthController(AuthService authService, IUserService userService, IMapper mapper, IUserRoleService userRoleService, IRoleRepository roleRpository)
        {
            _authService = authService;
            _userService = userService;
            _mapper = mapper;
            _userRoleService = userRoleService;
            _roleRpository = roleRpository;
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            var roleName = await _userService.AuthenticateAsync(model.Email, model.Password);
            var user = await _userService.GetUserByEmailAsync(model.Email);
            if (roleName == "Admin")
            {
                var token = _authService.GenerateJwtToken(model.Email, new[] { "Admin" });
                return Ok(new { Token = token, User = user });
            }

            else if (roleName == "User")
            {
                var token = _authService.GenerateJwtToken(model.Email, new[] { "User" });
                return Ok(new { Token = token, User = user });
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            if (model == null)
            {
                return Conflict("User is not valid");
            }

            var modelD = _mapper.Map<UserDto>(model);
            var existingUser = await _userService.AddUserAsync(modelD);
            if (existingUser == null)
                return BadRequest("User could not be created.");

            // Check if the role exists
            int roleId = await _roleRpository.GetIdByRoleAsync(model.RoleName);
            if (roleId == -1)
            {
                return BadRequest("Role not found.");
            }

            var userRole = await _userRoleService.AddAsync(model.RoleName, existingUser.Id);
            if (userRole == null)
                return BadRequest("Error assigning role to user.");
            //existingUser.Role = model.RoleName;
            var token = _authService.GenerateJwtToken(model.Email, new[] { model.RoleName });
            return Ok(new { Token = token, User = existingUser });
        }


    }

    public class LoginModel
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }


}
