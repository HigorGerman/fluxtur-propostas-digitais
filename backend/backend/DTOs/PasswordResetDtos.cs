using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class EsqueciSenhaRequestDto
{
    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "O formato do e-mail é inválido.")]
    public string Email { get; set; } = string.Empty;
}

public class RedefinirSenhaRequestDto
{
    [Required(ErrorMessage = "O token de recuperação é obrigatório.")]
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "A nova senha é obrigatória.")]
    [MinLength(8, ErrorMessage = "A senha deve ter no mínimo 8 caracteres.")]
    public string NovaSenha { get; set; } = string.Empty;
}
