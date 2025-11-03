import mongoose from 'mongoose';

// Cart schema definition
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Each cart is associated with a user
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true, // Each item must reference a product
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Minimum of 1 product
        },
        price: {
          type: Number,
          required: true, // Price of the product at the time it's added to the cart
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0, // Total price of the cart, auto-calculated on save
    },
    status: {
      type: String,
      enum: ['active', 'ordered', 'cancelled'],
      default: 'active', // Default status of the cart
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Middleware to calculate total price before saving the cart
cartSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.totalPrice = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  } else {
    this.totalPrice = 0; // If no items, set totalPrice to 0
  }
  next();
});

// Cart model export
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
