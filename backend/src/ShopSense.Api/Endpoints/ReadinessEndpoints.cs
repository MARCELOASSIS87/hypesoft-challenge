using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ShopSense.Application;

namespace ShopSense.Api.Endpoints
{
    public static class ReadinessEndpoints
    {
        public static IEndpointRouteBuilder MapReadinessEndpoints(this IEndpointRouteBuilder endpoints)
        {
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
