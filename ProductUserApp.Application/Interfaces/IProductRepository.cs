using ProductUserApp.Domain.Entities;

namespace ProductUserApp.Application.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();

    Task<List<Product>> GetByUserIdAsync(int userId);

    Task<Product?> GetByIdAsync(int id);

    Task AddAsync(Product product);

    Task UpdateAsync(Product product);

    Task DeleteAsync(int id);
}
