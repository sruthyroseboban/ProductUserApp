using Microsoft.EntityFrameworkCore;
using ProductUserApp.Application.Common.Interfaces;
using ProductUserApp.Domain.Entities;
using ProductUserApp.Application.Users.DTOs;

namespace ProductUserApp.Infrastructure.Data;

public class AppDbContext : DbContext, IApplicationDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }

    IQueryable<User> IApplicationDbContext.Users => Users;

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => base.SaveChangesAsync(cancellationToken);

    public async Task<bool> UserExistsAsync(string email, CancellationToken cancellationToken)
    {
        return await Users.AnyAsync(x => x.Email == email, cancellationToken);
    }

    public async Task AddEntityAsync<T>(T entity, CancellationToken cancellationToken)
    where T : class
    {
        await Set<T>().AddAsync(entity, cancellationToken);
    }


    public async Task<User?> GetUserByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public void RemoveEntity<T>(T entity) where T : class
    {
        Set<T>().Remove(entity);
    }

    public async Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken)
    {
        return await Users
            .AsNoTracking()
            .Select(user => new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);
    }

}
