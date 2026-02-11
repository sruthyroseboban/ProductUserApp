using MediatR;
using Microsoft.EntityFrameworkCore;
using ProductUserApp.Application.Common.Interfaces;

namespace ProductUserApp.Application.Users.Commands.LoginUser;

public class LoginUserCommandHandler
    : IRequestHandler<LoginUserCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public LoginUserCommandHandler(
        IApplicationDbContext context,
        IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<string> Handle(
        LoginUserCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Email == request.Email,
                cancellationToken);

        if (user == null)
            throw new Exception("Invalid credentials");

        // Compare hashed password here
        if (user.PasswordHash != request.Password)
            throw new Exception("Invalid credentials");

        return _jwtService.GenerateToken(
            user.Id,
            user.Email,
            user.Role
        );
    }
}
