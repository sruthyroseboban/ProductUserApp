using MediatR;
using ProductUserApp.Application.Users.DTOs;

namespace ProductUserApp.Application.Users.Queries.GetAllUsers;

public record GetAllUsersQuery : IRequest<List<UserDto>>;
