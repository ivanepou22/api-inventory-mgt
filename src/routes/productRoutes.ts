import express from "express";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProduct,
  getProducts,
  getProductsByBrand,
  getProductsByCategory,
  searchProducts,
  updateProduct,
} from "@/controllers/productController";

const productRouter = express.Router();

productRouter.post("/products", createProduct);
productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);
productRouter.get("/products/brand/:brandId", getProductsByBrand);
productRouter.get("/products/featured", getFeaturedProducts);
productRouter.get("/products/category/:categoryId", getProductsByCategory);
productRouter.get("/products/search", searchProducts);

export default productRouter;
