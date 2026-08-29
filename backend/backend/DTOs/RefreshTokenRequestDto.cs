using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
