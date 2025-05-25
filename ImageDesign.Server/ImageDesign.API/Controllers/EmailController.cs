using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        [HttpPost]
        [Route("send-email")]
        public IActionResult SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                // קריאה לקובץ HTML עם קידוד UTF-8
                var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ManaggerMail.html");
                var htmlTemplate = System.IO.File.ReadAllText(templatePath, System.Text.Encoding.UTF8);

                // החלפת משתנים בתבנית ה-HTML
                var bodyWithHtml = htmlTemplate
                    .Replace("{{Subject}}", request.Subject)
                    .Replace("{{Body}}", request.Body)
                    .Replace("{{SenderName}}", request.SenderName)
                    .Replace("{{ImageUrl}}", request.ImageUrl);

                // הגדרות SMTP
                var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,

                    Credentials = new NetworkCredential("cheers.rh8867@gmail.com", smtpPassword),
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                };

                // יצירת הודעת מייל עם גוף HTML וקידוד UTF-8
                var mailMessage = new MailMessage
                {
                    From = new MailAddress("cheers.rh8867@gmail.com"),
                    Subject = request.Subject,
                    Body = bodyWithHtml,
                    IsBodyHtml = true,
                    BodyEncoding = System.Text.Encoding.UTF8,
                    SubjectEncoding = System.Text.Encoding.UTF8
                };

                mailMessage.To.Add(request.To);

                // הגדרת כותרות עם קידוד נכון
                mailMessage.HeadersEncoding = System.Text.Encoding.UTF8;
                mailMessage.Headers.Add("Content-Type", "text/html; charset=utf-8");

                smtpClient.Send(mailMessage);
                return Ok("Email sent successfully");
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"SMTP error details: {smtpEx.ToString()}");
                return BadRequest($"SMTP error: {smtpEx.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error details: {ex.ToString()}");
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }

    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string SenderName { get; set; }  // שם השולח שיוצג במייל
        public string ImageUrl { get; set; }    // כתובת התמונה שתוצג במייל
    }
}