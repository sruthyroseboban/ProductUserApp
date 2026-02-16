using MediatR;
using Microsoft.AspNetCore.Mvc;
using ProductService.Application.Products.Commands.CreateProduct;
using ProductService.Application.Products.Commands.UpdateProduct;
using ProductService.Application.Products.Queries.GetAllProducts;
using ProductService.Application.Products.Commands.DeleteProduct;
using ProductService.Application.Products.Queries.GetProductById;
using ProductService.Application.Products.Queries.GetProductsByUserId;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ProductService.API.Controllers;

[Authorize]
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        // SECURITY: Always get userId from JWT, never trust client input
        var userId = GetUserIdFromToken();
        command.CreatedByUserId = userId;

        var productId = await _mediator.Send(command);
        return Ok(new { id = productId });
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        // Try multiple role claim types
        var role = User.FindFirst(ClaimTypes.Role)?.Value
                ?? User.FindFirst("role")?.Value;

        _logger.LogInformation($"User role: {role}, IsAdmin: {User.IsInRole("Admin")}");

        // Admin can see all products
        if (User.IsInRole("Admin"))
        {
            _logger.LogInformation("Admin requesting all products");
            return Ok(await _mediator.Send(new GetAllProductsQuery()));
        }

        // Regular users see only their own products
        var userId = GetUserIdFromToken();
        _logger.LogInformation($"User {userId} requesting their products");
        return Ok(await _mediator.Send(new GetProductsByUserIdQuery(userId)));
    }


    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllProducts()
    {
        //// Log all claims for debugging
        //var allClaims = string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"));
        //_logger.LogInformation($"GetAllProducts called. Claims: {allClaims}");

        //// Try multiple role claim types (handles different claim type formats)
        //var role = User.FindFirst(ClaimTypes.Role)?.Value
        //        ?? User.FindFirst("role")?.Value;

        //var isAdmin = User.IsInRole("Admin");
        //_logger.LogInformation($"Admin explicitly requesting all products. Role: {role}, IsAdmin: {isAdmin}");

        return Ok(await _mediator.Send(new GetAllProductsQuery()));
    }

    [HttpGet("my-products")]
    public async Task<IActionResult> GetMyProducts()
    {
        var userId = GetUserIdFromToken();
        _logger.LogInformation($"User {userId} requesting my-products");
        return Ok(await _mediator.Send(new GetProductsByUserIdQuery(userId)));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var product = await _mediator.Send(new GetProductByIdQuery(id));

        if (!User.IsInRole("Admin"))
        {
            var userId = GetUserIdFromToken();
            var productDto = product as ProductService.Application.Products.DTOs.ProductDto;

            if (productDto != null && productDto.CreatedByUserId != userId)
            {
                _logger.LogWarning($"User {userId} attempted to access product {id} owned by {productDto.CreatedByUserId}");
                return Forbid();
            }
        }

        return Ok(product);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateProductCommand command)
    {
        if (id != command.Id)
            return BadRequest("Product ID mismatch");

        if (!User.IsInRole("Admin"))
        {
            var product = await _mediator.Send(new GetProductByIdQuery(id));
            var productDto = product as ProductService.Application.Products.DTOs.ProductDto;
            var userId = GetUserIdFromToken();

            if (productDto != null && productDto.CreatedByUserId != userId)
            {
                _logger.LogWarning($"User {userId} attempted to update product {id} owned by {productDto.CreatedByUserId}");
                return Forbid();
            }
        }

        await _mediator.Send(command);
        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!User.IsInRole("Admin"))
        {
            var product = await _mediator.Send(new GetProductByIdQuery(id));
            var productDto = product as ProductService.Application.Products.DTOs.ProductDto;
            var userId = GetUserIdFromToken();

            if (productDto != null && productDto.CreatedByUserId != userId)
            {
                _logger.LogWarning($"User {userId} attempted to delete product {id} owned by {productDto.CreatedByUserId}");
                return Forbid();
            }
        }

        await _mediator.Send(new DeleteProductCommand(id));
        return NoContent();
    }


    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("sub")?.Value
                       ?? User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            _logger.LogError("UserId claim not found in JWT token. Available claims: {Claims}",
                string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}")));
            throw new UnauthorizedAccessException("User ID not found in token");
        }

        if (!int.TryParse(userIdClaim, out int userId))
        {
            _logger.LogError($"Invalid userId format in token: {userIdClaim}");
            throw new UnauthorizedAccessException("Invalid user ID format");
        }

        _logger.LogInformation($"Extracted userId: {userId} from token");
        return userId;
    }
}
