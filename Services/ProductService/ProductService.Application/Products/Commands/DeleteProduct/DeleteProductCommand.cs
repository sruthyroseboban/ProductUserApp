using MediatR;

namespace ProductService.Application.Products.Commands.DeleteProduct;

public record DeleteProductCommand(string Id) : IRequest<Unit>;
