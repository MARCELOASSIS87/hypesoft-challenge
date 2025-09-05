using Microsoft.Extensions.DependencyInjection;
using ShopSense.Api.Middlewares;

namespace ShopSense.Api.Extensions;

public static class CacheSetupExtensions
{
    public static IServiceCollection AddQueryMemoryCache(this IServiceCollection services)
    {
        services.AddMemoryCache();
        services.AddTransient<QueryCacheMiddleware>();
        return services;
    }
}
