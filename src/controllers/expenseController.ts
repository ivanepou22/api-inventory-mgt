import { db } from "@/db/db";
import { Request, Response } from "express";

export const createExpense = async (req: Request, res: Response) => {
  const {
    title,
    amount,
    date,
    description,
    attachments,
    shopId,
    expenseCategoryId,
    payeeId,
  } = req.body;

  try {
    const newExpense = await db.expense.create({
      data: {
        title,
        amount,
        date,
        description,
        attachments,
        shopId,
        expenseCategoryId,
        payeeId,
      },
    });

    return res.status(201).json({
      data: newExpense,
      error: null,
      message: "Expense created successfully",
    });
  } catch (error) {
    console.error("Error creating Expense:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getExpenses = async (_req: Request, res: Response) => {
  try {
    const expenses = await db.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: expenses,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expense = await db.expense.findUnique({
      where: {
        id,
      },
    });
    if (!expense) {
      return res.status(404).json({
        data: null,
        error: `Expense not found.`,
      });
    }
    return res.status(200).json({
      data: expense,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    title,
    amount,
    date,
    description,
    attachments,
    shopId,
    expenseCategoryId,
    payeeId,
  } = req.body;

  try {
    const expenseExists = await db.expense.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        amount: true,
        date: true,
        description: true,
        attachments: true,
        shopId: true,
        expenseCategoryId: true,
        payeeId: true,
      },
    });

    if (!expenseExists) {
      return res.status(404).json({ error: "expense not found." });
    }
    // Perform the update
    const updatedExpense = await db.expense.update({
      where: { id },
      data: {
        title,
        amount,
        date,
        description,
        attachments,
        shopId,
        expenseCategoryId,
        payeeId,
      },
    });
    return res.status(200).json({
      data: updatedExpense,
      message: "expense updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the expense exists
    const expense = await db.expense.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!expense) {
      return res.status(404).json({ error: "expense not found." });
    }
    // Delete the expense
    const deletedExpense = await db.expense.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedExpense,
      message: `expense deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
