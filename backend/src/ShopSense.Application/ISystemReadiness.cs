using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ShopSense.Application
{
    public interface ISystemReadiness
    {
        Task<ReadinessReport> CheckAsync(CancellationToken ct = default);
    }

    public sealed record ReadinessReport(
        bool Ok,
        string Status,
        IReadOnlyDictionary<string, string> Components
    );
}
