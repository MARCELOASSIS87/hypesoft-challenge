using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Api;

/// <summary>
/// Endpoints para controle de estoque (movimentos).
/// </summary>
public static class InventoryEndpoints
{
    public static void MapInventory(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/inventory").WithTags("Inventory");

        // GET /inventory/{productId}
        group.MapGet("/{productId}", async (string productId, IInventoryMovementRepository repo) =>
        {
            var items = await repo.GetByProductAsync(productId);
            return Results.Ok(items);
        })
        .WithName("GetInventoryByProduct")
        .Produces<IEnumerable<InventoryMovement>>(StatusCodes.Status200OK);

        // POST /inventory
        group.MapPost("/", async (InventoryMovement input, IInventoryMovementRepository repo) =>
        {
            if (string.IsNullOrWhiteSpace(input.ProductId) || input.Quantity <= 0 || string.IsNullOrWhiteSpace(input.Type))
                return Results.BadRequest("ProductId, Type e Quantity > 0 são obrigatórios");

            var created = await repo.AddAsync(input);
            return Results.Created($"/inventory/{created.Id}", created);
        })
        .WithName("CreateInventoryMovement")
        .Produces<InventoryMovement>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest);
    }
}
