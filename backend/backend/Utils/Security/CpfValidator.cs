namespace backend.Utils.Security;

public static class CpfValidator
{
    public static bool Validate(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
        {
            return false;
        }

        var cleanedCpf = new string(cpf.Where(char.IsDigit).ToArray());

        if (cleanedCpf.Length != 11)
        {
            return false;
        }

        if (cleanedCpf.All(c => c == cleanedCpf[0]))
        {
            return false;
        }

        var tempCpf = cleanedCpf[..9];
        var sum = 0;

        var multiplier1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        for (var i = 0; i < 9; i++)
        {
            sum += (tempCpf[i] - '0') * multiplier1[i];
        }

        var remainder = sum % 11;
        var digit1 = remainder < 2 ? 0 : 11 - remainder;

        tempCpf += digit1;
        sum = 0;
        var multiplier2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        for (var i = 0; i < 10; i++)
        {
            sum += (tempCpf[i] - '0') * multiplier2[i];
        }

        remainder = sum % 11;
        var digit2 = remainder < 2 ? 0 : 11 - remainder;

        return cleanedCpf.EndsWith($"{digit1}{digit2}");
    }
}
