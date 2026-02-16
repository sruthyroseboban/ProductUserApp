using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using ProductService.Application.Common.Interfaces;
using ProductService.Infrastructure.Data;
using ProductService.Infrastructure.Repositories;

// Create builder without default configuration
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = Directory.GetCurrentDirectory()
});

// Configure URLs BEFORE anything else - this takes priority
var port = Environment.GetEnvironmentVariable("PRODUCTSERVICE_PORT") 
    ?? builder.Configuration["ServiceSettings:Port"] 
    ?? "5050";

// Use 0.0.0.0 to listen on all interfaces
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

Console.WriteLine($"ProductService will start on port: {port}");

// Configure MongoDB
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDB"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// MediatR for CQRS
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(ProductService.Application.AssemblyReference).Assembly);
});

// Register MongoDB Repository
builder.Services.AddSingleton<IProductRepository, ProductRepository>();

// JWT Authentication
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
        NameClaimType = JwtRegisteredClaimNames.Sub  
    };

    // Log token validation for debugging
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var claims = context.Principal?.Claims.Select(c => $"{c.Type}={c.Value}");
            Console.WriteLine($"Token validated. Claims: {string.Join(", ", claims ?? Array.Empty<string>())}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// CORS for Angular
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

