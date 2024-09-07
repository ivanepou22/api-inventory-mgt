import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Request, Response } from "express";

export const createExpenseCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  const slug = await slugify(name);

  const expenseCategoryExists = await db.expenseCategory.findUnique({
    where: {
      slug,
    },
  });

  if (expenseCategoryExists) {
    return res.status(409).json({
      error: `ExpenseCategory with slug: ${slug} already exists`,
    });
  }

  try {
    const newExpenseCategory = await db.expenseCategory.create({
      data: {
        name,
        slug,
      },
    });

    return res.status(201).json({
      data: newExpenseCategory,
      error: null,
      message: "ExpenseCategory created successfully",
    });
  } catch (error) {
    console.error("Error creating ExpenseCategory:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await db.expenseCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: categories,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getExpenseCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expenseCategory = await db.expenseCategory.findUnique({
      where: {
        id,
      },
    });
    if (!expenseCategory) {
      return res.status(404).json({
        data: null,
        error: `expenseCategory not found.`,
      });
    }
    return res.status(200).json({
      data: expenseCategory,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateExpenseCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, slug } = req.body;

  try {
    const expenseCategoryExists = await db.expenseCategory.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });

    if (!expenseCategoryExists) {
      return res.status(404).json({ error: "expenseCategory not found." });
    }

    if (slug && slug !== expenseCategoryExists.slug) {
      const expenseCategoryBySlug = await db.expenseCategory.findUnique({
        where: {
          slug,
        },
      });
      if (expenseCategoryBySlug) {
        return res.status(409).json({
          error: `expenseCategory with slug: ${slug} already exists`,
        });
      }
    }
    // Perform the update
    const updatedExpenseCategory = await db.expenseCategory.update({
      where: { id },
      data: { name, slug },
    });

    return res.status(200).json({
      data: updatedExpenseCategory,
      message: "ExpenseCategory updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating expenseCategory:", error);

    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteExpenseCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the expenseCategory exists
    const expenseCategory = await db.expenseCategory.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!expenseCategory) {
      return res.status(404).json({ error: "expenseCategory not found." });
    }
    // Delete the expenseCategory
    const deletedExpenseCategory = await db.expenseCategory.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedExpenseCategory,
      message: `ExpenseCategory deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting expenseCategory:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
