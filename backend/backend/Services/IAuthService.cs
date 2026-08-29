using backend.DTOs;

namespace backend.Services;

public interface IAuthService
{
    Task<(LoginResponseDto Response, string RefreshToken)> LoginAsync(LoginRequestDto dto);
    Task<(LoginResponseDto Response, string RefreshToken)> RefreshTokenAsync(string refreshToken);
}
