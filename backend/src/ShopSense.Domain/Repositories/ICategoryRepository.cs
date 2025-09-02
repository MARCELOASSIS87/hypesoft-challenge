using ShopSense.Domain.Entities;

namespace ShopSense.Domain.Repositories;

/// <summary>
/// Contrato para persistência e recuperação de categorias.
/// </summary>
public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(string id);
    Task<Category?> GetBySlugAsync(string slug);
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category> AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(string id);
}
