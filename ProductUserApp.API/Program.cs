using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using ProductUserApp.Application;
using ProductUserApp.Application.Common.Interfaces;
using ProductUserApp.Application.Interfaces;
using ProductUserApp.Infrastructure.Data;
using ProductUserApp.Infrastructure.Repositories;
using ProductUserApp.Infrastructure.Services;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

//database connection string is in appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

//add controllers for API endpoints
builder.Services.AddControllers();

//swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//mediatr for CQRS pattern
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(ProductUserApp.Application.AssemblyReference).Assembly);
});

//dependency injection for application services and repositories
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

builder.Services.AddScoped<IApplicationDbContext>(provider =>
    provider.GetRequiredService<AppDbContext>());

builder.Services.AddScoped<IProductRepository, ProductRepository>();

builder.Services.AddScoped<IJwtService, JwtTokenGenerator>();

//jwt authentication 
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

//cors policy to allow Angular frontend to access the API
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
