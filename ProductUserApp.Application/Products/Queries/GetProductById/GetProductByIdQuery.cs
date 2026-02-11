using MediatR;
using ProductUserApp.Application.Products.DTOs;

namespace ProductUserApp.Application.Products.Queries.GetProductById;

public class GetProductByIdQuery : IRequest<ProductDto?>
{
    public int Id { get; set; }

    public GetProductByIdQuery(int id)
    {
        Id = id;
    }
}
