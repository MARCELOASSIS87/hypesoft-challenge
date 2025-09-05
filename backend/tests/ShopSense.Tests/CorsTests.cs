using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ShopSense.Tests.TestServer;
using Xunit;

public class CorsTests : IClassFixture<ApiFactory>
{
    private readonly ApiFactory _factory;
    public CorsTests(ApiFactory factory) => _factory = factory;

    [Fact]
    public async Task OPTIONS_products_deve_permitir_origem_configurada()
    {
        var client = _factory.CreateClient();

        var req = new HttpRequestMessage(HttpMethod.Options, "/products");
        req.Headers.Add("Origin", "http://localhost:5173");
        req.Headers.Add("Access-Control-Request-Method", "GET");

        var resp = await client.SendAsync(req);

        // Preflight costuma responder 204 NoContent
        Assert.Equal(HttpStatusCode.NoContent, resp.StatusCode);
        Assert.True(resp.Headers.TryGetValues("Access-Control-Allow-Origin", out var allow));
        Assert.Contains("http://localhost:5173", allow);
    }
}
