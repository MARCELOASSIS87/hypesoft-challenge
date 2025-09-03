using Microsoft.AspNetCore.Builder;

namespace ShopSense.Api.Middlewares;

/// <summary>
/// Middleware simples para garantir um X-Request-Id em todas as requisições
/// e devolvê-lo na resposta, ajudando na correlação de logs.
/// </summary>
public static class RequestIdMiddleware
{
    public static IApplicationBuilder UseRequestId(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            const string HeaderName = "X-Request-Id";

            if (!context.Request.Headers.TryGetValue(HeaderName, out var requestId) || string.IsNullOrWhiteSpace(requestId))
            {
                requestId = Guid.NewGuid().ToString("N");
                context.Request.Headers[HeaderName] = requestId;
            }

            context.Response.Headers[HeaderName] = requestId!;
            await next();
        });
    }
}
