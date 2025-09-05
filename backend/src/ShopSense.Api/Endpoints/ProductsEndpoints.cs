using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Api;

/// <summary>
/// Endpoints para gestão de produtos.
/// </summary>
public static class ProductsEndpoints
{
    public static void MapProducts(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products").WithTags("Products").RequireRateLimiting("fixed");;

        // GET /products?categoryId=&page=&pageSize=
        group.MapGet("/", async (IProductRepository repo, string? categoryId, int page = 1, int pageSize = 20) =>
        {
            if (!string.IsNullOrWhiteSpace(categoryId))
            {
                var byCat = await repo.GetByCategoryAsync(categoryId);
                return Results.Ok(byCat);
            }

            var items = await repo.GetAllAsync(page, pageSize);
            return Results.Ok(items);
        })
        .WithName("GetProducts")
        .Produces<IEnumerable<Product>>(StatusCodes.Status200OK);

        // GET /products/{id}
        group.MapGet("/{id}", async (string id, IProductRepository repo) =>
        {
            var product = await repo.GetByIdAsync(id);
            return product is not null ? Results.Ok(product) : Results.NotFound();
        })
        .WithName("GetProductById")
        .Produces<Product>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // POST /products
        group.MapPost("/", async (Product input, IProductRepository repo) =>
        {
            if (string.IsNullOrWhiteSpace(input.Name) || string.IsNullOrWhiteSpace(input.Slug) || string.IsNullOrWhiteSpace(input.CategoryId))
                return Results.BadRequest("Name, Slug e CategoryId são obrigatórios");

            var created = await repo.AddAsync(input);
            return Results.Created($"/products/{created.Id}", created);
        })
        .WithName("CreateProduct")
        .Produces<Product>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest);

        // PUT /products/{id}
        group.MapPut("/{id}", async (string id, Product input, IProductRepository repo) =>
        {
            input.Id = id;
            try
            {
                await repo.UpdateAsync(input);
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .WithName("UpdateProduct")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest);

        // DELETE /products/{id}
        group.MapDelete("/{id}", async (string id, IProductRepository repo) =>
        {
            await repo.DeleteAsync(id);
            return Results.NoContent();
        })
        .WithName("DeleteProduct")
        .Produces(StatusCodes.Status204NoContent);
    }
}
