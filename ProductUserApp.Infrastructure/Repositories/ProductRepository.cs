using Microsoft.EntityFrameworkCore;
using ProductUserApp.Application.Interfaces;
using ProductUserApp.Domain.Entities;
using ProductUserApp.Infrastructure.Data;

namespace ProductUserApp.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _ctx;

    public ProductRepository(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    // ✅ Get all products
    public async Task<List<Product>> GetAllAsync()
        => await _ctx.Products
            .ToListAsync();

    // ✅ Get products by user
    public async Task<List<Product>> GetByUserIdAsync(int userId)
        => await _ctx.Products
            .Where(p => p.CreatedByUserId == userId)
            .ToListAsync();

    // ✅ Get by id
    public async Task<Product?> GetByIdAsync(int id)
        => await _ctx.Products.FindAsync(id);

    // ✅ Add
    public async Task AddAsync(Product product)
    {
        _ctx.Products.Add(product);
        await _ctx.SaveChangesAsync();
    }

    // ✅ Update
    public async Task UpdateAsync(Product product)
    {
        _ctx.Products.Update(product);
        await _ctx.SaveChangesAsync();
    }

    // ✅ Delete by id
    public async Task DeleteAsync(int id)
    {
        var product = await _ctx.Products.FindAsync(id);

        if (product != null)
        {
            _ctx.Products.Remove(product);
            await _ctx.SaveChangesAsync();
        }
    }
}
