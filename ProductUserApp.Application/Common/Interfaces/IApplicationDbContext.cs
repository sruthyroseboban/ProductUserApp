using ProductUserApp.Domain.Entities;
using ProductUserApp.Application.Users.DTOs;

namespace ProductUserApp.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    //RegisterUserCommandHandler needs this property to check if user with given email already exists
    IQueryable<User> Users { get; }

    //CreateUserCommandHandler needs this method to check if user with given email already exists
    Task<bool> UserExistsAsync(string email, CancellationToken cancellationToken);

    //RegisterUserCommandHandler needs this method to add new user to the database
    Task AddEntityAsync<T>(T entity, CancellationToken cancellationToken) where T : class;

    //RegisterUserCommandHandler needs this method to save changes to the database
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    // UpdateUserCommandHandler needs this method to get user by id
    Task<User?> GetUserByIdAsync(int id, CancellationToken cancellationToken);

    // DeleteUserCommandHandler needs this method to remove user from the database
    void RemoveEntity<T>(T entity) where T : class;

    // GetAllUsersQueryHandler needs this method to get all users from the database
    Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken);

}

