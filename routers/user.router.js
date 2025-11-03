import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// CRUD routes
router.get("/", getUsers);           // GET /api/users
router.get("/:id", getUser);         // GET /api/users/:id
router.post("/", createUser);        // POST /api/users
router.put("/:id", updateUser);      // PUT /api/users/:id
router.delete("/:id", deleteUser);   // DELETE /api/users/:id

export default router;

