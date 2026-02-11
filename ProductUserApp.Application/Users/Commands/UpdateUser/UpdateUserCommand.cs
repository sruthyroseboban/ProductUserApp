using MediatR;

namespace ProductUserApp.Application.Users.Commands.UpdateUser;

public record UpdateUserCommand(
    int Id,
    string UserName,
    string Email,
    string Role
) : IRequest<Unit>;
