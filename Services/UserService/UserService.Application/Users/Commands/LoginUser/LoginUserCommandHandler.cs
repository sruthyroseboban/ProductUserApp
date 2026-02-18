using MediatR;
using Microsoft.EntityFrameworkCore;
using UserService.Application.Common.Interfaces;
using UserService.Application.Users.DTOs;
using UserService.Application.Contracts;

namespace UserService.Application.Users.Commands.LoginUser;

public class LoginUserCommandHandler
    : IRequestHandler<LoginUserCommand, object>
{
    private readonly IUserDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    // OTP FEATURE COMMENTED OUT 
    // private readonly IOtpService _otpService;
    // private readonly IEmailService _emailService;
   

    public LoginUserCommandHandler(
        IUserDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService
        //  OTP FEATURE COMMENTED OUT 
        // IOtpService otpService,
        // IEmailService emailService
        
        )
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        //  OTP FEATURE COMMENTED OUT 
        // _otpService = otpService;
        // _emailService = emailService;
       
    }

    public async Task<object> Handle(
        LoginUserCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Email == request.Email,
                cancellationToken);

        if (user == null)
            throw new UnauthorizedAccessException("User not found with this email address");

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid password. Please try again");

        //  OTP FEATURE COMMENTED OUT
        // Generate and send OTP instead of returning tokens immediately
        // var otp = _otpService.GenerateOtp();
        // _otpService.StoreOtp(user.Email, otp);
        // await _emailService.SendOtpEmailAsync(user.Email, otp);
        // return new OtpRequiredResponse
        // {
        //     Email = user.Email,
        //     Message = "OTP sent to your email. Please verify to complete login.",
        //     OtpRequired = true
        // };
        

        //  DIRECT LOGIN (OTP BYPASSED)
        var accessToken = _jwtService.GenerateToken(user.Id, user.Email, user.Role);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = 3600
        };
      
    }
}
