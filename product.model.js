import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },             // Product name, required
    price: { type: Number, required: true },            // Price of the product, required
    description: { type: String },                      // Product description, optional
    category: { type: String },                         // Category of the product
    stock: { type: Number, default: 0 },                // Stock count, defaults to 0
    isAvailable: { type: Boolean, default: true },      // Availability status, defaults to true
    ratings: [{ type: Number }],                        // Array of ratings (numbers)
    imageUrl: { type: String },                         // URL of the product image
  },
  {
    timestamps: true,  // Adds createdAt and updatedAt fields automatically
  }
);

export default mongoose.model("Product", productSchema);
