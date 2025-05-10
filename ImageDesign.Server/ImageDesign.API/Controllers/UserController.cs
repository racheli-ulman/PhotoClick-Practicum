using AutoMapper;
using ImageDesign.API.Models;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.IServices;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }


        // GET: api/<UserController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> Get()
        {
            var users = await _userService.GetAllUsersAsync();
            var usersDto = _mapper.Map<IEnumerable<UserDto>>(users);
            return Ok(usersDto);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            var userdto = _mapper.Map<UserDto>(user);
            return Ok(userdto);
        }

        // POST api/<UserController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserPostModel user)
        {
            if (user == null) return null;
            var userdto = _mapper.Map<UserDto>(user);
            var result = await _userService.AddUserAsync(userdto);
            if (result == null)
                return null;
            return Ok(result);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UserPostModel user)
        {
            if (id < 0 || user == null) return null;
            //var Updateuser =_userService.GetUserByIdAsync(id);
            //if (Updateuser == null)
            //    return NotFound("user not found");
            var success = await _userService.UpdateUserAsync(id, _mapper.Map<UserDto>(user));
            if (success == null) return null;
            return Ok(success.Id);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            if (id < 0) return BadRequest();
            bool success = await _userService.DeleteUserAsync(id);
            if (!success) return NotFound();
            return Ok(success);
        }


        [HttpGet("registrations-per-month")]
        public async Task<ActionResult<IEnumerable<MonthlyRegistrationsDto>>> GetMonthlyRegistrations()
        {
            var registrations = await _userService.GetMonthlyRegistrationsAsync();
            return Ok(registrations);
        }

    }
}
