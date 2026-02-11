using ProductUserApp.Application.Users.Commands.CreateUser;
using ProductUserApp.Application.Users.Commands.LoginUser;
using ProductUserApp.Application.Users.Commands.RegisterUser;
using ProductUserApp.Application.Users.Commands.UpdateUser;
using ProductUserApp.Application.Users.Queries.GetAllUsers;
using ProductUserApp.Application.Users.Commands.DeleteUser;
using ProductUserApp.Application.Users.Queries.GetUserById;

using ProductUserApp.Application.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace ProductUserApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserCommand command)
    {
        var userId = await _mediator.Send(command);
        return Ok(userId);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserCommand command)
    {
        var token = await _mediator.Send(command);
        return Ok(token);
    }
    // CREATE
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateUserCommand command)
        => Ok(await _mediator.Send(command));

    // READ ALL
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _mediator.Send(new GetAllUsersQuery()));

    // READ BY ID
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _mediator.Send(new GetUserByIdQuery(id)));

    // UPDATE
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUserCommand command)
    {
        if (id != command.Id) return BadRequest();
        await _mediator.Send(command);
        return NoContent();
    }

    // DELETE
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteUserCommand(id));
        return NoContent();
    }
}

