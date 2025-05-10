using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ImageDesign.API.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    //public class CollageController : ControllerBase
    //{
    //    // GET: api/<CollageController>

    //    [HttpPost("save")]
    //    public async Task<IActionResult> SaveCollage([FromForm] IFormFile file)
    //    {
    //        if (file == null || file.Length == 0)
    //        {
    //            return BadRequest("No file uploaded.");
    //        }

    //        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles", file.FileName);

    //        // ודא שהספרייה קיימת
    //        Directory.CreateDirectory(Path.GetDirectoryName(filePath));

    //        // שמור את הקובץ
    //        using (var stream = new FileStream(filePath, FileMode.Create))
    //        {
    //            await file.CopyToAsync(stream);
    //        }

    //        return Ok(new { FilePath = filePath });
    //    }
    //    [HttpGet("all")]
    //    public IActionResult GetAllCollages()
    //    {
    //        var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
    //        if (!Directory.Exists(directoryPath))
    //        {
    //            return NotFound("No collages found.");
    //        }

    //        var files = Directory.GetFiles(directoryPath)
    //                             .Select(Path.GetFileName)
    //                             .ToList();

    //        return Ok(files);
    //    }
    //}
}
