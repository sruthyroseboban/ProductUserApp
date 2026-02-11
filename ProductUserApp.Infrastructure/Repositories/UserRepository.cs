using ProductUserApp.Application.Interfaces;
using ProductUserApp.Domain.Entities;
using ProductUserApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ProductUserApp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _ctx;

    public UserRepository(AppDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<List<User>> GetAllAsync()
        => await _ctx.Users.ToListAsync();

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _ctx.Users.FindAsync(id);
    }


    public async Task AddAsync(User user)
    {
        _ctx.Users.Add(user);
        await _ctx.SaveChangesAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _ctx.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}
