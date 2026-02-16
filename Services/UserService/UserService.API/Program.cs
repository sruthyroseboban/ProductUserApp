using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using UserService.Application.Common.Interfaces;
using UserService.Infrastructure.Data;
using UserService.Infrastructure.Services;

// Create builder without default configuration
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = Directory.GetCurrentDirectory()
});

// Configure URLs BEFORE anything else - this takes priority
var port = Environment.GetEnvironmentVariable("USERSERVICE_PORT") 
    ?? builder.Configuration["ServiceSettings:Port"] 
    ?? "5100";

// Use 0.0.0.0 to listen on all interfaces
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

Console.WriteLine($"UserService will start on port: {port}");

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(UserService.Application.AssemblyReference).Assembly);
});

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IUserDbContext>(provider =>
    provider.GetRequiredService<UserDbContext>());
builder.Services.AddScoped<IJwtService, JwtTokenGenerator>();

var jwtSection = builder.Configuration.GetSection("Jwt");
var keyString = jwtSection["Key"]
    ?? throw new Exception("JWT Key missing in configuration");
var issuer = jwtSection["Issuer"]
    ?? throw new Exception("JWT Issuer missing in configuration");
var audience = jwtSection["Audience"]
    ?? throw new Exception("JWT Audience missing in configuration");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(keyString)
        ),
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = ClaimTypes.NameIdentifier
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}


//Run migrations:

//Inside UserService project:

//Add - Migration InitialCreate
//Update-Database


//OR

//dotnet ef database update


//That will create UserServiceDb.