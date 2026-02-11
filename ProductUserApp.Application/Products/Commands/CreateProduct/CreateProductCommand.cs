using MediatR;

namespace ProductUserApp.Application.Products.Commands.CreateProduct;

public class CreateProductCommand : IRequest<int>
{
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public DateTime DateOfManufacture { get; set; }
    public DateTime DateOfExpiry { get; set; }
    public int CreatedByUserId { get; set; }
}
