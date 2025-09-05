// tests/ShopSense.Tests/RateLimitingTests.cs
using System.Linq;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using ShopSense.Tests.TestServer;
using Xunit;

public class RateLimitingTests : IClassFixture<ApiFactory>
{
    private readonly ApiFactory _factory;
    public RateLimitingTests(ApiFactory factory) => _factory = factory;

    [Fact]
    public void RLTest_endpoint_deve_existir_e_ter_policy_fixed_aplicada()
    {
        // 1) Pega todas as rotas mapeadas
        var sources = _factory.Services.GetServices<EndpointDataSource>();
        var allEndpoints = sources.SelectMany(s => s.Endpoints).OfType<RouteEndpoint>().ToList();

        // 2) Garante que /_rl-test existe
        var rlTest = allEndpoints.FirstOrDefault(e => e.RoutePattern.RawText == "/_rl-test");
        Assert.NotNull(rlTest);

        // 3) Verifica a metadata sem depender de tipos específicos (reflection)
        var meta = rlTest!.Metadata.FirstOrDefault(m => m.GetType().Name == "EnableRateLimitingAttribute");
        Assert.NotNull(meta);

        // Lê a propriedade PolicyName via reflection
        var policyProp = meta!.GetType().GetProperty("PolicyName");
        Assert.NotNull(policyProp);

        var policy = policyProp!.GetValue(meta) as string;
        Assert.Equal("fixed", policy);
    }
}
