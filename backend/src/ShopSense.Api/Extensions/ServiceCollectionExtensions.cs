using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using ShopSense.Domain.Repositories;
using ShopSense.Infrastructure.Repositories.Mongo;
using ShopSense.Domain.Services;
using ShopSense.Application;
using ShopSense.Infrastructure.Services;

namespace ShopSense.Api.Extensions;

/// <summary>
/// Composition Root: registra infra + domínio no container.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registra MongoDB, repositórios, serviços de domínio e readiness.
    /// Lê MONGO_URI e MONGO_DATABASE das variáveis de ambiente (com defaults).
    /// </summary>
    public static IServiceCollection AddDomainServices(this IServiceCollection services, IConfiguration config)
    {
        var mongoUri = Environment.GetEnvironmentVariable("MONGO_URI") ?? "mongodb://localhost:27017";
        var databaseName = Environment.GetEnvironmentVariable("MONGO_DATABASE") ?? "shopsense";

        // Mongo
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

        // Readiness (Infra)
        services.AddSingleton<ISystemReadiness, SystemReadiness>();

        return services;
    }
}
