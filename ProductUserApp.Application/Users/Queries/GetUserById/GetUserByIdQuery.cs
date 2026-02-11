using MediatR;
using ProductUserApp.Application.Users.DTOs;

namespace ProductUserApp.Application.Users.Queries.GetUserById;

public record GetUserByIdQuery(int Id) : IRequest<UserDto>;
