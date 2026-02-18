using ProductService.Application.Common.Interfaces;
using ProductService.Infrastructure.Data;
using ProductService.Infrastructure.Repositories;
using ProductService.Infrastructure.FileStorage;

namespace ProductService.API.DependencyInjection;

public static class InfrastructureDependency
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure MongoDB
        services.Configure<MongoDbSettings>(configuration.GetSection("MongoDB"));

        // Register MongoDB Repository
        services.AddSingleton<IProductRepository, ProductRepository>();

        // Configure MinIO File Storage
        services.Configure<MinIOSettings>(configuration.GetSection("FileStorage:MinIO"));
        services.AddScoped<IFileStorageService, MinIOFileStorageService>();

        return services;
    }
}
