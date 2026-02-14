using MediatR;
using ProductUserApp.Application.Interfaces;
using ProductUserApp.Application.Products.DTOs;

namespace ProductUserApp.Application.Products.Queries.GetProductsByUserId;

public class GetProductsByUserIdQueryHandler
    : IRequestHandler<GetProductsByUserIdQuery, List<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetProductsByUserIdQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProductDto>> Handle(
        GetProductsByUserIdQuery request,
        CancellationToken cancellationToken)
    {
        var products = await _repository.GetByUserIdAsync(request.UserId);

        return products.Select(product => new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            DateOfManufacture = product.DateOfManufacture,
            DateOfExpiry = product.DateOfExpiry,
            CreatedByUserId = product.CreatedByUserId
        }).ToList();
    }
}
