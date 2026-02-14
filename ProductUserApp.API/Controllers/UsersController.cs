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
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace ProductUserApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IMediator mediator, ILogger<UsersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
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
        return Ok(new { token });
    }
    // CREATE
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateUserCommand command)
        => Ok(await _mediator.Send(command));

    // READ ALL
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation($"true or false:{User.IsInRole("Admin").ToString()}");
        return Ok(await _mediator.Send(new GetAllUsersQuery())); }

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


//[Route("api/[controller]")]
//[ApiController]
//[Authorize(Roles = "Admin")]
//public class UsersController : ControllerBase
//{
//    private readonly ApplicationDbContext _context;

//    public UsersController(ApplicationDbContext context)
//    {
//        _context = context;
//    }

//    // GET: api/users
//    [HttpGet]
//    public async Task<IActionResult> GetAllUsers()
//    {
//        var users = await _context.Users.ToListAsync();
//        return Ok(users);
//    }

//    // GET: api/users/5
//    [HttpGet("{id}")]
//    public async Task<IActionResult> GetUserById(int id)
//    {
//        var user = await _context.Users.FindAsync(id);

//        if (user == null)
//            return NotFound();

//        return Ok(user);
//    }

//    // POST: api/users
//    [HttpPost]
//    public async Task<IActionResult> CreateUser(User user)
//    {
//        _context.Users.Add(user);
//        await _context.SaveChangesAsync();

//        return Ok(user);
//    }

//    // PUT: api/users/5
//    [HttpPut("{id}")]
//    public async Task<IActionResult> UpdateUser(int id, User updatedUser)
//    {
//        var user = await _context.Users.FindAsync(id);

//        if (user == null)
//            return NotFound();

//        user.Name = updatedUser.Name;
//        user.Email = updatedUser.Email;
//        user.Role = updatedUser.Role;

//        await _context.SaveChangesAsync();

//        return Ok(user);
//    }

//    // DELETE: api/users/5
//    [HttpDelete("{id}")]
//    public async Task<IActionResult> DeleteUser(int id)
//    {
//        var user = await _context.Users.FindAsync(id);

//        if (user == null)
//            return NotFound();

//        _context.Users.Remove(user);
//        await _context.SaveChangesAsync();

//        return Ok();
//    }
//}
