using MediatR;
using ProductUserApp.Application.Common.Interfaces;
using ProductUserApp.Domain.Entities;

namespace ProductUserApp.Application.Users.Commands.CreateUser;

public class CreateUserCommandHandler
    : IRequestHandler<CreateUserCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var exists = await _context.UserExistsAsync(request.Email, cancellationToken);

        if (exists)
            throw new Exception("User already exists");

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            PasswordHash = request.Password,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        await _context.AddEntityAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return user.Id;
    }

}
