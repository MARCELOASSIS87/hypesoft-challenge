using MongoDB.Bson;
using MongoDB.Driver;
using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Infrastructure.Repositories.Mongo;

/// <summary>
/// Implementação de IInventoryMovementRepository usando MongoDB Driver.
/// Responsável por registrar e consultar movimentos de estoque de um produto.
/// </summary>
public sealed class InventoryMovementRepository : IInventoryMovementRepository
{
    private readonly IMongoCollection<InventoryMovementDocument> _collection;

    public InventoryMovementRepository(IMongoDatabase database)
    {
        // Coleção "inventory_movements" conforme modelagem do banco
        _collection = database.GetCollection<InventoryMovementDocument>("inventory_movements");
    }

    /// <summary>
    /// Busca movimento por Id.
    /// </summary>
    public async Task<InventoryMovement?> GetByIdAsync(string id)
    {
        if (!ObjectId.TryParse(id, out var oid)) return null;
        var doc = await _collection.Find(x => x.Id == oid).FirstOrDefaultAsync();
        return doc?.ToDomain();
    }

    /// <summary>
    /// Lista movimentos de um produto, mais recentes primeiro.
    /// </summary>
    public async Task<IEnumerable<InventoryMovement>> GetByProductAsync(string productId)
    {
        if (!ObjectId.TryParse(productId, out var pid)) return Enumerable.Empty<InventoryMovement>();

        var docs = await _collection
            .Find(x => x.ProductId == pid)
            .SortByDescending(x => x.OccurredAt)
            .ToListAsync();

        return docs.Select(d => d.ToDomain());
    }

    /// <summary>
    /// Registra um movimento (in/out/adjustment).
    /// </summary>
    public async Task<InventoryMovement> AddAsync(InventoryMovement movement)
    {
        var doc = InventoryMovementDocument.FromDomain(movement);
        await _collection.InsertOneAsync(doc);
        return doc.ToDomain();
    }

    /// <summary>
    /// Documento de persistência (ObjectId).
    /// Mantemos separado do domínio para controlar o mapeamento.
    /// </summary>
    private sealed record InventoryMovementDocument(
        ObjectId Id,
        ObjectId ProductId,
        string Type,      // "in" | "out" | "adjustment"
        int Quantity,     // > 0
        string? Reason,
        string? Ref,
        DateTime OccurredAt,
        DateTime CreatedAt
    )
    {
        public InventoryMovement ToDomain() => new()
        {
            Id = Id.ToString(),
            ProductId = ProductId.ToString(),
            Type = Type,
            Quantity = Quantity,
            Reason = Reason,
            Ref = Ref,
            OccurredAt = OccurredAt,
            CreatedAt = CreatedAt
        };

        public static InventoryMovementDocument FromDomain(InventoryMovement m)
        {
            var oid = ObjectId.TryParse(m.Id, out var parsed) ? parsed : ObjectId.GenerateNewId();
            var pid = ObjectId.TryParse(m.ProductId, out var parsedProd) ? parsedProd : ObjectId.Empty;

            return new InventoryMovementDocument(
                oid,
                pid,
                m.Type,
                m.Quantity,
                m.Reason,
                m.Ref,
                m.OccurredAt == default ? DateTime.UtcNow : m.OccurredAt,
                m.CreatedAt == default ? DateTime.UtcNow : m.CreatedAt
            );
        }
    }
}
