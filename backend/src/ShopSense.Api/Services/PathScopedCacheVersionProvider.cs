using System.Collections.Concurrent;
using System.Threading;

namespace ShopSense.Api.Services;

public sealed class PathScopedCacheVersionProvider : ICacheVersionProvider
{
    private readonly ConcurrentDictionary<string, int> _versions = new(StringComparer.OrdinalIgnoreCase);

    public int GetVersion(string scope)
    {
        if (string.IsNullOrWhiteSpace(scope)) scope = "/";
        return _versions.TryGetValue(scope, out var v) ? v : 0;
    }

    public void Bump(string scope)
    {
        if (string.IsNullOrWhiteSpace(scope)) scope = "/";
        _versions.AddOrUpdate(scope, 1, (_, old) => Interlocked.Increment(ref old));
    }
}
