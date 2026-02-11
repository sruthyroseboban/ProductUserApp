using MediatR;
using ProductUserApp.Application.Common.Interfaces;
using ProductUserApp.Application.Users.DTOs;

namespace ProductUserApp.Application.Users.Queries.GetAllUsers;

public class GetAllUsersQueryHandler
    : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllUsersQueryHandler(IApplicationDbContext context)
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
