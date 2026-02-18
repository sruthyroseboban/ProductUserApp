using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ProductService.Application.Common.Interfaces;
using ProductService.Application.Common.Models;
using ProductService.Domain.Entities;
using ProductService.Infrastructure.Data;

namespace ProductService.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly IMongoCollection<Product> _products;

    public ProductRepository(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _products = database.GetCollection<Product>("Products");
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _products.Find(_ => true).ToListAsync();
    }

    public async Task<PagedResult<Product>> GetAllPagedAsync(int pageNumber, int pageSize)
    {
        var totalCount = await _products.CountDocumentsAsync(_ => true);
        var items = await _products.Find(_ => true)
            .Skip((pageNumber - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return new PagedResult<Product>
        {
            Items = items,
            TotalCount = (int)totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<Product?> GetByIdAsync(string id)
    {
        return await _products.Find(p => p.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<Product>> GetByUserIdAsync(int userId)
    {
        return await _products.Find(p => p.CreatedByUserId == userId).ToListAsync();
    }

    public async Task<PagedResult<Product>> GetByUserIdPagedAsync(int userId, int pageNumber, int pageSize)
    {
        var filter = Builders<Product>.Filter.Eq(p => p.CreatedByUserId, userId);
        var totalCount = await _products.CountDocumentsAsync(filter);
        var items = await _products.Find(filter)
            .Skip((pageNumber - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return new PagedResult<Product>
        {
            Items = items,
            TotalCount = (int)totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<string> AddAsync(Product product)
    {
        await _products.InsertOneAsync(product);
        return product.Id;
    }

    public async Task UpdateAsync(Product product)
    {
        await _products.ReplaceOneAsync(p => p.Id == product.Id, product);
    }

    public async Task DeleteAsync(string id)
    {
        await _products.DeleteOneAsync(p => p.Id == id);
    }
}
