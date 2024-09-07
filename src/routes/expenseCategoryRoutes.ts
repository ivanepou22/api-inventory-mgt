import express from "express";
import {
  createExpenseCategory,
  getExpenseCategories,
  getExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "@/controllers/expenseCategoryController";

const expenseCategoryRouter = express.Router();

expenseCategoryRouter.post("/expense-categories", createExpenseCategory);
expenseCategoryRouter.get("/expense-categories", getExpenseCategories);
expenseCategoryRouter.get("/expense-categories/:id", getExpenseCategory);
expenseCategoryRouter.put("/expense-categories/:id", updateExpenseCategory);
expenseCategoryRouter.delete("/expense-categories/:id", deleteExpenseCategory);

export default expenseCategoryRouter;
