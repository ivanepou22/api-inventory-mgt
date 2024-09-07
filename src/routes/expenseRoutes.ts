import express from "express";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "@/controllers/expenseController";

const expenseRouter = express.Router();

expenseRouter.post("/expenses", createExpense);
expenseRouter.get("/expenses", getExpenses);
expenseRouter.get("/expenses/:id", getExpense);
expenseRouter.put("/expenses/:id", updateExpense);
expenseRouter.delete("/expenses/:id", deleteExpense);

export default expenseRouter;
