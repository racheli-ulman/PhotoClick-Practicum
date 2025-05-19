using AutoMapper;
using ImageDesign.API.Models;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.Entities;
using ImageDesign.Core.IServices;
using ImageDesign.Service;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;

        public PhotoController(IPhotoService photoService, IMapper mapper)
        {
            _photoService = photoService;
            _mapper = mapper;
        }

        // GET: api/<PhotoController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> Get()
        {
            var photos = await _photoService.GetAllPhotosAsync();
            var photoDto = _mapper.Map<IEnumerable<PhotoDto>>(photos);
            return Ok(photoDto);
        }

        [HttpGet("deleted-photos")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetAllDeletedPhotos()
        {
            var photos = await _photoService.GetAllDeletedPhotosAsync();
            var photoDto = _mapper.Map<IEnumerable<PhotoDto>>(photos);
            return Ok(photoDto);
        }

        // GET api/<PhotoController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PhotoDto>> Get(int id)
        {
            var photo = await _photoService.GetPhotoByIdAsync(id);
            var photodto = _mapper.Map<PhotoDto>(photo);
            return Ok(photodto);
        }



        // POST api/<PhotoController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PhotoPostModel photo)
        {
            if (photo == null) return null;
            var photodto = _mapper.Map<PhotoDto>(photo);
            var result = await _photoService.AddPhotoAsync(photodto);
            if (result == null)
                return null;
            return Ok(result);
        }

        // PUT api/<PhotoController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PhotoPostModel photo)
        {
            if (id < 0 || photo == null) return null;
            var success = await _photoService.UpdatePhotoAsync(id, _mapper.Map<PhotoDto>(photo));
            if (success == null) return null;
            return Ok(success.Id);
        }

        // DELETE api/<PhotoController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            if (id < 0) return BadRequest();
            bool success = await _photoService.DeletePhotoAsync(id);
            if (!success) return NotFound();
            return Ok(success);
        }
        [HttpGet("album/{albumId}")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetPhotosByAlbumIdAsync(int albumId)
        {
            if (albumId <= 0) return BadRequest("Invalid album ID");

            var photos = await _photoService.GetPhotosByAlbumIdAsync(albumId);
            //if (photos == null || !photos.Any())
            //{
            //    // החזר הודעה מותאמת אישית כאשר אין תמונות
            //    return NotFound("אין תמונות בתקיה זו");
            //}

            return Ok(photos);
        }

        [HttpGet("Recycling-photos/user/{userId}")]

        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetDeletedPhotosByUserIdAsync(int userId)
        {
            if (userId <= 0) return BadRequest("Invalid album ID");

            var photos = await _photoService.GetDeletedPhotosByUserIdAsync(userId);
            //if (photos == null || !photos.Any())
            //{
            //    // החזר הודעה מותאמת אישית כאשר אין תמונות
            //    return NotFound("אין תמונות בתקיה זו");
            //}

            return Ok(photos);
        }

        [HttpGet("photo/album/{albumId}")]

        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetNotPhotosByAlbumIdAsync(int albumId)
        {
            if (albumId <= 0) return BadRequest("Invalid album ID");

            var photos = await _photoService.GetNotPhotosByAlbumIdAsync(albumId);
            //if (photos == null || !photos.Any())
            //{
            //    // החזר הודעה מותאמת אישית כאשר אין תמונות
            //    return NotFound("אין תמונות בתקיה זו");
            //}

            return Ok(photos);
        }




        [HttpPost("copy/{photoId}/to-album/{targetAlbumId}")]
        public async Task<ActionResult> CopyPhotoToAlbum(int photoId, int targetAlbumId)
        {
            if (photoId <= 0 || targetAlbumId <= 0)
                return BadRequest("Invalid photo ID or target album ID");

            var result = await _photoService.CopyPhotoToAlbumAsync(photoId, targetAlbumId);
            if (result == null)
                return NotFound("Photo or target album not found");

            return Ok(result);
        }

        [HttpPut("move/{photoId}/from-album/{sourceAlbumId}/to-album/{targetAlbumId}")]
        public async Task<ActionResult> MovePhotoToAlbum(int photoId, int sourceAlbumId, int targetAlbumId)
        {
            if (photoId <= 0 || sourceAlbumId <= 0 || targetAlbumId <= 0)
                return BadRequest("Invalid photo ID, source album ID, or target album ID");

            var result = await _photoService.MovePhotoToAlbumAsync(photoId, sourceAlbumId, targetAlbumId);
            if (result == null)
                return NotFound("Photo, source album, or target album not found");

            return Ok(result);
        }
        [HttpPost("restore/photo/{photoId}")]
        public async Task<ActionResult> RestorePhoto(int photoId)
        {
            if (photoId < 0) return null;
            var success = await _photoService.RestorePhoto(photoId);
            if (success == null) return null;
            return Ok(success);
        }


        [HttpGet("tag/{tagId}")]
        public async Task<ActionResult<IEnumerable<PhotoDto>>> GetPhotosByTagIdAsync(int tagId)
        {
            if (tagId <= 0) return BadRequest("Invalid tag ID");

            var photos = await _photoService.GetPhotosByTagIdAsync(tagId);
            return Ok(photos);
        }


    }
}
