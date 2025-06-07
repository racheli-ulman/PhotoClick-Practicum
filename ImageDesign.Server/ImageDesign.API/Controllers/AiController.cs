using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;
using System.Text;
using Newtonsoft.Json;
namespace ImageDesign.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _openAiApiKey;
        private readonly ILogger<AiController> _logger;

        public AiController(HttpClient httpClient, IConfiguration configuration, ILogger<AiController> logger)
        {
            _httpClient = httpClient;
            // שינוי: שליפת המפתח מ-API_KEY במקום OpenAI:ApiKey
            _openAiApiKey = configuration["API_KEY"] ??
                           Environment.GetEnvironmentVariable("API_KEY") ??
                           throw new ArgumentNullException("API_KEY not configured in environment variables."); _logger = logger;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateImage([FromBody] ImageRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Prompt))
                {
                    _logger.LogWarning("GenerateImage: Prompt is required.");
                    return BadRequest(new { error = "Prompt is required" });
                }

                _logger.LogInformation($"Attempting to translate prompt: '{request.Prompt}'");
                string promptEn = await TranslateToEnglish(request.Prompt);
                _logger.LogInformation($"Translated prompt to English: '{promptEn}'");

                // Prepare OpenAI API request for DALL-E
                var dalleRequest = new
                {
                    prompt = promptEn,
                    n = 1,
                    size = "1024x1024" // שונה ל-1024x1024 עבור DALL-E 3
                };

                var json = System.Text.Json.JsonSerializer.Serialize(dalleRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openAiApiKey}");

                _logger.LogInformation("Sending DALL-E API request...");
                //var response = await _httpClient.PostAsync("https://api.deepai.org/api/text2img", content);
                var response = await _httpClient.PostAsync("https://api.openai.com/v1/images/generations", content);
                _logger.LogInformation($"Received DALL-E API response with status code: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    var errorResponseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"DALL-E API returned error status: {response.StatusCode}. Content: {errorResponseContent}");
                    return StatusCode((int)response.StatusCode, new { error = "DALL-E API error", details = errorResponseContent });
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"DALL-E API successful response content: {responseContent}");

                // תיקון ה-Deserialization עם אפשרויות נכונות
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var dalleResponse = System.Text.Json.JsonSerializer.Deserialize<DalleResponse>(responseContent, options);

                string? imageUrl = dalleResponse?.Data?.FirstOrDefault()?.Url;

                if (string.IsNullOrEmpty(imageUrl))
                {
                    _logger.LogError("DALL-E API response did not contain a valid image URL.");
                    _logger.LogError($"Raw response for debugging: {responseContent}");
                    return StatusCode(500, new { error = "Failed to generate image: No URL in response." });
                }

                _logger.LogInformation($"Generated image URL: {imageUrl}");

                return Ok(imageUrl);
                // Download the image
                //_logger.LogInformation($"Attempting to download image from: {imageUrl}");
                //var imageResponse = await _httpClient.GetAsync(imageUrl);
                //_logger.LogInformation($"Image download response status: {imageResponse.StatusCode}");
                //imageResponse.EnsureSuccessStatusCode();

                //var imageBytes = await imageResponse.Content.ReadAsByteArrayAsync();

                //return File(imageBytes, "image/png", "generated_image.png");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, $"API request failed: {ex.Message}");
                return StatusCode(500, new { error = $"API request failed: {ex.Message}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Internal server error: {ex.Message}");
                return StatusCode(500, new { error = $"Internal server error: {ex.Message}" });
            }
        }
        private async Task<string> TranslateToEnglish(string text)
        {
            try
            {
                string url = "https://api.openai.com/v1/chat/completions";

                var translateRequest = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { role = "system", content = "You are a translator. Translate the given text to English and return ONLY the translated text, nothing else." },
                        new { role = "user", content = text }
                    },
                    max_tokens = 100,
                    temperature = 0
                };

                var json = System.Text.Json.JsonSerializer.Serialize(translateRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openAiApiKey}");

                _logger.LogInformation($"Sending OpenAI Translation API request for text: '{text}'");
                var response = await _httpClient.PostAsync(url, content);
                _logger.LogInformation($"Received OpenAI Translation API response status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    var errorResponseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"OpenAI Translation API returned error status: {response.StatusCode}. Content: {errorResponseContent}");
                    return text;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"OpenAI Translation API successful response content: {responseContent}");

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var openAiResponse = System.Text.Json.JsonSerializer.Deserialize<OpenAIChatCompletionResponse>(responseContent, options);
                string? translatedText = openAiResponse?.Choices?.FirstOrDefault()?.Message?.Content?.Trim();

                if (!string.IsNullOrEmpty(translatedText))
                {
                    // הסרת ציטוטים אם קיימים
                    if (translatedText.StartsWith("\"") && translatedText.EndsWith("\""))
                    {
                        translatedText = translatedText.Substring(1, translatedText.Length - 2);
                    }

                    _logger.LogInformation($"Successfully extracted translated text: '{translatedText}'");
                    return translatedText;
                }

                _logger.LogWarning("OpenAI Translation API response did not contain extractable translated text.");
                return text;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Translation failed with OpenAI: {ex.Message}");
                return text;
            }
        }
    }

    // Request/Response models
    public class ImageRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }

    public class DalleResponse
    {
        public List<DalleImageData>? Data { get; set; }
    }

    public class DalleImageData
    {
        public string? Url { get; set; }
    }

    public class OpenAIChatCompletionResponse
    {
        public List<OpenAIChoice>? Choices { get; set; }
    }

    public class OpenAIChoice
    {
        public OpenAIMessage? Message { get; set; }
        public int Index { get; set; }
        public string? FinishReason { get; set; }
    }

    public class OpenAIMessage
    {
        public string? Role { get; set; }
        public string? Content { get; set; }
    }
    public class ImageResponse
    {
        public int Created { get; set; }
        public List<ImageData> Data { get; set; }
    }

    public class ImageData
    {
        public string B64Json { get; set; }
    }


}