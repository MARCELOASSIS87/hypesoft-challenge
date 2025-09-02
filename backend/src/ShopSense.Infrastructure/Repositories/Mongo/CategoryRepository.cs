using MongoDB.Bson;
using MongoDB.Driver;
using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Infrastructure.Repositories.Mongo;

/// <summary>
/// Implementação de ICategoryRepository usando MongoDB Driver.
/// Converte o Id string do domínio para ObjectId do Mongo e vice-versa.
/// </summary>
public sealed class CategoryRepository : ICategoryRepository
{
    private readonly IMongoCollection<CategoryDocument> _collection;

    public CategoryRepository(IMongoDatabase database)
    {
        // Coleção "categories" conforme modelagem
        _collection = database.GetCollection<CategoryDocument>("categories");
    }

    public async Task<Category?> GetByIdAsync(string id)
    {
        if (!ObjectId.TryParse(id, out var oid)) return null;
        var doc = await _collection.Find(x => x.Id == oid).FirstOrDefaultAsync();
        return doc?.ToDomain();
    }

    public async Task<Category?> GetBySlugAsync(string slug)
    {
        var doc = await _collection.Find(x => x.Slug == slug).FirstOrDefaultAsync();
        return doc?.ToDomain();
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        var docs = await _collection.Find(Builders<CategoryDocument>.Filter.Empty).ToListAsync();
        return docs.Select(d => d.ToDomain());
    }

    public async Task<Category> AddAsync(Category category)
    {
        var doc = CategoryDocument.FromDomain(category);
        await _collection.InsertOneAsync(doc);
        return doc.ToDomain();
    }

    public async Task UpdateAsync(Category category)
    {
        if (!ObjectId.TryParse(category.Id, out var oid))
            throw new ArgumentException("Invalid Id format for Category");

        category.UpdatedAt = DateTime.UtcNow;

        var doc = CategoryDocument.FromDomain(category) with { Id = oid };
        var result = await _collection.ReplaceOneAsync(x => x.Id == oid, doc);

        if (result.MatchedCount == 0)
            throw new KeyNotFoundException($"Category {category.Id} not found");
    }

    public async Task DeleteAsync(string id)
    {
        if (!ObjectId.TryParse(id, out var oid))
            throw new ArgumentException("Invalid Id format for Category");

        await _collection.DeleteOneAsync(x => x.Id == oid);
    }

    /// <summary>
    /// Modelo de persistência interno (ObjectId).
    /// Mantemos separado do domínio para controlar mapeamento.
    /// </summary>
    private sealed record CategoryDocument(
        ObjectId Id,
        string Name,
        string Slug,
        string? Description,
        bool IsActive,
        DateTime CreatedAt,
        DateTime UpdatedAt
    )
    {
        public Category ToDomain() => new()
        {
            Id = Id.ToString(),
            Name = Name,
            Slug = Slug,
            Description = Description,
            IsActive = IsActive,
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt
        };

        public static CategoryDocument FromDomain(Category c)
        {
            // Se vier sem Id (novo), gera ObjectId
            var oid = ObjectId.TryParse(c.Id, out var parsed) ? parsed : ObjectId.GenerateNewId();
            return new CategoryDocument(
                oid,
                c.Name,
                c.Slug,
                c.Description,
                c.IsActive,
                c.CreatedAt == default ? DateTime.UtcNow : c.CreatedAt,
                DateTime.UtcNow // UpdatedAt sempre atualizado
            );
        }
    }
}
