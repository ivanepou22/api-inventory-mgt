import { expenseService } from "@/services/expenseService";
import { Request, Response } from "express";

export const createExpense = async (req: Request, res: Response) => {
  try {
    const newExpense = await expenseService.createExpense(req.body);
    return res.status(201).json(newExpense);
  } catch (error: any) {
    console.error("Error creating Expense:", error);
    return res.status(500).json({
      error: `Failed to create expense: ${error.message}`,
    });
  }
};

export const getExpenses = async (_req: Request, res: Response) => {
  try {
    const expenses = await expenseService.getExpenses();
    return res.status(200).json(expenses);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      error: `Failed to get expenses: ${err.message}`,
    });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expense = await expenseService.getExpense(id);
    return res.status(200).json(expense);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get expense: ${error.message}`,
    });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expense = await expenseService.updateExpense(id, req.body);
    return res.status(200).json(expense);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to update expense: ${error.message}`,
    });
  }
};

//delete
export const deleteExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expense = await expenseService.deleteExpense(id);
    return res.status(200).json(expense);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to delete expense: ${error.message}`,
    });
  }
};
