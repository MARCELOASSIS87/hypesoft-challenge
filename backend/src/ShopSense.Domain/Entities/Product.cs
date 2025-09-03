namespace ShopSense.Domain.Entities;

/// <summary>
/// Representa um produto da loja.
/// Um produto pertence a uma categoria e possui informações de estoque.
/// </summary>
public sealed class Product
{
    /// <summary>
    /// Identificador único do produto (ObjectId no Mongo, armazenado como string no domínio).
    /// </summary>
    public string Id { get; set; } = default!;

    /// <summary>
    /// Nome do produto (ex.: "Cachaça Premium").
    /// </summary>
    public string Name { get; set; } = default!;

    /// <summary>
    /// Slug amigável para URLs (ex.: "cachaca-premium").
    /// </summary>
    public string Slug { get; set; } = default!;

    /// <summary>
    /// Descrição detalhada do produto.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Preço do produto (Decimal128 no Mongo, decimal aqui).
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// SKU opcional para identificação interna.
    /// </summary>
    public string? Sku { get; set; }

    /// <summary>
    /// Código de barras opcional.
    /// </summary>
    public string? Barcode { get; set; }

    /// <summary>
    /// Id da categoria à qual o produto pertence.
    /// </summary>
    public string CategoryId { get; set; } = default!;

    /// <summary>
    /// URLs de imagens do produto.
    /// </summary>
    public List<string> Images { get; set; } = new();

    /// <summary>
    /// Quantidade em estoque.
    /// </summary>
    public int StockQuantity { get; set; }

    /// <summary>
    /// Estoque mínimo recomendado.
    /// </summary>
    public int StockMin { get; set; }

    /// <summary>
    /// Status do produto (active, inactive, draft).
    /// </summary>
    public string Status { get; set; } = "active";

    /// <summary>
    /// Data de criação do registro.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização do registro.
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
