using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class LoginRequestDto
{
    [Required]
    public string Identificador { get; set; } = string.Empty;

    [Required]
    public string Senha { get; set; } = string.Empty;
}
