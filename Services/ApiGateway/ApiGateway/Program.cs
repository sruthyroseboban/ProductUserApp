using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Load Ocelot configuration (localhost development only)
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Add Ocelot services
builder.Services.AddOcelot();

// Add CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

Console.WriteLine("API Gateway starting on http://localhost:5000");
Console.WriteLine("Routing to:");
Console.WriteLine("  /users      → http://localhost:5100/api/users");
Console.WriteLine("  /products   → http://localhost:5050/api/products");

// Use CORS
app.UseCors("AllowAngular");

// Use Ocelot middleware
await app.UseOcelot();

app.Run();
