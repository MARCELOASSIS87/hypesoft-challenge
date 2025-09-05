namespace ShopSense.Api.Services;

public interface ICacheVersionProvider
{
    /// <summary>Retorna o número de versão atual do escopo (ex.: "/products").</summary>
    int GetVersion(string scope);

    /// <summary>Incrementa a versão de um escopo, invalidando todas as entradas antigas daquele escopo.</summary>
    void Bump(string scope);
}
