using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownloadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        public DownloadController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        [HttpGet("download-url/{fileName}")]
        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "imagedsignapplication",
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddDays(300),
            };

            return _s3Client.GetPreSignedURL(request);
        }

    }

}
