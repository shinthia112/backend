import Cart from '../models/cart.model.js'; // Adjust path if needed

// Get a cart for a specific user by userId
export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;  // Retrieve userId from the URL params
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Create a new cart
export const createCart = async (req, res) => {
    try {
        // The totalPrice calculation is handled by the pre('save') hook in the model.
        const { userId, items } = req.body;
        
        if (!userId || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Missing required fields: userId and items array' });
        }
        
        const cart = new Cart({
            userId,
            items,
            // totalPrice will be set by the model hook before saving
        });
        
        await cart.save();
        res.status(201).json({ message: 'Cart created successfully', cart });

    } catch (error) {
        res.status(500).json({ message: 'Error creating cart', error: error.message });
    }
};

// Update a cart (for example, updating items)
export const updateCart = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    
    try {
        // NOTE: The totalPrice calculation is automatically handled 
        // by the pre('findOneAndUpdate') hook in the model if 'items' is present in 'updates'.
        // We are removing the check for 'updates.status' to allow the user's preferred body format.
        // Mongoose will handle validation for the 'status' enum if it's present.
        const updatedCart = await Cart.findOneAndUpdate(
            { userId }, 
            updates, 
            {
                new: true,
                runValidators: true // Ensures model rules (like min: 1 for quantity) are checked
            }
        );
        
        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
        
        res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });

    } catch (error) {
        // Log the detailed error to the console for easier debugging
        console.error("Error during Cart Update:", error.message, error); 
        res.status(500).json({
            message: 'Error updating cart', 
            error: error.message 
        });
    }
};

// Delete a cart by userId
export const deleteCart = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const deletedCart = await Cart.findOneAndDelete({ userId });
        
        if (!deletedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart deleted successfully', cart: deletedCart });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting cart', error: error.message });
    }
};

// Optionally: Get all carts (if you need this route)
export const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('items.productId');
        
        if (carts.length === 0) {
            return res.status(404).json({ message: 'No carts found' });
        }
        
        res.status(200).json(carts);
    
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carts', error: error.message });
    }
};
