// backend/src/ShopSense.Api/Endpoints/ReadinessEndpoints.cs
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShopSense.Application;

namespace ShopSense.Api.Endpoints
{
    public static class ReadinessEndpoints
    {
        public static IEndpointRouteBuilder MapReadinessEndpoints(this IEndpointRouteBuilder endpoints)
        {
            // 🔒 Endpoint de diagnóstico para testes automatizados (apenas em Development)
            // 🔒 Endpoint de diagnóstico para testes (apenas em Development)
            var env = endpoints.ServiceProvider.GetRequiredService<IHostEnvironment>();
            if (env.IsDevelopment())
            {
                endpoints.MapGet("/_rl-test", async () =>
                    {
                        // segura a primeira requisição por ~120ms para garantir concorrência no TestServer
                        await Task.Delay(200);
                        return Results.Ok(new { ok = true });
                    })
                    .WithTags("Diagnostics")
                    .RequireRateLimiting("fixed");
            }


            // /ready — health de dependências (Mongo etc.)
            endpoints.MapGet("/ready", async (ISystemReadiness readiness, CancellationToken ct) =>
            {
                var report = await readiness.CheckAsync(ct);

                if (report.Ok)
                {
                    return Results.Ok(new
                    {
                        status = report.Status,
                        components = report.Components
                    });
                }

                return Results.Json(new
                {
                    status = report.Status,
                    components = report.Components
                }, statusCode: StatusCodes.Status503ServiceUnavailable);
            })
            .WithTags("Readiness")
            .WithDescription("Verifica dependências externas (Mongo) e retorna 200 se pronto; 503 caso contrário.");

            return endpoints;
        }
    }
}
