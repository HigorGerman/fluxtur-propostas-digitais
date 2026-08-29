using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace backend.Services;

public class CloudinaryUploadService : IImageUploadService
{
    private readonly IConfiguration _configuration;
    private readonly Cloudinary? _cloudinary;

    public CloudinaryUploadService(IConfiguration configuration)
    {
        _configuration = configuration;
        var cloudName = _configuration["CloudinarySettings:CloudName"];
        var apiKey = _configuration["CloudinarySettings:ApiKey"];
        var apiSecret = _configuration["CloudinarySettings:ApiSecret"];

        if (!string.IsNullOrEmpty(cloudName) && cloudName != "YOUR_CLOUD_NAME" &&
            !string.IsNullOrEmpty(apiKey) && apiKey != "YOUR_API_KEY" &&
            !string.IsNullOrEmpty(apiSecret) && apiSecret != "YOUR_API_SECRET")
        {
            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }
    }

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return string.Empty;
        }

        if (_cloudinary == null)
        {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945";
        }

        try
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "fluxtur"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl?.ToString() ?? "https://images.unsplash.com/photo-1566073771259-6a8506099945";
        }
        catch
        {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945";
        }
    }
}
