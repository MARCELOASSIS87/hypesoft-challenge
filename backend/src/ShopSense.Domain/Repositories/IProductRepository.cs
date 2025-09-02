using ShopSense.Domain.Entities;

namespace ShopSense.Domain.Repositories;

/// <summary>
/// Contrato para persistência e recuperação de produtos.
/// </summary>
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(string id);
    Task<Product?> GetBySlugAsync(string slug);
    Task<IEnumerable<Product>> GetAllAsync(int page = 1, int pageSize = 20);
    Task<IEnumerable<Product>> GetByCategoryAsync(string categoryId);
    Task<Product> AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(string id);
}
