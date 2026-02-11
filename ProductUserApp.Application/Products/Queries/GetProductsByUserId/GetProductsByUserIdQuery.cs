using MediatR;
using ProductUserApp.Application.Products.DTOs;

namespace ProductUserApp.Application.Products.Queries;

public record GetProductsByUserIdQuery(int UserId)
    : IRequest<List<ProductDto>>;
