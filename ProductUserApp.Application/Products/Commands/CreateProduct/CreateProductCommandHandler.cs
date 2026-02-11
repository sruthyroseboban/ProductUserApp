using MediatR;
using ProductUserApp.Application.Interfaces;
using ProductUserApp.Domain.Entities;

namespace ProductUserApp.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler
    : IRequestHandler<CreateProductCommand, int>
{
    private readonly IProductRepository _repository;

    public CreateProductCommandHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Price = request.Price,
            DateOfManufacture = request.DateOfManufacture,
            DateOfExpiry = request.DateOfExpiry,
            CreatedByUserId = request.CreatedByUserId
        };

        await _repository.AddAsync(product);

        return product.Id;
    }
}
