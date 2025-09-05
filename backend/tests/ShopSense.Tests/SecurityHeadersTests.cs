using System.Net;
using System.Threading.Tasks;
using ShopSense.Tests.TestServer;
using Xunit;

public class SecurityHeadersTests : IClassFixture<ApiFactory>
{
    private readonly ApiFactory _factory;
    public SecurityHeadersTests(ApiFactory factory) => _factory = factory;

    [Fact]
    public async Task GET_health_deve_retornar_headers_de_seguranca()
    {
        var client = _factory.CreateClient();
        var resp = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);

        Assert.True(resp.Headers.Contains("X-Content-Type-Options"));
        Assert.True(resp.Headers.Contains("X-Frame-Options"));
        Assert.True(resp.Headers.Contains("Referrer-Policy"));
        Assert.True(resp.Headers.Contains("Cross-Origin-Opener-Policy"));
        Assert.True(resp.Headers.Contains("Cross-Origin-Resource-Policy"));
        Assert.True(resp.Headers.Contains("Permissions-Policy"));
    }
}
