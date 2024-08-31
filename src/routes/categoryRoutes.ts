import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} from "@/controllers/categoryController";

const categoryRouter = express.Router();

categoryRouter.post("/categories", createCategory);
categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:id", getCategory);
categoryRouter.put("/categories/:id", updateCategory);
categoryRouter.delete("/categories/:id", deleteCategory);

export default categoryRouter;
