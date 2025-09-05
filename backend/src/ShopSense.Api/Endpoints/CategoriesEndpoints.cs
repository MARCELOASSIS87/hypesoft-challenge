using ShopSense.Domain.Entities;
using ShopSense.Domain.Repositories;

namespace ShopSense.Api;

/// <summary>
/// Endpoints para gestão de categorias.
/// </summary>
public static class CategoriesEndpoints
{
    public static void MapCategories(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/categories").WithTags("Categories");

        // GET /categories
        group.MapGet("/", async (ICategoryRepository repo) =>
        {
            var categories = await repo.GetAllAsync();
            return Results.Ok(categories);
        })
        .WithName("GetCategories")
        .Produces<IEnumerable<Category>>(StatusCodes.Status200OK);

        // GET /categories/{id}
        group.MapGet("/{id}", async (string id, ICategoryRepository repo) =>
        {
            var category = await repo.GetByIdAsync(id);
            return category is not null ? Results.Ok(category) : Results.NotFound();
        })
        .WithName("GetCategoryById")
        .Produces<Category>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // POST /categories
        group.MapPost("/", async (Category input, ICategoryRepository repo, ShopSense.Api.Services.ICacheVersionProvider versions) =>
        {
            if (string.IsNullOrWhiteSpace(input.Name) || string.IsNullOrWhiteSpace(input.Slug))
                return Results.BadRequest("Name and Slug are required");
        
            var created = await repo.AddAsync(input);
            versions.Bump("/categories");
            return Results.Created($"/categories/{created.Id}", created);
        })

        .WithName("CreateCategory")
        .Produces<Category>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest);

        // PUT /categories/{id}
        group.MapPut("/{id}", async (string id, Category input, ICategoryRepository repo, ShopSense.Api.Services.ICacheVersionProvider versions) =>
        {
            input.Id = id;
            try
            {
                await repo.UpdateAsync(input);
                versions.Bump("/categories");
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
                    {
                return Results.NotFound();
            }
        })

        .WithName("UpdateCategory")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);

        // DELETE /categories/{id}
        group.MapDelete("/{id}", async (string id, ICategoryRepository repo, ShopSense.Api.Services.ICacheVersionProvider versions) =>
        {
            await repo.DeleteAsync(id);
            versions.Bump("/categories");
            return Results.NoContent();
        })

        .WithName("DeleteCategory")
        .Produces(StatusCodes.Status204NoContent);
    }
}
