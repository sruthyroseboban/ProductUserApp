using MediatR;
using Microsoft.AspNetCore.Mvc;
using ProductUserApp.Application.Products.Commands.CreateProduct;
using ProductUserApp.Application.Products.Commands.UpdateProduct;
using ProductUserApp.Application.Products.Queries.GetAllProducts;
using ProductUserApp.Application.Products.Commands.DeleteProduct;

namespace ProductUserApp.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        var productId = await _mediator.Send(command);
        return Ok(productId);
    }

    [HttpGet("{userId}")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllProductsQuery()));
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateProductCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteProductCommand(id));
        return NoContent();
    }
}


//new updatd controller

//using MediatR;
//using Microsoft.AspNetCore.Mvc;
//using ProductUserApp.Application.Products.Commands;
//using ProductUserApp.Application.Products.Queries;

//namespace ProductUserApp.API.Controllers;

//[ApiController]
//[Route("api/products")]
//public class ProductsController : ControllerBase
//{
//    private readonly IMediator _mediator;

//    public ProductsController(IMediator mediator)
//    {
//        _mediator = mediator;
//    }

//    // CREATE
//    [HttpPost]
//    public async Task<IActionResult> Create(CreateProductCommand command)
//        => Ok(await _mediator.Send(command));

//    // READ ALL PRODUCTS
//    [HttpGet]
//    public async Task<IActionResult> GetAll()
//        => Ok(await _mediator.Send(new GetAllProductsQuery()));

//    // READ PRODUCT BY ID
//    [HttpGet("{id}")]
//    public async Task<IActionResult> GetById(int id)
//        => Ok(await _mediator.Send(new GetProductByIdQuery(id)));

//    // READ PRODUCTS BY USER ID
//    [HttpGet("user/{userId}")]
//    public async Task<IActionResult> GetByUser(int userId)
//        => Ok(await _mediator.Send(new GetProductsByUserIdQuery(userId)));

//    // UPDATE
//    [HttpPut("{id}")]
//    public async Task<IActionResult> Update(int id, UpdateProductCommand command)
//    {
//        if (id != command.Id) return BadRequest();
//        await _mediator.Send(command);
//        return NoContent();
//    }

//    // DELETE
//    [HttpDelete("{id}")]
//    public async Task<IActionResult> Delete(int id)
//    {
//        await _mediator.Send(new DeleteProductCommand(id));
//        return NoContent();
//    }
//}
