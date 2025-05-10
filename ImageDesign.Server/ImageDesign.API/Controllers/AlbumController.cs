using AutoMapper;
using ImageDesign.API.Models;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.Entities;
using ImageDesign.Core.IServices;
using ImageDesign.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;
        private readonly IMapper _mapper;

        public AlbumController(IAlbumService albumService, IMapper mapper)
        {
            _albumService = albumService;
            _mapper = mapper;
        }

        // GET: api/<AlbumController>
        [HttpGet]
        //[Authorize] // דרישת טוקן
        public async Task<ActionResult<IEnumerable<AlbumsDto>>> Get()
        {
            var albums = await _albumService.GetAllAlbumsAsync();
            var albumsDto = _mapper.Map<IEnumerable<AlbumsDto>>(albums);
            return Ok(albumsDto);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        //[Authorize] // דרישת טוקן
        public async Task<ActionResult<AlbumsDto>> Get(int id)
        {
            var album = await _albumService.GetAlbumByIdAsync(id);
            var albumDto = _mapper.Map<AlbumsDto>(album);
            return Ok(albumDto);
        }

        // POST api/<AlbumController>
        [HttpPost]
        //[Authorize] // דרישת טוקן
        public async Task<ActionResult> Post([FromBody] AlbumPostModel album)
        {
            // שליפת ה-userId מה-token
            //var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //if (userIdString == null || !int.TryParse(userIdString, out int userId))
            //{
            //    return BadRequest("User ID is not valid.");
            //}

            if (album == null) return BadRequest("Album data is required.");

            var albumdto = _mapper.Map<AlbumsDto>(album);
            albumdto.UserId = album.UserId;

            var result = await _albumService.AddAlbumAsync(albumdto);
            if (result == null)
                return BadRequest("Failed to add album.");

            return Ok(result);
        }


        // PUT api/<AlbumController>/5
        [HttpPut("{id}")]
        [Authorize] // דרישת טוקן
        public async Task<ActionResult> Put(int id, [FromBody] AlbumPostModel album)
        {
            if (id < 0 || album == null) return null;
            var success = await _albumService.UpdateAlbumAsync(id, _mapper.Map<AlbumsDto>(album));
            if (success == null) return null;
            //return Ok(success.Id);
            return Ok(success);
        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        [Authorize] // דרישת טוקן
        public async Task<ActionResult> Delete(int id)
        {
            if (id < 1 ) 
                return BadRequest();
            bool success = await _albumService.DeleteAlbumAsync(id);
            if (!success) 
                return NotFound();
            return Ok(success);
        }

        // שליפת תמונות מהאלבום
        [HttpGet("{albumId}/images")]
        //[Authorize] // דרישת טוקן
        public async Task<IActionResult> GetImagesByAlbumId(int albumId)
        {
            var images = await _albumService.GetImagesByAlbumIdAsync(albumId);
            if (images == null)
            {
                return NotFound();
            }

            return Ok(images);
        }

        // שליפת האלבומים לפי UserId
        [HttpGet("user/{userId}")]
        //[Authorize] // דרישת טוקן
        public async Task<IActionResult> GetAlbumsByUserId(int userId)
        {
            var albums = await _albumService.GetAlbumsByUserIdAsync(userId);
            if (albums == null)
            {
                return NotFound();
            }

            return Ok(albums);
        }
        //[HttpGet("children/{parentId}")]
        //public async Task<IActionResult> GetChildAlbums(int parentId)
        //{

        //    var childAlbums = await _albumService.GetChildAlbumsAsync(parentId);
        //    if (childAlbums == null || !childAlbums.Any())
        //    {
        //        return NotFound("לא נמצאו תקיות עבור האלבום האב.");
        //    }

        //    return Ok(childAlbums);
        //}





        [HttpGet("user/{userId}/photos")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetAllPhotosByUserId(int userId)
        {
            var photos = await _albumService.GetAllPhotosByUserIdAsync(userId);

            if (photos == null || !photos.Any())
                return NotFound($"No photos found for user with ID {userId}");

            return Ok(photos);
        }


    }
}
