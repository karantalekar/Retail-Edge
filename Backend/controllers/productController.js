import Product from "../models/Products.js";

// ─── Create Product ────────────────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;

    // 🔍 Check if product with same name already exists
    const existingProduct = await Product.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists!" });
    }

    const product = new Product({ name, category, quantity, price });
    await product.save();
    res.status(200).json({ message: "Product Added Success !!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get All Products ──────────────────────────────────────────────────────
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Product ────────────────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if another product with same name already exists
    if (name) {
      const existingProduct = await Product.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: `^${name}$`, $options: "i" },
      });
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Another product with this name already exists!" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Product ────────────────────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
