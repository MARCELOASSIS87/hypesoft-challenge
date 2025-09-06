using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace ShopSense.Tests.TestServer;

public class ApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development"); // mantém seu Program do jeito que está

        builder.ConfigureAppConfiguration((ctx, cfg) =>
        {
            var mem = new Dictionary<string, string?>
            {
                // CORS liberado p/ o front local
                ["Security:AllowedOrigins:0"] = "http://localhost:3000",

                // *** Rate limit BEM BAIXO para garantir 429 no teste ***
                ["Security:RateLimiting:FixedWindow:PermitLimit"] = "1",
                ["Security:RateLimiting:FixedWindow:WindowSeconds"] = "60",
                ["Security:RateLimiting:FixedWindow:QueueLimit"] = "0",
            };
            cfg.AddInMemoryCollection(mem);
        });
    }
}
