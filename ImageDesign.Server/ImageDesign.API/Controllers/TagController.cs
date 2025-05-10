using AutoMapper;
using ImageDesign.API.Models;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.IServices;
using ImageDesign.Service;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {

        private readonly ITagService _tagService;
        private readonly IMapper _mapper;

        public TagController(ITagService tagService, IMapper mapper)
        {
            _tagService = tagService;
            _mapper = mapper;
        }
        // GET: api/<TagController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> Get()
        {
            var tags = await _tagService.GetAllTagsAsync();
            var tagsDto = _mapper.Map<IEnumerable<TagDto>>(tags);
            return Ok(tagsDto);
        }

        // GET api/<TagController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> Get(int id)
        {
            var tag = await _tagService.GetTagByIdAsync(id);
            var tagdto = _mapper.Map<TagDto>(tag);
            return Ok(tagdto);
        }

        // POST api/<TagController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TagPostModel tag)
        {
            if (tag == null) return null;
            var tagdto = _mapper.Map<TagDto>(tag);
            var result = await _tagService.AddTagAsync(tagdto);
            if (result == null)
                return null;
            return Ok(result);
        }

        // PUT api/<TagController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TagPostModel tag)
        {
            if (id < 0 || tag == null) return null;
            var success = await _tagService.UpdateTagAsync(id, _mapper.Map<TagDto>(tag));
            if (success == null) return null;
            return Ok(success.Id);
        }


        // DELETE api/<TagController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            if (id < 0) return BadRequest();
            bool success = await _tagService.DeleteTagAsync(id);
            if (!success) return NotFound();
            return Ok(success);
        }
    }
}
