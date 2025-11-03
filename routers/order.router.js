import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

// Routes
router.get("/", getOrders); // Get all orders or by query
router.get("/:id", getOrder); // Get single order
router.post("/", createOrder); // Create new order
router.put("/:id", updateOrder); // Full update
router.patch("/:id/status", updateOrderStatus); // Only update status
router.delete("/:id", deleteOrder); // Delete order
router.get("/user/:userId", getUserOrders); // Orders by user

export default router;
