using MediatR;
using ProductService.Application.Common.Interfaces;
using ProductService.Application.Products.DTOs;

namespace ProductService.Application.Products.Queries.GetAllProducts;

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetAllProductsQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetAllAsync();

        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price,
            DateOfManufacture = p.DateOfManufacture,
            DateOfExpiry = p.DateOfExpiry,
            CreatedByUserId = p.CreatedByUserId
        }).ToList();
    }
}
