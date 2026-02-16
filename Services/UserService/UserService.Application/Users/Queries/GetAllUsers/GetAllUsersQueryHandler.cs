using MediatR;
using UserService.Application.Common.Interfaces;
using UserService.Application.Users.DTOs;

namespace UserService.Application.Users.Queries.GetAllUsers;

public class GetAllUsersQueryHandler
    : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IUserDbContext _context;

    public GetAllUsersQueryHandler(IUserDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> Handle(
      GetAllUsersQuery request,
      CancellationToken cancellationToken)
    {
        return await _context.GetAllUsersAsync(cancellationToken);
    }
}
