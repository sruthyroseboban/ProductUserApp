namespace ProductUserApp.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(int userId, string email, string role);
}

