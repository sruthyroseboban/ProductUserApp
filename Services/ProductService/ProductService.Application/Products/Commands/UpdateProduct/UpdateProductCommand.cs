using MediatR;

namespace ProductService.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommand : IRequest<Unit>
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public DateTime DateOfManufacture { get; set; }
    public DateTime DateOfExpiry { get; set; }
}
