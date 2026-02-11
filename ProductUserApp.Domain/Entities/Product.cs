namespace ProductUserApp.Domain.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public DateTime DateOfManufacture { get; set; }
    public DateTime DateOfExpiry { get; set; }
    public int CreatedByUserId { get; set; }
}


////using MongoDB.Bson;
////using MongoDB.Bson.Serialization.Attributes;

//namespace ProductUserApp.Domain.Entities;

//public class Product
//{
//    //[BsonId]
//    //[BsonRepresentation(BsonType.ObjectId)]
//    //public string Id { get; set; } = string.Empty;

//    //[BsonElement("name")]
//    //public string Name { get; set; } = default!;

//    //[BsonElement("price")]
//    //public decimal Price { get; set; }

//    //[BsonElement("dateOfManufacture")]
//    //public DateTime DateOfManufacture { get; set; }

//    //[BsonElement("dateOfExpiry")]
//    //public DateTime DateOfExpiry { get; set; }

//    //[BsonElement("createdByUserId")]
//    //public int CreatedByUserId { get; set; }
//}






