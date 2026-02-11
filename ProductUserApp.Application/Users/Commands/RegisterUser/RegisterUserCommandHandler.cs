using MediatR;
using ProductUserApp.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using ProductUserApp.Application.Users.Commands.RegisterUser;
using ProductUserApp.Domain.Entities;

public class RegisterUserCommandHandler
    : IRequestHandler<RegisterUserCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterUserCommandHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<int> Handle(
    RegisterUserCommand request,
    CancellationToken cancellationToken)
    {
        var exists = await _context.Users
            .AnyAsync(x => x.Email == request.Email, cancellationToken);

        if (exists)
            throw new Exception("User already exists");

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = "User",
            CreatedAt = DateTime.UtcNow
        };

        await _context.AddEntityAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return user.Id;
    }

}
