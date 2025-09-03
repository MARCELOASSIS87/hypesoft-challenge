using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Domain.Services;

/// <summary>
/// Regras de domínio para movimentação de estoque.
/// OBS: Só registra a regra aqui; integração com repositórios é feita na camada superior.
/// </summary>
public sealed class InventoryService
{
    /// <summary>
    /// Aplica a regra de estoque em memória e retorna o novo valor.
    /// - type = "in"  -> soma
    /// - type = "out" -> subtrai (não pode ficar negativo)
    /// - type = "adjustment" -> soma/subtrai livremente (pode ficar zero, não negativo se preferir)
    /// </summary>
    public int ApplyStockChange(Product product, string type, int quantity)
    {
        if (product is null) throw new ArgumentNullException(nameof(product));
        if (string.IsNullOrWhiteSpace(type)) throw new ArgumentException("type is required", nameof(type));

        var current = product.StockQuantity;
        var typeNorm = type.ToLowerInvariant();

        switch (typeNorm)
        {
            case "in":
                if (quantity <= 0)
                    throw new ArgumentOutOfRangeException(nameof(quantity), "quantity must be > 0 for 'in'");
                return checked(current + quantity);

            case "out":
                if (quantity <= 0)
                    throw new ArgumentOutOfRangeException(nameof(quantity), "quantity must be > 0 for 'out'");
                if (current - quantity < 0)
                    throw new InvalidOperationException("Insufficient stock for 'out' movement.");
                return current - quantity;

            case "adjustment":
                if (quantity == 0)
                    throw new ArgumentOutOfRangeException(nameof(quantity), "quantity must be != 0 for 'adjustment'");
                var adjusted = current + quantity; // quantity pode ser negativo
                if (adjusted < 0)
                    throw new InvalidOperationException("Adjustment would result in negative stock.");
                return adjusted;

            default:
                throw new ArgumentException("Invalid movement type. Use 'in' | 'out' | 'adjustment'.", nameof(type));
        }
    }
}
