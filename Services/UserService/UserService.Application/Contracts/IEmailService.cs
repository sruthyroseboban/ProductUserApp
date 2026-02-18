namespace UserService.Application.Contracts;

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string otpCode);
    Task SendWelcomeEmailAsync(string toEmail, string userName);
}
