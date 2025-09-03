using Xunit;
using FluentAssertions;

namespace ShopSense.Tests;

/// <summary>
/// Smoke tests: garantem que a suíte de testes roda e o projeto está referenciado corretamente.
/// Os testes específicos do InventoryService entram no próximo passo.
/// </summary>
public class Inventory_SmokeTests
{
    [Fact]
    public void Test_Suite_Should_Run()
    {
        true.Should().BeTrue("o pipeline de testes precisa estar operacional antes dos testes de regra de negócio");
    }
}
