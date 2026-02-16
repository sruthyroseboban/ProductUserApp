using MediatR;
using ProductService.Application.Products.DTOs;

namespace ProductService.Application.Products.Queries.GetProductsByUserId;

public record GetProductsByUserIdQuery(int UserId) : IRequest<List<ProductDto>>;
