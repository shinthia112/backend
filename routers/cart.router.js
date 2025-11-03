import express from 'express';
import {
  getUserCart,
  createCart,
  updateCart,
  deleteCart,
  getAllCarts,  // Optionally, if you want a route to get all carts
} from '../controllers/cart.controller.js';  // Ensure path is correct for your controller

const router = express.Router();

// Fetch a user's cart by userId
router.get('/:userId', getUserCart);

// Create a new cart
router.post('/', createCart);

// Update an existing cart for a user
router.put('/:userId', updateCart);

// Delete a cart for a user
router.delete('/:userId', deleteCart);

// Optionally, if you want to fetch all carts (for testing purposes)
router.get('/', getAllCarts);  // Get all carts

export default router;
