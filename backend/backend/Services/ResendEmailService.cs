using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace backend.Services;

public class ResendEmailService : IEmailService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ResendEmailService> _logger;

    public ResendEmailService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<ResendEmailService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
        var resendSection = _configuration.GetSection("Resend");
        var apiKey = resendSection["ApiKey"] ?? "re_TEST_KEY_AQUI";
        var fromEmail = resendSection["FromEmail"] ?? "Fluxtur <onboarding@resend.dev>";

        var subject = "Recuperação de Senha - Fluxtur";
        var htmlBody = BuildPasswordResetHtml(resetLink);

        _logger.LogInformation("[RESEND] Preparando envio de e-mail de recuperação para: {Email}", toEmail);
        Console.WriteLine($"[RESEND] Link gerado para {toEmail}: {resetLink}");

        // Se a chave for de teste padrão ou vazia, simula o envio com log informativo
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "re_TEST_KEY_AQUI")
        {
            _logger.LogWarning("[RESEND TEST MODE] Chave de teste detectada (re_TEST_KEY_AQUI). Link de redefinição: {Link}", resetLink);
            return true;
        }

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var payload = new
            {
                from = fromEmail,
                to = new[] { toEmail },
                subject = subject,
                html = htmlBody
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await client.PostAsync("https://api.resend.com/emails", jsonContent);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("[RESEND ERROR] Falha no envio HTTP ({StatusCode}): {Body}", response.StatusCode, responseBody);
                Console.WriteLine($"[RESEND ERROR] Status {response.StatusCode}: {responseBody}");
                return false;
            }

            _logger.LogInformation("[RESEND SUCCESS] E-mail enviado com sucesso para {Email}. Resposta: {Body}", toEmail, responseBody);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[RESEND EXCEPTION] Erro ao comunicar com API do Resend: {Message}", ex.Message);
            Console.WriteLine($"[RESEND EXCEPTION] {ex.Message}");
            return false;
        }
    }

    private static string BuildPasswordResetHtml(string resetLink)
    {
        return $@"
<!DOCTYPE html>
<html lang=""pt-BR"">
<head>
  <meta charset=""UTF-8"" />
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
  <title>Recuperação de Senha - Fluxtur</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #F5F7FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;"">
  <table role=""presentation"" width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #F5F7FB; padding: 40px 15px;"">
    <tr>
      <td align=""center"">
        <table role=""presentation"" width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 520px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(10, 26, 60, 0.05); overflow: hidden;"">
          <!-- CABEÇALHO COM IDENTIDADE FLUXTUR -->
          <tr>
            <td style=""background-color: #0A1A3C; padding: 28px 32px; text-align: center;"">
              <span style=""font-size: 24px; font-weight: 900; letter-spacing: 0.15em; color: #38BDF8;"">FLUXTUR</span>
              <p style=""margin: 4px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #94A3B8; text-transform: uppercase;"">Painel Administrativo</p>
            </td>
          </tr>

          <!-- CONTEÚDO PRINCIPAL -->
          <tr>
            <td style=""padding: 36px 32px;"">
              <h1 style=""margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #0A1A3C; text-align: center;"">Recuperação de Senha</h1>
              <p style=""margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #475569;"">
                Olá! Recebemos uma solicitação para redefinir a senha da sua conta de acesso administrativo no sistema Fluxtur.
              </p>
              <p style=""margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #475569;"">
                Para cadastrar uma nova senha, clique no botão seguro abaixo:
              </p>

              <!-- BOTÃO DE AÇÃO -->
              <table role=""presentation"" width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"">
                <tr>
                  <td align=""center"">
                    <a href=""{resetLink}"" target=""_blank"" style=""display: inline-block; background-color: #0A1A3C; color: #38BDF8; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; border: 1px solid #38BDF8; text-align: center;"">
                      Redefinir Minha Senha
                    </a>
                  </td>
                </tr>
              </table>

              <!-- AVISO DE EXPIRAÇÃO -->
              <div style=""margin-top: 32px; padding: 16px; background-color: #F8FAFC; border-radius: 10px; border-left: 4px solid #38BDF8;"">
                <p style=""margin: 0; font-size: 12px; line-height: 1.5; color: #64748B;"">
                  ⏳ <strong>Atenção:</strong> Por motivos de segurança, este link é válido por apenas <strong>30 minutos</strong> e só pode ser utilizado uma única vez.
                </p>
              </div>

              <!-- LINK DIRETO CASO O BOTÃO NÃO ABRA -->
              <p style=""margin: 24px 0 0 0; font-size: 11px; line-height: 1.5; color: #94A3B8; word-break: break-all;"">
                Se você não conseguir clicar no botão, copie e cole o link a seguir no seu navegador:<br />
                <a href=""{resetLink}"" style=""color: #0284C7; text-decoration: underline;"">{resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- RODAPÉ -->
          <tr>
            <td style=""background-color: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; text-align: center;"">
              <p style=""margin: 0; font-size: 11px; line-height: 1.5; color: #94A3B8;"">
                Se você não realizou esta solicitação, por favor desconsidere este e-mail. Sua senha atual permanecerá segura e inalterada.<br />
                <strong>Fluxtur Viagens &copy; 2026</strong> • Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";
    }
}
