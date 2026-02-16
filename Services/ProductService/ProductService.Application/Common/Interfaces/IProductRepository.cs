using ProductService.Domain.Entities;

namespace ProductService.Application.Common.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(string id);
    Task<List<Product>> GetByUserIdAsync(int userId);
    Task<string> AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(string id);
}
