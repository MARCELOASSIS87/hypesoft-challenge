using Microsoft.Extensions.DependencyInjection;
using ShopSense.Api.Middlewares;
using ShopSense.Api.Services;

namespace ShopSense.Api.Extensions;

public static class CacheSetupExtensions
{
    public static IServiceCollection AddQueryMemoryCache(this IServiceCollection services)
    {
        services.AddMemoryCache();

        // Provider de versão por escopo ("/products", "/categories", …)
        services.AddSingleton<ICacheVersionProvider, PathScopedCacheVersionProvider>();

        // Middleware de cache
        services.AddTransient<QueryCacheMiddleware>();
        return services;
    }
}
