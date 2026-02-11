using MediatR;

namespace ProductUserApp.Application.Users.Commands.DeleteUser;

public record DeleteUserCommand(int Id) : IRequest<Unit>;
