using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Api;

/// <summary>
/// Endpoints auxiliares de produtos (ex.: baixo estoque).
/// </summary>
public static class ProductsLowStockEndpoints
{
    public static void MapProductsLowStock(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products").WithTags("Products");

        // GET /products/low-stock?page=&pageSize=
        group.MapGet("/low-stock", async (IProductRepository repo, int page = 1, int pageSize = 20) =>
        {
            // Reaproveitando GetAll e filtrando em memória seria ruim.
            // Aqui, por simplicidade, chamamos GetAll e filtramos;
            // No Dia 2, movemos esse filtro para o repositório com um índice adequado.
            var items = await repo.GetAllAsync(page, pageSize);
            var low = items.Where(p => p.StockQuantity < p.StockMin);
            return Results.Ok(low);
        })
        .WithName("GetProductsLowStock")
        .Produces<IEnumerable<Product>>(StatusCodes.Status200OK);
    }
}
