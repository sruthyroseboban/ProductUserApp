using MediatR;
using ProductUserApp.Application.Products.DTOs;

namespace ProductUserApp.Application.Products.Queries.GetProductsByUserId;

public record GetProductsByUserIdQuery(int UserId)
    : IRequest<List<ProductDto>>;
