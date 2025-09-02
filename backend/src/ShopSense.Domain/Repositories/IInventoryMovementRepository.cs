using ShopSense.Domain.Entities;

namespace ShopSense.Domain.Repositories;

/// <summary>
/// Contrato para persistência e recuperação de movimentações de estoque.
/// </summary>
public interface IInventoryMovementRepository
{
    Task<InventoryMovement?> GetByIdAsync(string id);
    Task<IEnumerable<InventoryMovement>> GetByProductAsync(string productId);
    Task<InventoryMovement> AddAsync(InventoryMovement movement);
}
