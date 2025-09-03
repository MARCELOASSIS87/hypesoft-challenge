using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using ShopSense.Domain.Repositories;
using ShopSense.Infrastructure.Repositories.Mongo;
using ShopSense.Domain.Services;

namespace ShopSense.Api.Extensions;

/// <summary>
/// Extensões para registrar serviços de domínio/infra no container.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registra MongoDB e repositórios concretos no DI.
    /// Lê MONGO_URI e MONGO_DATABASE das variáveis de ambiente, com defaults seguros.
    /// </summary>
    public static IServiceCollection AddDomainServices(this IServiceCollection services, IConfiguration config)
    {
        var mongoUri = Environment.GetEnvironmentVariable("MONGO_URI") ?? "mongodb://localhost:27017";
        var databaseName = Environment.GetEnvironmentVariable("MONGO_DATABASE") ?? "shopsense";

        services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoUri));
        services.AddSingleton<IMongoDatabase>(sp =>
        {
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase(databaseName);
        });

        // Repositórios Mongo
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IInventoryMovementRepository, InventoryMovementRepository>();

        // Serviços de domínio
        services.AddScoped<InventoryService>();
        return services;
    }
}
