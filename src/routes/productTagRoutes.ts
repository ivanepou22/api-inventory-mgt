import express from "express";
import {
  createProductTag,
  deleteProductTag,
  getProductTag,
  getProductTags,
  updateProductTag,
} from "@/controllers/productTagController";

const productTagRouter = express.Router();

productTagRouter.post("/product-tags", createProductTag);
productTagRouter.get("/product-tags", getProductTags);
productTagRouter.get("/product-tags/:id", getProductTag);
productTagRouter.put("/product-tags/:id", updateProductTag);
productTagRouter.delete("/product-tags/:id", deleteProductTag);

export default productTagRouter;
