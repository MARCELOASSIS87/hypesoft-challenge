using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Middlewares;

public static class ProblemDetailsExtensions
{
    public static IResult ToProblem(this HttpContext ctx, int status, string title, string code)
    {
        var pd = new ProblemDetails
        {
            Status = status,
            Title = title,
            Type = $"urn:shopsense:error:{code}",
            Instance = ctx.TraceIdentifier
        };

        return Results.Problem(
            statusCode: pd.Status,
            title: pd.Title,
            type: pd.Type,
            instance: pd.Instance
        );
    }
}
