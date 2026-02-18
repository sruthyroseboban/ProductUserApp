using MediatR;
using ProductService.Application.Common.Models;
using ProductService.Application.Products.DTOs;

namespace ProductService.Application.Products.Queries.GetAllProducts;

public record GetAllProductsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PagedResult<ProductDto>>;
