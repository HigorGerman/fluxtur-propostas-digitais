namespace backend.Services;

public interface IImageUploadService
{
    Task<string> UploadImageAsync(IFormFile file);
}
