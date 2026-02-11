using MediatR;
using ProductUserApp.Application.Products.DTOs;

namespace ProductUserApp.Application.Products.Queries.GetAllProducts;

public class GetAllProductsQuery : IRequest<List<ProductDto>>
{
}
