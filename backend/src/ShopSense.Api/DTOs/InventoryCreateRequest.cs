namespace ShopSense.Api.DTOs;

/// <summary>
/// Payload para criação de movimento de estoque.
/// </summary>
public sealed class InventoryCreateRequest
{
    public string ProductId { get; set; } = default!;
    /// <summary>
    /// Tipo do movimento: "in" | "out" | "adjustment".
    /// - in/out: quantity > 0
    /// - adjustment: quantity pode ser positivo ou negativo (≠ 0)
    /// </summary>    
    public string Type { get; set; } = default!;
    /// /// <summary>
    /// Quantidade do movimento:
    /// - in/out: > 0
    /// - adjustment: ≠ 0 (positivo aumenta, negativo reduz)
    /// </summary>
    public int Quantity { get; set; }
    public string? Reason { get; set; }
    /// <summary>Referência externa opcional (ex.: pedido).</summary>
    public string? Ref { get; set; }
    /// <summary>Data do ocorrido; se não vier, a API usa DateTime.UtcNow.</summary>
    public DateTime OccurredAt { get; set; }
}
