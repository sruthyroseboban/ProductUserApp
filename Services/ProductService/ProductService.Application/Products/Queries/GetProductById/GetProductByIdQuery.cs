using MediatR;
using ProductService.Application.Products.DTOs;

namespace ProductService.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(string Id) : IRequest<ProductDto>;
