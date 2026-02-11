using MediatR;
using ProductUserApp.Application.Interfaces;

namespace ProductUserApp.Application.Products.Commands.DeleteProduct;

public class DeleteProductCommandHandler
    : IRequestHandler<DeleteProductCommand, Unit>
{
    private readonly IProductRepository _repository;

    public DeleteProductCommandHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        await _repository.DeleteAsync(request.Id);
        return Unit.Value;
    }

}
