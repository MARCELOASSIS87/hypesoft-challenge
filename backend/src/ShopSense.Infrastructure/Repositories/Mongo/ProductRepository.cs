using MongoDB.Bson;
using MongoDB.Driver;
using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Infrastructure.Repositories.Mongo;

/// <summary>
/// Implementação de IProductRepository usando MongoDB Driver.
/// Responsável por mapear o domínio (Product com Id string)
/// para o documento de persistência (ProductDocument com ObjectId),
/// além de executar consultas com paginação e filtros por categoria.
/// </summary>
public sealed class ProductRepository : IProductRepository
{
    private readonly IMongoCollection<ProductDocument> _collection;

    public ProductRepository(IMongoDatabase database)
    {
        // Coleção "products" conforme modelagem do banco
        _collection = database.GetCollection<ProductDocument>("products");

        // Opcional: garantir índices críticos em tempo de execução.
        // (No seu ambiente já criamos via mongosh; manter por segurança em dev.)
        // _collection.Indexes.CreateMany(new[]
        // {
        //     new CreateIndexModel<ProductDocument>(Builders<ProductDocument>.IndexKeys.Ascending(x => x.Slug),
        //         new CreateIndexOptions { Unique = true, Name = "ux_products_slug" }),
        //     new CreateIndexModel<ProductDocument>(Builders<ProductDocument>.IndexKeys.Ascending(x => x.CategoryId),
        //         new CreateIndexOptions { Name = "ix_products_categoryId" })
        // });
    }

    /// <summary>
    /// Busca produto por Id (string no domínio convertido para ObjectId).
    /// </summary>
    public async Task<Product?> GetByIdAsync(string id)
    {
        if (!ObjectId.TryParse(id, out var oid)) return null;
        var doc = await _collection.Find(x => x.Id == oid).FirstOrDefaultAsync();
        return doc?.ToDomain();
    }

    /// <summary>
    /// Busca produto por slug (único).
    /// </summary>
    public async Task<Product?> GetBySlugAsync(string slug)
    {
        var doc = await _collection.Find(x => x.Slug == slug).FirstOrDefaultAsync();
        return doc?.ToDomain();
    }

    /// <summary>
    /// Lista paginada de produtos.
    /// Observações:
    /// - page inicia em 1
    /// - ordena por CreatedAt desc para resultados consistentes
    /// - em listas grandes, projetar só campos necessários (aqui retornamos o documento completo)
    /// </summary>
    public async Task<IEnumerable<Product>> GetAllAsync(int page = 1, int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;

        var skip = (page - 1) * pageSize;

        var docs = await _collection
            .Find(Builders<ProductDocument>.Filter.Empty)
            .SortByDescending(x => x.CreatedAt)
            .Skip(skip)
            .Limit(pageSize)
            .ToListAsync();

        return docs.Select(d => d.ToDomain());
    }

    /// <summary>
    /// Lista produtos por categoria (sem paginação aqui; pode ser estendida).
    /// </summary>
    public async Task<IEnumerable<Product>> GetByCategoryAsync(string categoryId)
    {
        if (!ObjectId.TryParse(categoryId, out var catOid)) return Enumerable.Empty<Product>();

        var docs = await _collection
            .Find(x => x.CategoryId == catOid)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();

        return docs.Select(d => d.ToDomain());
    }

    /// <summary>
    /// Insere um novo produto. Se Id não vier, gera um ObjectId.
    /// Atualiza automaticamente CreatedAt/UpdatedAt.
    /// </summary>
    public async Task<Product> AddAsync(Product product)
    {
        var doc = ProductDocument.FromDomain(product);
        await _collection.InsertOneAsync(doc);
        return doc.ToDomain();
    }

    /// <summary>
    /// Atualiza um produto existente por Id.
    /// </summary>
    public async Task UpdateAsync(Product product)
    {
        if (!ObjectId.TryParse(product.Id, out var oid))
            throw new ArgumentException("Invalid Id format for Product");

        // Garante carimbo de atualização
        product.UpdatedAt = DateTime.UtcNow;

        var doc = ProductDocument.FromDomain(product) with { Id = oid };
        var result = await _collection.ReplaceOneAsync(x => x.Id == oid, doc);

        if (result.MatchedCount == 0)
            throw new KeyNotFoundException($"Product {product.Id} not found");
    }

    /// <summary>
    /// Remove produto pelo Id.
    /// </summary>
    public async Task DeleteAsync(string id)
    {
        if (!ObjectId.TryParse(id, out var oid))
            throw new ArgumentException("Invalid Id format for Product");

        await _collection.DeleteOneAsync(x => x.Id == oid);
    }

    /// <summary>
    /// Documento de persistência (formato salvo no MongoDB).
    /// Mantido separado do domínio para controle explícito do mapeamento.
    /// </summary>
    private sealed record ProductDocument(
        ObjectId Id,
        string Name,
        string Slug,
        string? Description,
        decimal Price,          // decimal em C# -> Decimal128 no Mongo
        string? Sku,
        string? Barcode,
        ObjectId CategoryId,
        List<string> Images,
        int StockQuantity,
        int StockMin,
        string Status,
        DateTime CreatedAt,
        DateTime UpdatedAt
    )
    {
        /// <summary>
        /// Converte o documento de banco para a entidade de domínio.
        /// </summary>
        public Product ToDomain() => new()
        {
            Id = Id.ToString(),
            Name = Name,
            Slug = Slug,
            Description = Description,
            Price = Price,
            Sku = Sku,
            Barcode = Barcode,
            CategoryId = CategoryId.ToString(),
            Images = Images ?? new(),
            StockQuantity = StockQuantity,
            StockMin = StockMin,
            Status = Status,
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt
        };

        /// <summary>
        /// Converte a entidade de domínio para documento persistível.
        /// - Gera ObjectId se Id não vier preenchido
        /// - Atualiza timestamps
        /// </summary>
        public static ProductDocument FromDomain(Product p)
        {
            var oid = ObjectId.TryParse(p.Id, out var parsed) ? parsed : ObjectId.GenerateNewId();
            var catOid = ObjectId.TryParse(p.CategoryId, out var parsedCat) ? parsedCat : ObjectId.Empty;

            return new ProductDocument(
                oid,
                p.Name,
                p.Slug,
                p.Description,
                p.Price,
                p.Sku,
                p.Barcode,
                catOid,
                p.Images ?? new(),
                p.StockQuantity,
                p.StockMin,
                string.IsNullOrWhiteSpace(p.Status) ? "active" : p.Status,
                p.CreatedAt == default ? DateTime.UtcNow : p.CreatedAt,
                DateTime.UtcNow
            );
        }
    }
}
