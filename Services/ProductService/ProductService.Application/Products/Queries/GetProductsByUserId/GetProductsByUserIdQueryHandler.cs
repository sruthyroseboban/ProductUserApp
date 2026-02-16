using MediatR;
using ProductService.Application.Common.Interfaces;
using ProductService.Application.Products.DTOs;

namespace ProductService.Application.Products.Queries.GetProductsByUserId;

public class GetProductsByUserIdQueryHandler : IRequestHandler<GetProductsByUserIdQuery, List<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetProductsByUserIdQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProductDto>> Handle(GetProductsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetByUserIdAsync(request.UserId);

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
