namespace MusicApp.Music.MusicService.DTOs.Responses;

public class ServiceResponse<T>
{
    public bool SuccessProperty { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    private ServiceResponse(bool success, string message, T? data)
    {
        SuccessProperty = success;
        Message = message;
        Data = data;
    }

    // Factory method for success
    public static ServiceResponse<T> Success(T data, string message = "Operation successful.")
    {
        return new ServiceResponse<T>(true, message, data);
    }

    // Factory method for success without data
    public static ServiceResponse<T> Success(string message)
    {
        return new ServiceResponse<T>(true, message, default);
    }

    // Factory method for failure
    public static ServiceResponse<T> Failure(string message)
    {
        return new ServiceResponse<T>(false, message, default);
    }
}
