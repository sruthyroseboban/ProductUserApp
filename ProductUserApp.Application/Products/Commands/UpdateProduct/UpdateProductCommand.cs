using MediatR;

namespace ProductUserApp.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public DateTime DateOfManufacture { get; set; }
    public DateTime DateOfExpiry { get; set; }
}
