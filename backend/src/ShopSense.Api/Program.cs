using MongoDB.Bson;
using MongoDB.Driver;
using ShopSense.Domain.Repositories;
using ShopSense.Infrastructure.Repositories.Mongo;
using ShopSense.Api; // habilita app.MapCategories()
// no topo
using MongoDB.Bson.Serialization.Conventions;

var builder = WebApplication.CreateBuilder(args);

var camelCasePack = new ConventionPack { new CamelCaseElementNameConvention() };
ConventionRegistry.Register("CamelCase", camelCasePack, _ => true);

// ===== Configurações =====
// Lê a connection string do ambiente (.env/compose) ou usa localhost como fallback
var mongoUri = Environment.GetEnvironmentVariable("MONGO_URI") ?? "mongodb://localhost:27017";
// Nome do banco conforme modelagem
var databaseName = Environment.GetEnvironmentVariable("MONGO_DATABASE") ?? "shopsense";

// ===== Serviços (DI) =====
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoUri));
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(databaseName);
});

// Repositórios concretos (Mongo)
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IInventoryMovementRepository, InventoryMovementRepository>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger UI em Dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Endpoints de Categorias
app.MapCategories();
// Endpoints de products
app.MapProducts();

// ===== Healthcheck simples (Mongo) =====
app.MapGet("/health", async (IMongoDatabase db) =>
{
    try
    {
        // Comando ping para validar conectividade com o Mongo
        var ping = new BsonDocument("ping", 1);
        await db.RunCommandAsync<BsonDocument>(ping);
        return Results.Ok(new { status = "ok", database = databaseName });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
})
.WithName("Health")
.Produces(StatusCodes.Status200OK)
.Produces(StatusCodes.Status500InternalServerError);
// Endpoints de categorias

app.Run();
