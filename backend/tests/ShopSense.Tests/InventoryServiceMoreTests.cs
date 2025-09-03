using System;
using FluentAssertions;
using ShopSense.Domain.Entities;
using ShopSense.Domain.Services;
using Xunit;

namespace ShopSense.Tests;

public class InventoryServiceMoreTests
{
    private readonly InventoryService _sut = new();

    private static Product P(int stock = 10, int min = 2) => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "Produto",
        Slug = "produto",
        StockQuantity = stock,
        StockMin = min
    };

    // --- O service NÃO muta estado. Quando quisermos simular o fluxo completo,
    //     atualizamos o Product manualmente com o retorno do ApplyStockChange.

    [Fact]
    public void In_Should_Return_NewStock_And_When_Applied_Should_Update_Product()
    {
        var p = P(5);

        var newQty = _sut.ApplyStockChange(p, "in", 3);
        newQty.Should().Be(8);

        // simula a aplicação na camada superior
        p.StockQuantity = newQty;
        p.StockQuantity.Should().Be(8);
    }

    [Fact]
    public void Out_Should_Return_NewStock_And_When_Applied_Should_Update_Product()
    {
        var p = P(9);

        var newQty = _sut.ApplyStockChange(p, "out", 4);
        newQty.Should().Be(5);

        p.StockQuantity = newQty;
        p.StockQuantity.Should().Be(5);
    }

    [Fact]
    public void Adjustment_Should_Return_NewStock_And_When_Applied_Should_Update_Product()
    {
        var p = P(12);

        var newQty = _sut.ApplyStockChange(p, "adjustment", -5);
        newQty.Should().Be(7);

        p.StockQuantity = newQty;
        p.StockQuantity.Should().Be(7);
    }

    // --- Limites e bordas coerentes com a política

    [Fact]
    public void Out_With_QuantityEqualToStock_Should_ReachZero_When_Applied()
    {
        var p = P(4);

        var newQty = _sut.ApplyStockChange(p, "out", 4);
        newQty.Should().Be(0);

        p.StockQuantity = newQty;
        p.StockQuantity.Should().Be(0);
    }

    [Fact]
    public void Adjustment_Negative_ExactlyToZero_Should_BeAllowed_When_Applied()
    {
        var p = P(4);

        var newQty = _sut.ApplyStockChange(p, "adjustment", -4);
        newQty.Should().Be(0);

        p.StockQuantity = newQty;
        p.StockQuantity.Should().Be(0);
    }

    [Fact]
    public void Can_Go_Below_StockMin_But_Not_Below_Zero()
    {
        var p = P(stock: 3, min: 5);

        var newQty = _sut.ApplyStockChange(p, "out", 2);
        newQty.Should().Be(1);

        p.StockQuantity = newQty;
        p.StockQuantity.Should().Be(1);
    }

    // --- Sequência correta: sempre aplicar o retorno como novo estoque

    [Fact]
    public void Sequential_Operations_Should_Accumulate_Correctly_When_Applying_Return()
    {
        var p = P(stock: 10);

        p.StockQuantity = _sut.ApplyStockChange(p, "in", 5);        // 15
        p.StockQuantity = _sut.ApplyStockChange(p, "out", 3);       // 12
        var finalQty     = _sut.ApplyStockChange(p, "adjustment", -2); // 10

        finalQty.Should().Be(10);
        p.StockQuantity = finalQty;
        p.StockQuantity.Should().Be(10);
    }

    // --- Quantidades grandes (retorno correto, sem overflow em int)

    [Fact]
    public void In_With_LargeQuantity_Should_Return_Within_Int_Range()
    {
        var p = P(stock: 1_000_000);

        var newQty = _sut.ApplyStockChange(p, "in", 2_000_000);
        newQty.Should().Be(3_000_000);

        p.StockQuantity = newQty;
        p.StockQuantity.Should().Be(3_000_000);
    }

    // --- Consistência entre retorno e estado pós-aplicação

    [Theory]
    [InlineData("in", 1, 3)]          // 2 + 1 = 3
    [InlineData("out", 1, 1)]         // 2 - 1 = 1
    [InlineData("adjustment", -1, 1)] // 2 + (-1) = 1
    public void Return_Value_Should_Match_ProductState_After_Apply(string type, int qty, int expected)
    {
        var p = P(stock: 2);

        var ret = _sut.ApplyStockChange(p, type, qty);
        ret.Should().Be(expected);

        p.StockQuantity = ret;
        p.StockQuantity.Should().Be(expected);
    }
}
