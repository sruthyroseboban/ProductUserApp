using ProductUserApp.Domain.Entities;

namespace ProductUserApp.Application.Interfaces;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync();
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
}
