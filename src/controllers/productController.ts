import { productService } from "@/services/productService";
import { Request, Response } from "express";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    return res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Error creating Product:", error);
    return res.status(500).json({
      error: `Failed to create Product: ${error.message}`,
    });
  }
};

// Get all products
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching Products:", error);
    return res.status(500).json({
      error: `Failed to fetch Products: ${error.message}`,
    });
  }
};

// Get a single product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProduct(id);
    return res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching Product:", error);
    return res.status(500).json({
      error: `Failed to fetch Product: ${error.message}`,
    });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating Product:", error);
    return res.status(500).json({
      error: `Failed to update Product: ${error.message}`,
    });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedProduct = await productService.deleteProduct(id);
    return res.status(200).json(deletedProduct);
  } catch (error: any) {
    console.error("Error deleting Product:", error.message);
    return res
      .status(500)
      .json({ error: `Failed to delete Product: ${error.message}` });
  }
};

// Get products by brand
export const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    const products = await productService.getProductsByBrand(brandId);
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching Products by Brand:", error);
    return res.status(500).json({
      error: `Failed to fetch Products by Brand: ${error.message}`,
    });
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const featuredProducts = await productService.getFeaturedProducts();
    return res.status(200).json(featuredProducts);
  } catch (error: any) {
    console.error("Error fetching Featured Products:", error);
    return res.status(500).json({
      error: `Failed to fetch Featured Products: ${error.message}`,
    });
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    } else {
      const products = await productService.searchProducts(query);
      return res.status(200).json(products);
    }
  } catch (error: any) {
    console.error("Error searching Products:", error);
    return res.status(500).json({
      error: `Failed to search Products: ${error.message}`,
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const products = await productService.getProductsByCategory(categoryId);
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching Products by Category:", error);
    return res.status(500).json({
      error: `Failed to fetch Products by Category: ${error.message}`,
    });
  }
};

//positive adjustment of stock quantity
export const updateStockQty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockQty } = req.body;
    const updatedProduct = await productService.updateStockQty(id, stockQty);
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating Stock Quantity:", error);
    return res.status(500).json({
      error: `Failed to update Stock Quantity: ${error.message}`,
    });
  }
};

//negative adjustment of stock quantity
export const negativeStockQty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockQty } = req.body;
    const updatedProduct = await productService.negativeStockQty(id, stockQty);
    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating Stock Quantity:", error);
    return res.status(500).json({
      error: `Failed to update Stock Quantity: ${error.message}`,
    });
  }
};
