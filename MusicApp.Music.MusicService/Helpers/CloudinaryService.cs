using CloudinaryDotNet.Actions;
using CloudinaryDotNet;

namespace MusicApp.Music.MusicService.Helpers;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(string cloudName, string apiKey, string apiSecret)
    {
        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folder)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Invalid file");

        using (var stream = file.OpenReadStream())
        {
            var uploadParams = new RawUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,
                PublicId = Guid.NewGuid().ToString()
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new Exception($"Cloudinary error: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }
    }

    public async Task<string> UploadImageAsync(IFormFile image, string folder)
    {
        if (image == null || image.Length == 0)
            throw new ArgumentException("Invalid Image");

        using (var stream = image.OpenReadStream())
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(image.FileName, stream),
                Folder = folder,
                PublicId = Guid.NewGuid().ToString()
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new Exception($"Cloudinary error: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }
    }


    public async Task DeleteFileAsync(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            throw new ArgumentException("Invalid file path.");

        // Extract public ID from the file URL
        var publicId = ExtractPublicId(filePath);
        if (string.IsNullOrEmpty(publicId))
            throw new ArgumentException("Could not extract public ID from file path.");

        // Create deletion parameters
        var deletionParams = new DeletionParams(publicId);

        // Attempt to delete the file
        var result = await _cloudinary.DestroyAsync(deletionParams);

        // Handle any errors from Cloudinary
        if (result.Result != "ok" && result.Result != "not_found")
        {
            throw new Exception($"Cloudinary deletion failed: {result.Error?.Message}");
        }
    }

    private string ExtractPublicId(string filePath)
    {
        try
        {
            var uri = new Uri(filePath);
            var segments = uri.AbsolutePath.Split('/');

            // Get the part of the URL after the folder, without the extension
            var publicId = string.Join("/", segments.Skip(segments.Length - 2));
            return publicId.Split('.')[0]; // Remove the file extension
        }
        catch
        {
            return string.Empty; // Return empty if extraction fails
        }
    }
}
