using MediatR;
using UserService.Application.Users.DTOs;

namespace UserService.Application.Users.Commands.LoginUser;

public record LoginUserCommand(
    string Email,
    string Password
) : IRequest<LoginResponse>;
