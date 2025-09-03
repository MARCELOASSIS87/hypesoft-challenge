using Microsoft.AspNetCore.Mvc;
using ShopSense.Api.DTOs;
using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;
using ShopSense.Domain.Services;

namespace ShopSense.Api;

/// <summary>
/// Endpoints para controle de estoque (movimentos).
/// - POST /inventory: registra movimento (in|out|adjustment) e atualiza o estoque do produto
/// - GET  /inventory/{productId}: lista movimentos de um produto
/// </summary>
public static class InventoryEndpoints
{
    public static void MapInventory(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/inventory").WithTags("Inventory");

        // GET /inventory/{productId} -> Lista movimentos (mais recentes primeiro)
        group.MapGet("/{productId}", async (string productId, IInventoryMovementRepository repo) =>
        {
            var items = await repo.GetByProductAsync(productId);
            return Results.Ok(items);
        })
        .WithName("GetInventoryByProduct")
        .Produces<IEnumerable<InventoryMovement>>(StatusCodes.Status200OK);

        // POST /inventory -> Cria movimento e atualiza estoque do produto
        group.MapPost("/", async (
            InventoryCreateRequest input,
            IProductRepository products,
            IInventoryMovementRepository movements,
            [FromServices] InventoryService inventory // <= vem do DI explicitamente
        ) =>
        {
            // Validação básica do payload
            if (input is null)
                return Results.BadRequest("Body is required");

            if (string.IsNullOrWhiteSpace(input.ProductId) ||
                string.IsNullOrWhiteSpace(input.Type))
            {
                return Results.BadRequest("ProductId, Type e Quantity (> 0) são obrigatórios");
            }
            // Regras de quantidade:
            // - in/out: quantity > 0
            // - adjustment: quantity != 0 (pode ser negativo)
            var typeNorm = input.Type.ToLowerInvariant();
            var qty = input.Quantity;

            if (typeNorm is "in" or "out")
            {
                if (qty <= 0)
                    return Results.BadRequest("Para movimentos 'in' e 'out', quantity deve ser > 0");
            }
            else if (typeNorm is "adjustment")
            {
                if (qty == 0)
                    return Results.BadRequest("Para 'adjustment', quantity não pode ser 0 (pode ser positivo ou negativo)");
            }
            else
            {
                return Results.BadRequest("Type inválido. Use 'in' | 'out' | 'adjustment'.");
            }
            // Carrega o produto
            var product = await products.GetByIdAsync(input.ProductId);
            if (product is null)
                return Results.NotFound($"Product {input.ProductId} not found");

            // Aplica regra de estoque
            try
            {
                product.StockQuantity = inventory.ApplyStockChange(product, input.Type, input.Quantity);
                product.UpdatedAt = DateTime.UtcNow;
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new { error = ex.Message });
            }

            // Persiste o movimento (histórico) e atualiza o produto
            var movement = new InventoryMovement
            {
                ProductId = input.ProductId,
                Type = input.Type,
                Quantity = input.Quantity,
                Reason = input.Reason,
                Ref = input.Ref,
                OccurredAt = input.OccurredAt == default ? DateTime.UtcNow : input.OccurredAt,
                CreatedAt = DateTime.UtcNow
            };

            await movements.AddAsync(movement);
            await products.UpdateAsync(product);

            return Results.Created($"/inventory/{movement.Id}", new
            {
                movement,
                productId = product.Id,
                stockQuantity = product.StockQuantity
            });
        })
        .WithName("CreateInventoryMovement")
        .Produces(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status409Conflict);
    }
}
