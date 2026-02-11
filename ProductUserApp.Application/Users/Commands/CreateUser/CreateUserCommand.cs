using MediatR;

namespace ProductUserApp.Application.Users.Commands.CreateUser;

public record CreateUserCommand(
    string UserName,
    string Email,
    string Password,
    string Role
) : IRequest<int>;
