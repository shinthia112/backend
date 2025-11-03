import User from "../models/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";

// --- Zod schemas ---
// Create user validator
const createUserValidator = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email("Invalid email address."),
  age: z.number().int().positive("Age must be positive"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  role: z.enum(["user", "admin"]).optional(),
  isActive: z.boolean().optional(),
  hobbies: z.array(z.string()).optional(),
});

// Update user validator (partial)
const updateUserValidator = createUserValidator.partial();

// --- Controller functions ---

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get single user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const parsedData = createUserValidator.parse(req.body);

    // Check if email already exists
    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Create new user (password will be hashed via pre-save middleware)
    const newUser = await User.create(parsedData);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// Update existing user
export const updateUser = async (req, res) => {
  try {
    const parsedData = updateUserValidator.parse(req.body);

    // If password is included, hash it
    if (parsedData.password) {
      const salt = await bcrypt.genSalt(10);
      parsedData.password = await bcrypt.hash(parsedData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, parsedData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
