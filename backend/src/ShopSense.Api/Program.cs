using MongoDB.Bson;
using MongoDB.Driver;
using ShopSense.Domain.Repositories;
using ShopSense.Infrastructure.Repositories.Mongo;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using ShopSense.Api; // habilita app.MapCategories()
using MongoDB.Bson.Serialization.Conventions;
using ShopSense.Api.Extensions;       // (mantida, caso você use outras extensões aqui)
using ShopSense.Api.Endpoints;
using ShopSense.Api.Middlewares;      // UseRequestId
using ShopSense.Application;          // ISystemReadiness
using ShopSense.Infrastructure.Services; // SystemReadiness

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

// Readiness (registrar aqui para evitar extensão duplicada em Infrastructure)
builder.Services.AddSingleton<ISystemReadiness, SystemReadiness>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// CORS (origens do appsettings: Security:AllowedOrigins)
var allowedOrigins = builder.Configuration.GetSection("Security:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCors", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Rate Limiting (FixedWindow) lendo do appsettings
var rlSection = builder.Configuration.GetSection("Security:RateLimiting:FixedWindow");
var permitLimit = rlSection.GetValue<int?>("PermitLimit") ?? 100;
var windowSeconds = rlSection.GetValue<int?>("WindowSeconds") ?? 60;
var queueLimit = rlSection.GetValue<int?>("QueueLimit") ?? 0;

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.PermitLimit = permitLimit;
        opt.Window = TimeSpan.FromSeconds(windowSeconds);
        opt.QueueLimit = queueLimit;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });

    // ✅ aplica limite global para todas as requisições
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: "global",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = permitLimit,
                Window = TimeSpan.FromSeconds(windowSeconds),
                QueueLimit = queueLimit,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            }
        )
    );

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

// Swagger UI em Dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRequestId();
// HTTPS + HSTS (apenas produção para HSTS)
app.UseHttpsRedirection();
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

// Security Headers mínimos
app.Use(async (ctx, next) =>
{
    var h = ctx.Response.Headers;
    h["X-Content-Type-Options"] = "nosniff";
    h["X-Frame-Options"] = "DENY";
    h["Referrer-Policy"] = "no-referrer";
    h["Cross-Origin-Opener-Policy"] = "same-origin";
    h["Cross-Origin-Resource-Policy"] = "same-site";
    // Ajuste conforme necessidade; permissões conservadoras:
    h["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});

// CORS (depois dos headers, antes dos endpoints)
app.UseCors("DefaultCors");
// Rate Limiter (antes do mapeamento dos endpoints)
app.UseRateLimiter();
// Endpoints de Categorias
app.MapCategories();
// Endpoints de products
app.MapProducts();
// Endpoints de inventory
app.MapInventory();
// Endpoints de baixo estoque
app.MapProductsLowStock();

// Endpoint de readiness (deve existir em Endpoints/ReadinessEndpoints.cs no mesmo padrão)
app.MapReadinessEndpoints();

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

app.Run();

// necessário para WebApplicationFactory<Program> nos testes
public partial class Program { }
