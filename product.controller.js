import Product from "../models/product.model.js";
import { z } from "zod";

//  Zod schema for product validation
const productValidator = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  price: z.number().positive("Price must be positive"),
  description: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().nonnegative().default(0),
  isAvailable: z.boolean().optional(),
  ratings: z.array(z.number().min(0).max(5)).optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

//  Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

//  Get single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

//  Create new product
export const createProduct = async (req, res) => {
  try {
    // Validate using Zod
    const validatedData = productValidator.parse(req.body);

    // Create and save new product
    const newProduct = new Product(validatedData);
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

//  Update product by ID
export const updateProduct = async (req, res) => {
  try {
    // Validate input
    const validatedData = productValidator.partial().parse(req.body);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

//  Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
