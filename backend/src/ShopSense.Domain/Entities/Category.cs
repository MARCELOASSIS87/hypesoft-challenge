namespace ShopSense.Domain.Entities;

/// <summary>
/// Representa uma categoria de produtos.
/// As categorias permitem agrupar produtos e facilitar filtros e relatórios.
/// </summary>
public sealed class Category
{
    /// <summary>
    /// Identificador único da categoria (ObjectId no Mongo, armazenado como string no domínio).
    /// </summary>
    public string Id { get; set; } = default!;

    /// <summary>
    /// Nome da categoria (ex.: "Bebidas", "Laticínios").
    /// </summary>
    public string Name { get; set; } = default!;

    /// <summary>
    /// Slug amigável para URLs (ex.: "bebidas").
    /// </summary>
    public string Slug { get; set; } = default!;

    /// <summary>
    /// Descrição opcional da categoria.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Indica se a categoria está ativa.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Data de criação do registro.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização do registro.
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
