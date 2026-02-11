using MediatR;
using ProductUserApp.Application.Interfaces;
using ProductUserApp.Application.Products.DTOs;

namespace ProductUserApp.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler
    : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IProductRepository _repository;

    public GetProductByIdQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id);

        if (product == null)
            return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            DateOfManufacture = product.DateOfManufacture,
            DateOfExpiry = product.DateOfExpiry,
            CreatedByUserId = product.CreatedByUserId
        };
    }
}
