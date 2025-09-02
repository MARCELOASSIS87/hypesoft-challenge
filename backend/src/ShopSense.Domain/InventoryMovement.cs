namespace ShopSense.Domain.Entities;

/// <summary>
/// Representa um movimento de estoque de um produto.
/// Cada movimento indica uma entrada, saída ou ajuste.
/// </summary>
public sealed class InventoryMovement
{
    /// <summary>
    /// Identificador único do movimento (ObjectId no Mongo, armazenado como string no domínio).
    /// </summary>
    public string Id { get; set; } = default!;

    /// <summary>
    /// Identificador do produto relacionado.
    /// </summary>
    public string ProductId { get; set; } = default!;

    /// <summary>
    /// Tipo do movimento: in (entrada), out (saída), adjustment (ajuste).
    /// </summary>
    public string Type { get; set; } = default!;

    /// <summary>
    /// Quantidade movimentada (> 0).
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// Motivo ou observação opcional do movimento.
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// Referência externa opcional (ex.: número de pedido).
    /// </summary>
    public string? Ref { get; set; }

    /// <summary>
    /// Data em que o movimento ocorreu.
    /// </summary>
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data de criação do registro.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
