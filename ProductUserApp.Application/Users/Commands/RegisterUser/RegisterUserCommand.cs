using MediatR;

namespace ProductUserApp.Application.Users.Commands.RegisterUser;

public record RegisterUserCommand(
    string UserName,
    string Email,
    string Password
) : IRequest<int>;
