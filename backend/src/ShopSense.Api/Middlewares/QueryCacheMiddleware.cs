using System.Security.Cryptography;
using System.Text;
using System.Linq; // ✅ adicionar
using Microsoft.Extensions.Caching.Memory;

namespace ShopSense.Api.Middlewares;

/// Cache básico em memória para requisições GET.
/// Env vars:
///   CACHE_ENABLED=true|false   (default: true)
///   CACHE_TTL_SECONDS=60       (default: 60)
///   CACHE_PATHS=/products,/categories,/products/low-stock  (opcional; vazio => todas GET)
public sealed class QueryCacheMiddleware : IMiddleware
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<QueryCacheMiddleware> _logger;
    private readonly bool _enabled;
    private readonly TimeSpan _ttl;
    private readonly HashSet<string> _allowedPaths;

    public QueryCacheMiddleware(IMemoryCache cache, ILogger<QueryCacheMiddleware> logger, IConfiguration config)
    {
        _cache = cache;
        _logger = logger;
        _enabled = ReadEnabled(config);
        _ttl = ReadTtl(config);
        _allowedPaths = ReadAllowedPaths(config);
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (!_enabled || !HttpMethods.IsGet(context.Request.Method))
        {
            await next(context);
            return;
        }

        if (_allowedPaths.Count > 0 && !_allowedPaths.Contains(context.Request.Path.Value ?? ""))
        {
            await next(context);
            return;
        }

        var cacheKey = BuildCacheKey(context.Request);
        if (_cache.TryGetValue(cacheKey, out CachedResponse? cached) && cached is not null)
        {
            _logger.LogInformation("[Cache HIT] {Path}{Query}", context.Request.Path, context.Request.QueryString);
            context.Response.StatusCode = cached.StatusCode;
            foreach (var (k, v) in cached.Headers) context.Response.Headers[k] = v;
            if (!string.IsNullOrEmpty(cached.ContentType)) context.Response.ContentType = cached.ContentType;
            await context.Response.Body.WriteAsync(cached.Body, 0, cached.Body.Length);
            return;
        }

        _logger.LogInformation("[Cache MISS] {Path}{Query}", context.Request.Path, context.Request.QueryString);

        var originalBody = context.Response.Body;
        await using var memStream = new MemoryStream();
        context.Response.Body = memStream;

        try
        {
            await next(context);

            var isJson = (context.Response.ContentType ?? "").Contains("application/json", StringComparison.OrdinalIgnoreCase);
            if (context.Response.StatusCode == StatusCodes.Status200OK && isJson)
            {
                var bytes = memStream.ToArray();
                var headers = context.Response.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());
                var entry = new CachedResponse
                {
                    StatusCode = context.Response.StatusCode,
                    Headers = headers,
                    Body = bytes,
                    ContentType = context.Response.ContentType
                };
                _cache.Set(cacheKey, entry, _ttl);
            }

            memStream.Position = 0;
            await memStream.CopyToAsync(originalBody);
        }
        finally
        {
            context.Response.Body = originalBody;
        }
    }

    private static string BuildCacheKey(HttpRequest req)
    {
        var qs = req.Query
            .OrderBy(kv => kv.Key, StringComparer.OrdinalIgnoreCase)
            .Select(kv => $"{kv.Key}={string.Join(",", kv.Value.ToArray())}"); // ✅ separador string + ToArray()
        var raw = $"{req.Method}:{req.Path}?{string.Join("&", qs)}"; // ✅ separador string

        using var sha = SHA256.Create();
        var hash = Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(raw)));
        return $"qcache:{hash}";
    }

    private static bool ReadEnabled(IConfiguration cfg)
    {
        var val = cfg["CACHE_ENABLED"];
        return string.IsNullOrWhiteSpace(val) ? true : bool.TryParse(val, out var b) && b;
    }

    private static TimeSpan ReadTtl(IConfiguration cfg)
    {
        var val = cfg["CACHE_TTL_SECONDS"];
        return int.TryParse(val, out var seconds) && seconds > 0 ? TimeSpan.FromSeconds(seconds) : TimeSpan.FromSeconds(60);
    }

    private static HashSet<string> ReadAllowedPaths(IConfiguration cfg)
    {
        var csv = cfg["CACHE_PATHS"];
        if (string.IsNullOrWhiteSpace(csv)) return new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var split = csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return new HashSet<string>(split, StringComparer.OrdinalIgnoreCase);
    }

    private sealed class CachedResponse
    {
        public int StatusCode { get; set; }
        public Dictionary<string, string> Headers { get; set; } = new();
        public byte[] Body { get; set; } = Array.Empty<byte>();
        public string? ContentType { get; set; }
    }
}
