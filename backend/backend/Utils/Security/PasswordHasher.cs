namespace backend.Utils.Security;

public static class PasswordHasher
{
    public static string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
        {
            throw new ArgumentException("A senha deve ter no mínimo 8 caracteres.");
        }
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hashedPassword))
        {
            return false;
        }
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}
