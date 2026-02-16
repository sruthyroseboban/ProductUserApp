using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ProductService.Domain.Entities;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = default!;
    
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public DateTime DateOfManufacture { get; set; }
    public DateTime DateOfExpiry { get; set; }
    public int CreatedByUserId { get; set; }
}
