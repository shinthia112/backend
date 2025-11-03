import express from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

// CRUD routes
router.get("/", getProducts);           // GET /api/products
router.get("/:id", getProduct);        // GET /api/products/:id
router.post("/", createProduct);       // POST /api/products
router.put("/:id", updateProduct);     // PUT /api/products/:id
router.delete("/:id", deleteProduct);  // DELETE /api/products/:id

export default router;

