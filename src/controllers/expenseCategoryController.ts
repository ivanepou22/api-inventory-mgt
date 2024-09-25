import { expenseCategoryService } from "@/services/expenseCategoryService";
import { Request, Response } from "express";

export const createExpenseCategory = async (req: Request, res: Response) => {
  try {
    const newExpenseCategory =
      await expenseCategoryService.createExpenseCategory(req.body);
    return res.status(201).json(newExpenseCategory);
  } catch (error: any) {
    console.error("Error creating ExpenseCategory:", error);
    return res.status(500).json({
      error: `Failed to create expense category: ${error.message}`,
    });
  }
};

export const getExpenseCategories = async (_req: Request, res: Response) => {
  try {
    const expenseCategories =
      await expenseCategoryService.getExpenseCategories();
    return res.status(200).json(expenseCategories);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      error: `Failed to get expense categories: ${err.message}`,
    });
  }
};

export const getExpenseCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expenseCategory = await expenseCategoryService.getExpenseCategory(id);
    return res.status(200).json(expenseCategory);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get expense category: ${error.message}`,
    });
  }
};

export const updateExpenseCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expenseCategory = await expenseCategoryService.updateExpenseCategory(
      id,
      req.body
    );
    return res.status(200).json(expenseCategory);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to update expense category: ${error.message}`,
    });
  }
};

//delete
export const deleteExpenseCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expenseCategory = await expenseCategoryService.deleteExpenseCategory(
      id
    );
    return res.status(200).json(expenseCategory);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to delete expense category: ${error.message}`,
    });
  }
};
