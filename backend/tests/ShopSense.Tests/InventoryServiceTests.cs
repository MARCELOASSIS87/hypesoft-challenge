using System;
using FluentAssertions;
using ShopSense.Domain.Entities;
using ShopSense.Domain.Services;
using Xunit;

namespace ShopSense.Tests;

/// <summary>
/// Testes unitários para as regras de estoque do InventoryService.
/// </summary>
public class InventoryServiceTests
{
    private readonly InventoryService _sut = new();

    private static Product NewProduct(int stock = 10) =>
        new Product
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Produto Teste",
            Slug = "produto-teste",
            StockQuantity = stock,
            StockMin = 2
        };

    // -------------------------------
    // CENÁRIOS "in"
    // -------------------------------

    [Fact]
    public void In_Should_IncreaseStock_When_QuantityIsPositive()
    {
        var product = NewProduct(stock: 5);

        var result = _sut.ApplyStockChange(product, "in", 3);

        result.Should().Be(8);
    }

    [Fact]
    public void In_ShouldThrow_When_QuantityIsZeroOrNegative()
    {
        var product = NewProduct();

        Action act1 = () => _sut.ApplyStockChange(product, "in", 0);
        Action act2 = () => _sut.ApplyStockChange(product, "in", -5);

        act1.Should().Throw<ArgumentOutOfRangeException>();
        act2.Should().Throw<ArgumentOutOfRangeException>();
    }

    // -------------------------------
    // CENÁRIOS "out"
    // -------------------------------

    [Fact]
    public void Out_Should_DecreaseStock_When_EnoughStock()
    {
        var product = NewProduct(stock: 10);

        var result = _sut.ApplyStockChange(product, "out", 4);

        result.Should().Be(6);
    }

    [Fact]
    public void Out_ShouldThrow_When_QuantityIsZeroOrNegative()
    {
        var product = NewProduct();

        Action act1 = () => _sut.ApplyStockChange(product, "out", 0);
        Action act2 = () => _sut.ApplyStockChange(product, "out", -3);

        act1.Should().Throw<ArgumentOutOfRangeException>();
        act2.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Out_ShouldThrow_When_StockWouldGoNegative()
    {
        var product = NewProduct(stock: 2);

        Action act = () => _sut.ApplyStockChange(product, "out", 5);

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*Insufficient stock*");
    }

    // -------------------------------
    // CENÁRIOS "adjustment"
    // -------------------------------

    [Fact]
    public void Adjustment_Should_IncreaseStock_When_QuantityPositive()
    {
        var product = NewProduct(stock: 5);

        var result = _sut.ApplyStockChange(product, "adjustment", 3);

        result.Should().Be(8);
    }

    [Fact]
    public void Adjustment_Should_DecreaseStock_When_QuantityNegativeButNotBelowZero()
    {
        var product = NewProduct(stock: 5);

        var result = _sut.ApplyStockChange(product, "adjustment", -2);

        result.Should().Be(3);
    }

    [Fact]
    public void Adjustment_ShouldThrow_When_QuantityIsZero()
    {
        var product = NewProduct(stock: 5);

        Action act = () => _sut.ApplyStockChange(product, "adjustment", 0);

        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Adjustment_ShouldThrow_When_ResultWouldBeNegative()
    {
        var product = NewProduct(stock: 1);

        Action act = () => _sut.ApplyStockChange(product, "adjustment", -5);

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*negative stock*");
    }

    // -------------------------------
    // CENÁRIOS GERAIS
    // -------------------------------

    [Fact]
    public void ShouldThrow_When_ProductIsNull()
    {
        Action act = () => _sut.ApplyStockChange(null!, "in", 1);

        act.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void ShouldThrow_When_TypeIsNullOrWhitespace()
    {
        var product = NewProduct();

        Action act1 = () => _sut.ApplyStockChange(product, null!, 1);
        Action act2 = () => _sut.ApplyStockChange(product, " ", 1);

        act1.Should().Throw<ArgumentException>().WithMessage("*type*");
        act2.Should().Throw<ArgumentException>().WithMessage("*type*");
    }

    [Fact]
    public void ShouldThrow_When_TypeIsInvalid()
    {
        var product = NewProduct();

        Action act = () => _sut.ApplyStockChange(product, "invalid", 1);

        act.Should().Throw<ArgumentException>()
            .WithMessage("*Invalid movement type*");
    }
}
