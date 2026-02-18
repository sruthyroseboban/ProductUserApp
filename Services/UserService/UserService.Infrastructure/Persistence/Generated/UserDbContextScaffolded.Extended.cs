using Microsoft.EntityFrameworkCore;
using UserService.Domain.Entities;
using UserService.Application.Common.Models;
using UserService.Application.Users.DTOs;
using UserService.Application.Common.Interfaces;

namespace UserService.Infrastructure.Persistence;

// Partial class extension to implement IUserDbContext methods
public partial class UserDbContextScaffolded
{
    // Explicitly implement Users property to return IQueryable
    IQueryable<User> IUserDbContext.Users => Users.AsQueryable();

    public async Task<bool> UserExistsAsync(string email, CancellationToken cancellationToken)
    {
        return await Users.AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task AddEntityAsync<T>(T entity, CancellationToken cancellationToken) where T : class
    {
        await Set<T>().AddAsync(entity, cancellationToken);
    }

    public async Task<User?> GetUserByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<User?> GetUserByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken)
    {
        return await Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, cancellationToken);
    }

    public void RemoveEntity<T>(T entity) where T : class
    {
        Set<T>().Remove(entity);
    }

    public async Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken)
    {
        return await Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                Role = u.Role
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<UserDto>> GetAllUsersPagedAsync(
        int pageNumber, 
        int pageSize, 
        CancellationToken cancellationToken)
    {
        var totalCount = await Users.CountAsync(cancellationToken);

        var users = await Users
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                Role = u.Role
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<UserDto>
        {
            Items = users,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }
}
