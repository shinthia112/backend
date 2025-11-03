import mongoose from "mongoose";
import bcrypt from "bcryptjs";        // for password hashing

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"]
    },
    age: { 
      type: Number, 
      required: [true, "Age is required"], 
      min: [0, "Age must be positive"] 
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [6, "Password must be at least 6 characters"] 
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    hobbies: [{ type: String, trim: true }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { 
    timestamps: true 
  }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);

