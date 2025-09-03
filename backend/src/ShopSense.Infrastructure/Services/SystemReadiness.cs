using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using ShopSense.Application;

namespace ShopSense.Infrastructure.Services
{
    public sealed class SystemReadiness : ISystemReadiness
    {
        private readonly IMongoClient _client;

        public SystemReadiness(IMongoClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public async Task<ReadinessReport> CheckAsync(CancellationToken ct = default)
        {
            var components = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            try
            {
                // Ping no Mongo. Usamos "admin" só para o comando; não precisamos do nome do DB da aplicação aqui.
                var adminDb = _client.GetDatabase("admin");
                var pingCmd = new BsonDocument("ping", 1);
                await adminDb.RunCommandAsync<BsonDocument>(pingCmd, cancellationToken: ct);

                components["mongo"] = "ok";
                return new ReadinessReport(true, "ready", components);
            }
            catch (Exception ex)
            {
                components["mongo"] = $"error: {ex.GetType().Name}: {ex.Message}";
                return new ReadinessReport(false, "degraded", components);
            }
        }
    }
}
