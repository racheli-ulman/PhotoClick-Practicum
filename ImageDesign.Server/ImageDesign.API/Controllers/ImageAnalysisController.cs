using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageAnalysisController : ControllerBase
    {
        //private readonly IFileService _fileService;
        //private readonly IImageAnalysisService _aiService;

        //public ImageAnalysisController(IFileService fileService, IImageAnalysisService aiService)
        //{
        //    _fileService = fileService;
        //    _aiService = aiService;
        //}

        //[HttpPost("analyze-all-images")]
        //public async Task<IActionResult> AnalyzeAllImages()
        //{
        //    var allFiles = await _fileService.GetAllFiles();
        //    var results = new List<object>();

        //    foreach (var file in allFiles)
        //    {
        //        try
        //        {
        //            using var stream = await _fileService.DownloadFile(file.Id);
        //            if (stream == null) continue;

        //            using var ms = new MemoryStream();
        //            await stream.CopyToAsync(ms);
        //            var bytes = ms.ToArray();

        //            var analysis = await _aiService.AnalyzeImageAsync(bytes);

        //            // עדכון התמונה בבסיס הנתונים עם תוצאות הניתוח
        //            file.Category = analysis.Category;
        //            file.IsBlurry = analysis.IsBlurry;
        //            file.PeopleCount = analysis.PeopleCount;
        //            file.IsOutdoor = analysis.IsOutdoor;
        //            file.EyesClosed = analysis.HasClosedEyes;
        //            file.AnalysisCompletedIs = true;

        //            await _fileService.UpdateFile(file);

        //            results.Add(new
        //            {
        //                FileId = file.Id,
        //                FileName = file.FileName,
        //                Analysis = analysis
        //            });
        //        }
        //        catch (Exception ex)
        //        {
        //            results.Add(new
        //            {
        //                FileId = file.Id,
        //                FileName = file.FileName,
        //                Error = ex.Message
        //            });
        //        }
        //    }

        //    return Ok(results);
        //}
    }

}

